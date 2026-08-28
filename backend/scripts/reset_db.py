import os
import sys
import psycopg
from dotenv import load_dotenv

load_dotenv()
url = os.getenv("DATABASE_URL")
if not url:
    print("No DATABASE_URL")
    sys.exit(1)

raw_url = url.replace("postgresql+psycopg://", "postgresql://")
print(f"Connecting to clean up schema...")
try:
    with psycopg.connect(raw_url, autocommit=True) as conn:
        with conn.cursor() as cur:
            cur.execute("DROP SCHEMA IF EXISTS public CASCADE;")
            cur.execute("CREATE SCHEMA public;")
            cur.execute("GRANT ALL ON SCHEMA public TO postgres;")
            cur.execute("GRANT ALL ON SCHEMA public TO public;")
            
            enums = [
                "jobstatus", "sourcetype", "knowledgestatus", "trustlevel", 
                "projectstatus", "findingcategory", "findingseverity", 
                "findingstatus", "tribunalstatus", "tribunaldecision", "reviewaction"
            ]
            for e in enums:
                print(f"Dropping type {e}...")
                try:
                    cur.execute(f"DROP TYPE IF EXISTS {e} CASCADE;")
                except Exception as ex:
                    print(f"Failed to drop {e}: {ex}")
    print("Schema cleared successfully!")
except Exception as e:
    print(f"Error: {e}")
