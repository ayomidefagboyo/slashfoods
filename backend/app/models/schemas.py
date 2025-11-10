from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime, date, time
from enum import Enum
import uuid

# Enums
class BusinessType(str, Enum):
    restaurant = "restaurant"
    bakery = "bakery"
    supermarket = "supermarket"
    local_cuisine = "local_cuisine"

class PaymentStatus(str, Enum):
    pending = "pending"
    completed = "completed"
    failed = "failed"
    refunded = "refunded"

class OrderStatus(str, Enum):
    confirmed = "confirmed"
    ready = "ready"
    picked_up = "picked_up"
    expired = "expired"

# Base schemas
class BaseSchema(BaseModel):
    class Config:
        from_attributes = True
        use_enum_values = True

# Partner schemas
class PartnerBase(BaseSchema):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    address: str = Field(..., min_length=1)
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    business_type: BusinessType = BusinessType.restaurant
    description: Optional[str] = None
    logo_url: Optional[str] = None

class PartnerCreate(PartnerBase):
    pass

class PartnerUpdate(BaseSchema):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = Field(None, min_length=1)
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    business_type: Optional[BusinessType] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None
    is_active: Optional[bool] = None

class Partner(PartnerBase):
    id: str
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

# Deal schemas
class DealBase(BaseSchema):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    category: str = Field(..., min_length=1, max_length=50)
    original_price: float = Field(..., gt=0)
    discounted_price: float = Field(..., gt=0)
    available_quantity: int = Field(..., ge=0)
    pickup_start_time: time
    pickup_end_time: time
    pickup_date: date = Field(default_factory=lambda: datetime.now().date())

    @validator('discounted_price')
    def validate_discounted_price(cls, v, values):
        if 'original_price' in values and v >= values['original_price']:
            raise ValueError('Discounted price must be less than original price')
        return v

class DealCreate(DealBase):
    partner_id: str

class DealUpdate(BaseSchema):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    original_price: Optional[float] = Field(None, gt=0)
    discounted_price: Optional[float] = Field(None, gt=0)
    available_quantity: Optional[int] = Field(None, ge=0)
    pickup_start_time: Optional[time] = None
    pickup_end_time: Optional[time] = None
    pickup_date: Optional[date] = None
    is_active: Optional[bool] = None

class Deal(DealBase):
    id: str
    partner_id: str
    discount_percentage: int
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
    partner: Optional[Partner] = None

# Customer schemas
class CustomerBase(BaseSchema):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseSchema):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)

class Customer(CustomerBase):
    id: str
    created_at: datetime
    updated_at: datetime

# Order Item schemas
class OrderItemBase(BaseSchema):
    deal_id: str
    quantity: int = Field(default=1, ge=1)
    unit_price: float = Field(..., gt=0)

class OrderItemCreate(OrderItemBase):
    deal_title: str
    partner_id: str

class OrderItem(OrderItemBase):
    id: str
    order_id: str
    deal_title: str
    partner_id: str
    total_price: float
    created_at: datetime

# Order schemas
class OrderBase(BaseSchema):
    customer_name: str = Field(..., min_length=1, max_length=255)
    customer_email: EmailStr
    customer_phone: str = Field(..., min_length=1, max_length=20)
    total_amount: float = Field(..., gt=0)
    payment_method: str = "flutterwave"

class OrderCreate(OrderBase):
    items: List[OrderItemCreate] = Field(..., min_items=1)

class OrderUpdate(BaseSchema):
    payment_status: Optional[PaymentStatus] = None
    order_status: Optional[OrderStatus] = None
    payment_reference: Optional[str] = None

class Order(OrderBase):
    id: str
    order_id: str  # Human readable ID
    customer_id: Optional[str] = None
    pickup_code: str
    payment_reference: Optional[str] = None
    payment_status: PaymentStatus = PaymentStatus.pending
    order_status: OrderStatus = OrderStatus.confirmed
    pickup_date: date
    created_at: datetime
    updated_at: datetime
    items: Optional[List[OrderItem]] = None

# Payment schemas
class PaymentWebhookData(BaseSchema):
    """Flutterwave webhook payload"""
    id: int
    txRef: str
    flwRef: str
    orderRef: str
    paymentPlan: Optional[str] = None
    createdAt: str
    amount: float
    charged_amount: float
    status: str
    IP: str
    currency: str
    customer: dict
    entity: dict

class PaymentWebhook(BaseSchema):
    event: str
    data: PaymentWebhookData

class PaymentVerificationResponse(BaseSchema):
    status: str
    message: str
    data: dict

# Response schemas
class DealsResponse(BaseSchema):
    deals: List[Deal]
    total: int
    page: int
    size: int

class LocationRequest(BaseSchema):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    radius_km: float = Field(default=10, gt=0, le=100)

class DealWithDistance(Deal):
    distance_km: float

class DealsNearbyResponse(BaseSchema):
    deals: List[DealWithDistance]
    total: int
    center: dict
    radius_km: float

# Error schemas
class ErrorResponse(BaseSchema):
    detail: str
    error_code: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class HealthResponse(BaseSchema):
    status: str
    service: str
    version: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)