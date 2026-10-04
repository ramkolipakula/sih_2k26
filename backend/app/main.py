from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routers import documents, search, reports, dashboard, topics, data_sources, tasks
from app.core.logging import logger
from app.core.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CMPDI | CIL - Mining Intelligence & Reporting Copilot",
    description="Search | Analyze | Generate | With Evidence",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["dashboard"])
app.include_router(documents.router, prefix="/api/v1/documents", tags=["documents"])
app.include_router(search.router, prefix="/api/v1/search", tags=["search"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])
app.include_router(topics.router, prefix="/api/v1/topics", tags=["topics"])
app.include_router(data_sources.router, prefix="/api/v1/data-sources", tags=["data-sources"])
app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["tasks"])

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url}: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"success": False, "data": None, "error": str(exc)}
    )

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}
