import os
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv

load_dotenv()

# Default to SQLite for local ease if DATABASE_URL is not provided or is sqlite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./ax_decision.db")

# Adjust for SQLite (remove pool settings if sqlite)
engine_args = {}
if "sqlite" in DATABASE_URL:
    engine_args = {}
else:
    engine_args = {
        "pool_size": 5,
        "max_overflow": 10,
    }

engine = create_async_engine(DATABASE_URL, **engine_args)
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

class Base(DeclarativeBase):
    pass

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

async def init_db():
    # Dynamic import to avoid circular dependency
    from src.infrastructure.db.models import Base
    async with engine.begin() as conn:
        # Create all tables defined in models.py
        await conn.run_sync(Base.metadata.create_all)
