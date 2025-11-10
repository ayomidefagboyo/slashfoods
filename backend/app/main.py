from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import logging
import sys
from pathlib import Path

# Add the app directory to the Python path
sys.path.append(str(Path(__file__).parent))

from core.config import settings
from core.database import init_db
from api.v1 import deals, orders, payments, partners, customers

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting SlashFood API...")
    await init_db()
    logger.info("Database initialized")
    yield
    # Shutdown
    logger.info("Shutting down SlashFood API...")

# Create FastAPI app
app = FastAPI(
    title="SlashFood API",
    description="Backend API for SlashFood - Nigeria's premier food waste reduction platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Security middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)

# Include routers
app.include_router(deals.router, prefix="/api/v1/deals", tags=["deals"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["orders"])
app.include_router(payments.router, prefix="/api/v1/payments", tags=["payments"])
app.include_router(partners.router, prefix="/api/v1/partners", tags=["partners"])
app.include_router(customers.router, prefix="/api/v1/customers", tags=["customers"])

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Welcome to SlashFood API",
        "version": "1.0.0",
        "description": "Nigeria's premier food waste reduction platform",
        "docs": "/docs",
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "service": "slashfood-api",
        "version": "1.0.0"
    }

@app.get("/api/v1")
async def api_v1_root():
    """API v1 root endpoint"""
    return {
        "message": "SlashFood API v1",
        "endpoints": {
            "deals": "/api/v1/deals",
            "orders": "/api/v1/orders",
            "payments": "/api/v1/payments",
            "partners": "/api/v1/partners",
            "customers": "/api/v1/customers"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )