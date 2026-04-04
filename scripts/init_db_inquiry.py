import asyncio
from src.infrastructure.db.database import engine
from src.infrastructure.db.models import Base

async def init():
    print("Syncing database schema for AX Inquiry Pipeline...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Done.")

if __name__ == "__main__":
    asyncio.run(init())
