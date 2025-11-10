from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import date, datetime
import logging
import math

from ...core.database import get_db, get_database_service, DatabaseService
from ...models.schemas import (
    Deal, DealsResponse, LocationRequest, DealWithDistance,
    DealsNearbyResponse, ErrorResponse
)

router = APIRouter()
logger = logging.getLogger(__name__)

def calculate_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two points using Haversine formula"""
    # Convert to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    # Haversine formula
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    r = 6371  # Earth's radius in kilometers
    return r * c

@router.get("/", response_model=DealsResponse)
async def get_deals(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Page size"),
    category: Optional[str] = Query(None, description="Filter by category"),
    active_only: bool = Query(True, description="Only active deals"),
    available_only: bool = Query(True, description="Only deals with stock"),
    pickup_date: Optional[date] = Query(None, description="Filter by pickup date"),
    db: DatabaseService = Depends(get_database_service)
):
    """Get paginated list of deals"""
    try:
        # Build query
        query = db.client.table('deals').select('''
            *,
            partner:partners (*)
        ''')

        # Apply filters
        if active_only:
            query = query.eq('is_active', True)

        if available_only:
            query = query.gt('available_quantity', 0)

        if category:
            query = query.eq('category', category)

        if pickup_date:
            query = query.eq('pickup_date', pickup_date.isoformat())
        else:
            # Default to today's deals
            today = datetime.now().date()
            query = query.eq('pickup_date', today.isoformat())

        # Get total count
        count_result = query.execute()
        total = len(count_result.data) if count_result.data else 0

        # Apply pagination
        offset = (page - 1) * size
        query = query.range(offset, offset + size - 1).order('created_at', desc=True)

        result = query.execute()

        if not result.data:
            return DealsResponse(deals=[], total=0, page=page, size=size)

        # Transform data
        deals = []
        for deal_data in result.data:
            try:
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
                    updated_at=deal_data['updated_at'],
                    partner=deal_data.get('partner')
                )
                deals.append(deal)
            except Exception as e:
                logger.warning(f"Error processing deal {deal_data.get('id', 'unknown')}: {e}")
                continue

        return DealsResponse(
            deals=deals,
            total=total,
            page=page,
            size=size
        )

    except Exception as e:
        logger.error(f"Error fetching deals: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch deals")

@router.post("/nearby", response_model=DealsNearbyResponse)
async def get_deals_nearby(
    location: LocationRequest,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    category: Optional[str] = Query(None),
    db: DatabaseService = Depends(get_database_service)
):
    """Get deals near a specific location"""
    try:
        # First get all active deals with partner location data
        query = db.client.table('deals').select('''
            *,
            partner:partners!inner(*)
        ''').eq('is_active', True).gt('available_quantity', 0)

        if category:
            query = query.eq('category', category)

        # Default to today's deals
        today = datetime.now().date()
        query = query.eq('pickup_date', today.isoformat())

        result = query.execute()

        if not result.data:
            return DealsNearbyResponse(
                deals=[],
                total=0,
                center={'lat': location.latitude, 'lng': location.longitude},
                radius_km=location.radius_km
            )

        # Calculate distances and filter
        deals_with_distance = []
        for deal_data in result.data:
            partner = deal_data.get('partner')
            if not partner or not partner.get('latitude') or not partner.get('longitude'):
                continue

            distance = calculate_distance_km(
                location.latitude, location.longitude,
                partner['latitude'], partner['longitude']
            )

            if distance <= location.radius_km:
                # Calculate discount percentage
                discount_percentage = int(
                    ((deal_data['original_price'] - deal_data['discounted_price'])
                     / deal_data['original_price']) * 100
                )

                deal = DealWithDistance(
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
                    updated_at=deal_data['updated_at'],
                    partner=partner,
                    distance_km=round(distance, 2)
                )
                deals_with_distance.append(deal)

        # Sort by distance
        deals_with_distance.sort(key=lambda x: x.distance_km)

        # Apply pagination
        total = len(deals_with_distance)
        offset = (page - 1) * size
        paginated_deals = deals_with_distance[offset:offset + size]

        return DealsNearbyResponse(
            deals=paginated_deals,
            total=total,
            center={'lat': location.latitude, 'lng': location.longitude},
            radius_km=location.radius_km
        )

    except Exception as e:
        logger.error(f"Error fetching nearby deals: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch nearby deals")

@router.get("/{deal_id}", response_model=Deal)
async def get_deal(
    deal_id: str,
    db: DatabaseService = Depends(get_database_service)
):
    """Get a specific deal by ID"""
    try:
        result = db.client.table('deals').select('''
            *,
            partner:partners (*)
        ''').eq('id', deal_id).single().execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Deal not found")

        deal_data = result.data

        # Calculate discount percentage
        discount_percentage = int(
            ((deal_data['original_price'] - deal_data['discounted_price'])
             / deal_data['original_price']) * 100
        )

        return Deal(
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
            updated_at=deal_data['updated_at'],
            partner=deal_data.get('partner')
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching deal {deal_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch deal")

@router.get("/categories/list")
async def get_categories(
    db: DatabaseService = Depends(get_database_service)
):
    """Get list of all available categories"""
    try:
        result = db.client.table('deals').select('category').eq('is_active', True).execute()

        if not result.data:
            return {"categories": []}

        categories = list(set(item['category'] for item in result.data))
        categories.sort()

        return {
            "categories": categories,
            "total": len(categories)
        }

    except Exception as e:
        logger.error(f"Error fetching categories: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch categories")