import os
import psycopg
from dotenv import load_dotenv

load_dotenv()
raw_url = os.getenv("DATABASE_URL").replace("postgresql+psycopg://", "postgresql://")
try:
    with psycopg.connect(raw_url) as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT n.nspname as enum_schema, t.typname as enum_name 
                FROM pg_type t 
                JOIN pg_enum e ON t.oid = e.enumtypid 
                JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace 
                WHERE t.typname = 'jobstatus'
                GROUP BY enum_schema, enum_name;
            """)
            print(cur.fetchall())
except Exception as e:
    print(f"Error: {e}")
