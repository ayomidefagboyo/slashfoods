from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime
import logging
import random
import string

from ...core.database import get_db, get_database_service, DatabaseService
from ...models.schemas import (
    Order, OrderCreate, OrderUpdate, OrderItem,
    Customer, CustomerCreate, ErrorResponse
)

router = APIRouter()
logger = logging.getLogger(__name__)

def generate_order_id() -> str:
    """Generate human-readable order ID"""
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=9))
    return f"SL-{random_part}"

def generate_pickup_code() -> str:
    """Generate 4-digit pickup code"""
    return ''.join(random.choices(string.digits, k=4))

@router.post("/", response_model=Order)
async def create_order(
    order_data: OrderCreate,
    db: DatabaseService = Depends(get_database_service)
):
    """Create a new order"""
    try:
        # Generate unique IDs
        order_id = generate_order_id()
        pickup_code = generate_pickup_code()

        # Ensure pickup code is unique
        for _ in range(10):  # Max 10 attempts
            existing = db.client.table('orders').select('id').eq('pickup_code', pickup_code).execute()
            if not existing.data:
                break
            pickup_code = generate_pickup_code()
        else:
            raise HTTPException(status_code=500, detail="Failed to generate unique pickup code")

        # Create or get customer
        customer_data = CustomerCreate(
            name=order_data.customer_name,
            email=order_data.customer_email,
            phone=order_data.customer_phone
        )

        customer, _ = await db.get_or_create(
            'customers',
            {'email': customer_data.email},
            customer_data.dict()
        )

        # Validate deals and check availability
        validated_items = []
        total_amount = 0

        for item in order_data.items:
            # Get deal details
            deal_result = db.client.table('deals').select('*').eq('id', item.deal_id).single().execute()
            if not deal_result.data:
                raise HTTPException(status_code=400, detail=f"Deal {item.deal_id} not found")

            deal = deal_result.data
            if not deal['is_active']:
                raise HTTPException(status_code=400, detail=f"Deal {item.deal_id} is not active")

            if deal['available_quantity'] < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for deal {item.deal_id}. Available: {deal['available_quantity']}"
                )

            # Validate price
            expected_price = deal['discounted_price']
            if abs(item.unit_price - expected_price) > 0.01:  # Allow small floating point differences
                raise HTTPException(
                    status_code=400,
                    detail=f"Price mismatch for deal {item.deal_id}. Expected: {expected_price}, Got: {item.unit_price}"
                )

            validated_item = {
                'deal_id': item.deal_id,
                'deal_title': deal['title'],
                'partner_id': deal['partner_id'],
                'quantity': item.quantity,
                'unit_price': item.unit_price,
                'total_price': item.unit_price * item.quantity
            }
            validated_items.append(validated_item)
            total_amount += validated_item['total_price']

        # Validate total amount
        if abs(total_amount - order_data.total_amount) > 0.01:
            raise HTTPException(
                status_code=400,
                detail=f"Total amount mismatch. Calculated: {total_amount}, Provided: {order_data.total_amount}"
            )

        # Create order
        order_create_data = {
            'order_id': order_id,
            'customer_id': customer['id'],
            'customer_name': order_data.customer_name,
            'customer_email': order_data.customer_email,
            'customer_phone': order_data.customer_phone,
            'total_amount': total_amount,
            'pickup_code': pickup_code,
            'payment_method': order_data.payment_method,
            'payment_status': 'pending',
            'order_status': 'confirmed',
            'pickup_date': datetime.now().date().isoformat()
        }

        order = await db.create_with_retry('orders', order_create_data)
        if not order:
            raise HTTPException(status_code=500, detail="Failed to create order")

        # Create order items
        order_items = []
        for item_data in validated_items:
            item_data['order_id'] = order['id']
            order_item = await db.create_with_retry('order_items', item_data)
            if order_item:
                order_items.append(OrderItem(**order_item))

        # Update deal quantities
        for item in validated_items:
            current_result = db.client.table('deals').select('available_quantity').eq('id', item['deal_id']).single().execute()
            if current_result.data:
                new_quantity = max(0, current_result.data['available_quantity'] - item['quantity'])
                db.client.table('deals').update({
                    'available_quantity': new_quantity,
                    'updated_at': datetime.utcnow().isoformat()
                }).eq('id', item['deal_id']).execute()

        # Return order with items
        return Order(
            **order,
            items=order_items
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating order: {e}")
        raise HTTPException(status_code=500, detail="Failed to create order")

@router.get("/{order_id}", response_model=Order)
async def get_order(
    order_id: str,
    db: DatabaseService = Depends(get_database_service)
):
    """Get order by ID"""
    try:
        # Get order
        order_result = db.client.table('orders').select('*').eq('order_id', order_id).single().execute()
        if not order_result.data:
            raise HTTPException(status_code=404, detail="Order not found")

        order = order_result.data

        # Get order items
        items_result = db.client.table('order_items').select('*').eq('order_id', order['id']).execute()
        order_items = [OrderItem(**item) for item in items_result.data] if items_result.data else []

        return Order(**order, items=order_items)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching order {order_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch order")

@router.get("/pickup-code/{pickup_code}", response_model=Order)
async def get_order_by_pickup_code(
    pickup_code: str,
    db: DatabaseService = Depends(get_database_service)
):
    """Get order by pickup code (for partner verification)"""
    try:
        if len(pickup_code) != 4 or not pickup_code.isdigit():
            raise HTTPException(status_code=400, detail="Invalid pickup code format")

        # Get order
        order_result = db.client.table('orders').select('*').eq('pickup_code', pickup_code).single().execute()
        if not order_result.data:
            raise HTTPException(status_code=404, detail="Order not found")

        order = order_result.data

        # Get order items
        items_result = db.client.table('order_items').select('*').eq('order_id', order['id']).execute()
        order_items = [OrderItem(**item) for item in items_result.data] if items_result.data else []

        return Order(**order, items=order_items)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching order by pickup code {pickup_code}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch order")

@router.patch("/{order_id}", response_model=Order)
async def update_order(
    order_id: str,
    update_data: OrderUpdate,
    db: DatabaseService = Depends(get_database_service)
):
    """Update order status or payment information"""
    try:
        # Check if order exists
        order_result = db.client.table('orders').select('*').eq('order_id', order_id).single().execute()
        if not order_result.data:
            raise HTTPException(status_code=404, detail="Order not found")

        # Prepare update data
        updates = {}
        if update_data.payment_status is not None:
            updates['payment_status'] = update_data.payment_status.value
        if update_data.order_status is not None:
            updates['order_status'] = update_data.order_status.value
        if update_data.payment_reference is not None:
            updates['payment_reference'] = update_data.payment_reference

        if not updates:
            raise HTTPException(status_code=400, detail="No valid updates provided")

        updates['updated_at'] = datetime.utcnow().isoformat()

        # Update order
        updated_order = await db.update_with_optimistic_locking(
            'orders',
            order_result.data['id'],
            updates
        )

        if not updated_order:
            raise HTTPException(status_code=500, detail="Failed to update order")

        # Get order items
        items_result = db.client.table('order_items').select('*').eq('order_id', updated_order['id']).execute()
        order_items = [OrderItem(**item) for item in items_result.data] if items_result.data else []

        return Order(**updated_order, items=order_items)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating order {order_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to update order")

@router.get("/customer/{customer_email}")
async def get_customer_orders(
    customer_email: str,
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=50),
    db: DatabaseService = Depends(get_database_service)
):
    """Get orders for a specific customer"""
    try:
        # Get customer orders with pagination
        offset = (page - 1) * size

        orders_result = db.client.table('orders').select('*').eq(
            'customer_email', customer_email
        ).range(offset, offset + size - 1).order('created_at', desc=True).execute()

        if not orders_result.data:
            return {"orders": [], "total": 0, "page": page, "size": size}

        orders = []
        for order_data in orders_result.data:
            # Get order items
            items_result = db.client.table('order_items').select('*').eq('order_id', order_data['id']).execute()
            order_items = [OrderItem(**item) for item in items_result.data] if items_result.data else []

            orders.append(Order(**order_data, items=order_items))

        return {
            "orders": orders,
            "total": len(orders),
            "page": page,
            "size": size
        }

    except Exception as e:
        logger.error(f"Error fetching customer orders for {customer_email}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch customer orders")