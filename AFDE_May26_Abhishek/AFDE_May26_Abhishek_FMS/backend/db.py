"""
db.py - Database connection and session management for PulseCheck
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

SQLITE_URL = "sqlite:///./pulsecheck.db"

engine = create_engine(
    SQLITE_URL,
    connect_args={"check_same_thread": False},
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_session():
    """Dependency that yields a database session and ensures it is closed."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
