from supabase import create_client, Client
from typing import Optional
import logging

from .config import settings

logger = logging.getLogger(__name__)

# Global Supabase client
supabase: Optional[Client] = None

async def init_db():
    """Initialize database connection"""
    global supabase

    try:
        if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
            logger.warning("Supabase credentials not configured. Using anon key for limited access.")
            # Use anon key as fallback
            key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY
        else:
            key = settings.SUPABASE_SERVICE_ROLE_KEY

        supabase = create_client(settings.SUPABASE_URL, key)
        logger.info("✅ Database connection initialized successfully")

        # Test the connection
        await test_connection()

    except Exception as e:
        logger.error(f"❌ Failed to initialize database: {e}")
        raise

async def test_connection():
    """Test database connection"""
    try:
        # Try to fetch a small amount of data
        result = supabase.table('partners').select('id').limit(1).execute()
        logger.info("✅ Database connection test passed")
        return True
    except Exception as e:
        logger.warning(f"⚠️  Database connection test failed: {e}")
        return False

def get_db() -> Client:
    """Dependency to get database client"""
    if supabase is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    return supabase

# Database utilities
class DatabaseService:
    """Database service for common operations"""

    def __init__(self, client: Client):
        self.client = client

    async def create_with_retry(self, table: str, data: dict, max_retries: int = 3):
        """Create record with retry logic"""
        for attempt in range(max_retries):
            try:
                result = self.client.table(table).insert(data).execute()
                return result.data[0] if result.data else None
            except Exception as e:
                if attempt == max_retries - 1:
                    logger.error(f"Failed to create record in {table} after {max_retries} attempts: {e}")
                    raise
                logger.warning(f"Attempt {attempt + 1} failed for {table} insert: {e}")
                # Simple backoff
                import asyncio
                await asyncio.sleep(0.5 * (attempt + 1))

    async def get_or_create(self, table: str, match_fields: dict, create_data: dict):
        """Get existing record or create new one"""
        try:
            # Try to find existing record
            query = self.client.table(table).select('*')
            for field, value in match_fields.items():
                query = query.eq(field, value)

            result = query.execute()

            if result.data:
                return result.data[0], False  # Found existing

            # Create new record
            new_record = await self.create_with_retry(table, create_data)
            return new_record, True  # Created new

        except Exception as e:
            logger.error(f"Error in get_or_create for {table}: {e}")
            raise

    async def update_with_optimistic_locking(self, table: str, record_id: str, updates: dict):
        """Update with optimistic locking using updated_at"""
        try:
            # Add updated_at timestamp
            from datetime import datetime, timezone
            updates['updated_at'] = datetime.now(timezone.utc).isoformat()

            result = self.client.table(table).update(updates).eq('id', record_id).execute()
            return result.data[0] if result.data else None

        except Exception as e:
            logger.error(f"Error updating {table} record {record_id}: {e}")
            raise

def get_database_service() -> DatabaseService:
    """Get database service instance"""
    return DatabaseService(get_db())