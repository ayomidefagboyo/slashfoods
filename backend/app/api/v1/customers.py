from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
import logging

from ...core.database import get_db, get_database_service, DatabaseService
from ...models.schemas import Customer, CustomerCreate, CustomerUpdate, Order

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/{customer_email}", response_model=Customer)
async def get_customer(
    customer_email: str,
    db: DatabaseService = Depends(get_database_service)
):
    """Get customer by email"""
    try:
        result = db.client.table('customers').select('*').eq('email', customer_email).single().execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Customer not found")

        return Customer(**result.data)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching customer {customer_email}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch customer")

@router.post("/", response_model=Customer)
async def create_customer(
    customer_data: CustomerCreate,
    db: DatabaseService = Depends(get_database_service)
):
    """Create a new customer"""
    try:
        # Check if customer already exists
        existing = db.client.table('customers').select('id').eq('email', customer_data.email).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Customer with this email already exists")

        customer = await db.create_with_retry('customers', customer_data.dict())

        if not customer:
            raise HTTPException(status_code=500, detail="Failed to create customer")

        return Customer(**customer)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating customer: {e}")
        raise HTTPException(status_code=500, detail="Failed to create customer")

@router.patch("/{customer_email}", response_model=Customer)
async def update_customer(
    customer_email: str,
    update_data: CustomerUpdate,
    db: DatabaseService = Depends(get_database_service)
):
    """Update customer information"""
    try:
        # Check if customer exists
        customer_result = db.client.table('customers').select('*').eq('email', customer_email).single().execute()
        if not customer_result.data:
            raise HTTPException(status_code=404, detail="Customer not found")

        customer_id = customer_result.data['id']

        # Prepare update data
        updates = {k: v for k, v in update_data.dict(exclude_unset=True).items() if v is not None}

        if not updates:
            raise HTTPException(status_code=400, detail="No valid updates provided")

        updated_customer = await db.update_with_optimistic_locking(
            'customers',
            customer_id,
            updates
        )

        if not updated_customer:
            raise HTTPException(status_code=500, detail="Failed to update customer")

        return Customer(**updated_customer)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating customer {customer_email}: {e}")
        raise HTTPException(status_code=500, detail="Failed to update customer")

@router.get("/{customer_email}/analytics")
async def get_customer_analytics(
    customer_email: str,
    db: DatabaseService = Depends(get_database_service)
):
    """Get analytics data for a customer"""
    try:
        # Get customer orders
        orders_result = db.client.table('orders').select(
            'total_amount, payment_status, created_at'
        ).eq('customer_email', customer_email).execute()

        if not orders_result.data:
            return {
                "customer_email": customer_email,
                "metrics": {
                    "total_orders": 0,
                    "total_spent": 0,
                    "completed_orders": 0,
                    "average_order_value": 0
                }
            }

        orders = orders_result.data
        total_orders = len(orders)
        completed_orders = [o for o in orders if o['payment_status'] == 'completed']
        total_spent = sum(o['total_amount'] for o in completed_orders)

        return {
            "customer_email": customer_email,
            "metrics": {
                "total_orders": total_orders,
                "total_spent": total_spent,
                "completed_orders": len(completed_orders),
                "average_order_value": total_spent / max(len(completed_orders), 1)
            }
        }

    except Exception as e:
        logger.error(f"Error fetching customer analytics for {customer_email}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch customer analytics")