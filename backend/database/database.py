"""
Async SQLAlchemy database setup.
"""
import os
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from dotenv import load_dotenv

load_dotenv()

# Build async DB URL from env
_db_url = os.getenv("DATABASE_URL", "sqlite:///./research_agent.db")

# Convert sqlite:// -> sqlite+aiosqlite://
if _db_url.startswith("sqlite:///"):
    ASYNC_DATABASE_URL = _db_url.replace("sqlite:///", "sqlite+aiosqlite:///", 1)
elif _db_url.startswith("sqlite://"):
    ASYNC_DATABASE_URL = _db_url.replace("sqlite://", "sqlite+aiosqlite://", 1)
else:
    ASYNC_DATABASE_URL = _db_url


engine = create_async_engine(
    ASYNC_DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False} if "sqlite" in ASYNC_DATABASE_URL else {},
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db():
    """Dependency that provides a database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def init_db():
    """Create all tables."""
    from database import models  # noqa: F401 – ensure models are registered
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
