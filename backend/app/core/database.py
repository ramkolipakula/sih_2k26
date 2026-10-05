from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import settings

# Determine if we're using SQLite based on connection string
is_sqlite = settings.DATABASE_URL.startswith("sqlite")
connect_args = {"check_same_thread": False} if is_sqlite else {}
pool_kwargs = {} if is_sqlite else {"pool_pre_ping": True, "pool_size": 10, "max_overflow": 20}

# SQLAlchemy 2.0 expects postgresql+psycopg:// for psycopg3
import re

# Clean the URL (remove quotes and whitespace)
db_url = settings.DATABASE_URL.strip().strip("'").strip('"')

# Use regex to replace postgres:// or postgresql:// (without a driver) with postgresql+psycopg://
# The regex ^postgres(?:ql)?:// matches both postgres:// and postgresql:// at the start of the string
db_url = re.sub(r"^postgres(?:ql)?://", "postgresql+psycopg://", db_url)

engine = create_engine(
    db_url,
    connect_args=connect_args,
    **pool_kwargs
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
