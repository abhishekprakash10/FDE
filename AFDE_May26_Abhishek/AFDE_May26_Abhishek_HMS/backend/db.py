import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv

load_dotenv()

_DB_URL = os.getenv("DATABASE_URL", "sqlite:///./servicedesk.db")

engine = create_engine(
    _DB_URL,
    connect_args={"check_same_thread": False} if _DB_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
