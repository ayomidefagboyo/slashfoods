from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "SlashFood API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Backend API for SlashFood - Nigeria's premier food waste reduction platform"

    # Security
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    ALLOWED_HOSTS: List[str] = ["*"]
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "https://slashfood.vercel.app",
        "https://*.vercel.app"
    ]

    # Database (Supabase)
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    DATABASE_URL: Optional[str] = None

    # Payment Providers
    FLUTTERWAVE_SECRET_KEY: str = ""
    FLUTTERWAVE_PUBLIC_KEY: str = ""
    FLUTTERWAVE_WEBHOOK_HASH: str = ""

    # Google Maps
    GOOGLE_MAPS_API_KEY: str = ""

    # Redis (for caching and rate limiting)
    REDIS_URL: str = "redis://localhost:6379"

    # Email (for notifications)
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = None
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[str] = None
    EMAILS_FROM_NAME: Optional[str] = None

    # Environment
    ENVIRONMENT: str = "development"  # development, staging, production
    DEBUG: bool = True

    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_PERIOD: int = 60  # seconds

    class Config:
        env_file = ".env"
        case_sensitive = True

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        # Set database URL from Supabase if not provided
        if not self.DATABASE_URL and self.SUPABASE_URL:
            # Extract database URL from Supabase URL
            # Format: postgresql://postgres:[password]@[host]:5432/postgres
            supabase_host = self.SUPABASE_URL.replace("https://", "").replace("http://", "")
            self.DATABASE_URL = f"postgresql://postgres:[YOUR_DB_PASSWORD]@db.{supabase_host}:5432/postgres"

# Create settings instance
settings = Settings()

# Validation
def validate_settings():
    """Validate critical settings"""
    required_settings = [
        ("SUPABASE_URL", settings.SUPABASE_URL),
        ("SUPABASE_ANON_KEY", settings.SUPABASE_ANON_KEY),
        ("FLUTTERWAVE_SECRET_KEY", settings.FLUTTERWAVE_SECRET_KEY),
    ]

    missing = [name for name, value in required_settings if not value]

    if missing and settings.ENVIRONMENT == "production":
        raise ValueError(f"Missing required settings in production: {', '.join(missing)}")

    if missing:
        print(f"⚠️  Warning: Missing settings: {', '.join(missing)}")
        print("Some features may not work properly.")

# Validate on import
validate_settings()