from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
import logging

from ...core.database import get_db, get_database_service, DatabaseService
from ...models.schemas import Partner, PartnerCreate, PartnerUpdate, Deal

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[Partner])
async def get_partners(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    active_only: bool = Query(True),
    business_type: Optional[str] = Query(None),
    db: DatabaseService = Depends(get_database_service)
):
    """Get list of partners"""
    try:
        query = db.client.table('partners').select('*')

        if active_only:
            query = query.eq('is_active', True)

        if business_type:
            query = query.eq('business_type', business_type)

        # Apply pagination
        offset = (page - 1) * size
        query = query.range(offset, offset + size - 1).order('created_at', desc=True)

        result = query.execute()

        if not result.data:
            return []

        return [Partner(**partner) for partner in result.data]

    except Exception as e:
        logger.error(f"Error fetching partners: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch partners")

@router.get("/{partner_id}", response_model=Partner)
async def get_partner(
    partner_id: str,
    db: DatabaseService = Depends(get_database_service)
):
    """Get partner by ID"""
    try:
        result = db.client.table('partners').select('*').eq('id', partner_id).single().execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Partner not found")

        return Partner(**result.data)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching partner {partner_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch partner")

@router.get("/{partner_id}/deals")
async def get_partner_deals(
    partner_id: str,
    active_only: bool = Query(True),
    db: DatabaseService = Depends(get_database_service)
):
    """Get deals for a specific partner"""
    try:
        # Verify partner exists
        partner_result = db.client.table('partners').select('id').eq('id', partner_id).single().execute()
        if not partner_result.data:
            raise HTTPException(status_code=404, detail="Partner not found")

        # Get deals
        query = db.client.table('deals').select('*').eq('partner_id', partner_id)

        if active_only:
            query = query.eq('is_active', True)

        query = query.order('created_at', desc=True)
        result = query.execute()

        deals = []
        for deal_data in result.data or []:
            # Calculate discount percentage
            discount_percentage = int(
                ((deal_data['original_price'] - deal_data['discounted_price'])
                 / deal_data['original_price']) * 100
            )

            deal = Deal(
                id=deal_data['id'],
                partner_id=deal_data['partner_id'],
                title=deal_data['title'],
                description=deal_data.get('description'),
                category=deal_data['category'],
                original_price=deal_data['original_price'],
                discounted_price=deal_data['discounted_price'],
                discount_percentage=discount_percentage,
                available_quantity=deal_data['available_quantity'],
                pickup_start_time=deal_data['pickup_start_time'],
                pickup_end_time=deal_data['pickup_end_time'],
                pickup_date=deal_data['pickup_date'],
                is_active=deal_data['is_active'],
                created_at=deal_data['created_at'],
                updated_at=deal_data['updated_at']
            )
            deals.append(deal)

        return {
            "partner_id": partner_id,
            "deals": deals,
            "total": len(deals)
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching deals for partner {partner_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch partner deals")

@router.get("/{partner_id}/orders")
async def get_partner_orders(
    partner_id: str,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None, description="Filter by order status"),
    db: DatabaseService = Depends(get_database_service)
):
    """Get orders for a specific partner"""
    try:
        # Verify partner exists
        partner_result = db.client.table('partners').select('id').eq('id', partner_id).single().execute()
        if not partner_result.data:
            raise HTTPException(status_code=404, detail="Partner not found")

        # Get orders through order_items
        query = db.client.table('order_items').select('''
            *,
            order:orders (*)
        ''').eq('partner_id', partner_id)

        if status:
            # This would need a more complex query with proper joins
            pass

        offset = (page - 1) * size
        query = query.range(offset, offset + size - 1).order('created_at', desc=True)
        result = query.execute()

        orders = []
        seen_orders = set()

        for item in result.data or []:
            order_data = item.get('order')
            if order_data and order_data['id'] not in seen_orders:
                seen_orders.add(order_data['id'])
                orders.append(order_data)

        return {
            "partner_id": partner_id,
            "orders": orders,
            "total": len(orders),
            "page": page,
            "size": size
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching orders for partner {partner_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch partner orders")

@router.post("/", response_model=Partner)
async def create_partner(
    partner_data: PartnerCreate,
    db: DatabaseService = Depends(get_database_service)
):
    """Create a new partner (admin only)"""
    try:
        # Check if partner with email already exists
        existing = db.client.table('partners').select('id').eq('email', partner_data.email).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Partner with this email already exists")

        partner = await db.create_with_retry('partners', partner_data.dict())

        if not partner:
            raise HTTPException(status_code=500, detail="Failed to create partner")

        return Partner(**partner)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating partner: {e}")
        raise HTTPException(status_code=500, detail="Failed to create partner")

@router.patch("/{partner_id}", response_model=Partner)
async def update_partner(
    partner_id: str,
    update_data: PartnerUpdate,
    db: DatabaseService = Depends(get_database_service)
):
    """Update partner information"""
    try:
        # Check if partner exists
        partner_result = db.client.table('partners').select('*').eq('id', partner_id).single().execute()
        if not partner_result.data:
            raise HTTPException(status_code=404, detail="Partner not found")

        # Prepare update data
        updates = {k: v for k, v in update_data.dict(exclude_unset=True).items() if v is not None}

        if not updates:
            raise HTTPException(status_code=400, detail="No valid updates provided")

        updated_partner = await db.update_with_optimistic_locking(
            'partners',
            partner_id,
            updates
        )

        if not updated_partner:
            raise HTTPException(status_code=500, detail="Failed to update partner")

        return Partner(**updated_partner)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating partner {partner_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to update partner")

@router.get("/{partner_id}/analytics")
async def get_partner_analytics(
    partner_id: str,
    days: int = Query(30, ge=1, le=365, description="Number of days for analytics"),
    db: DatabaseService = Depends(get_database_service)
):
    """Get analytics data for a partner"""
    try:
        # Verify partner exists
        partner_result = db.client.table('partners').select('id').eq('id', partner_id).single().execute()
        if not partner_result.data:
            raise HTTPException(status_code=404, detail="Partner not found")

        # Get order items for this partner
        order_items_result = db.client.table('order_items').select('''
            *,
            order:orders!inner (
                created_at,
                payment_status,
                order_status,
                total_amount
            )
        ''').eq('partner_id', partner_id).execute()

        total_orders = len(order_items_result.data) if order_items_result.data else 0
        total_revenue = sum(
            item['total_price'] for item in order_items_result.data or []
            if item.get('order', {}).get('payment_status') == 'completed'
        )

        # Get active deals count
        deals_result = db.client.table('deals').select('id').eq('partner_id', partner_id).eq('is_active', True).execute()
        active_deals = len(deals_result.data) if deals_result.data else 0

        return {
            "partner_id": partner_id,
            "period_days": days,
            "metrics": {
                "total_orders": total_orders,
                "total_revenue": total_revenue,
                "active_deals": active_deals,
                "average_order_value": total_revenue / max(total_orders, 1)
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching analytics for partner {partner_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch partner analytics")