from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routers import proposals, jobs, knowledge, evaluation, admin
from app.routers.tribunal import router as tribunal_router
from app.core.logging import logger

app = FastAPI(
    title="R&D Proposal Evaluation & Decision Support System",
    description="AI-Powered Multi-Agent Tribunal for R&D Proposal Evaluation",
    version="2.0.0"
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(proposals.router)
app.include_router(jobs.router)
app.include_router(knowledge.router)
app.include_router(evaluation.router)
app.include_router(tribunal_router)
app.include_router(admin.router)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url}: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"success": False, "data": None, "error": "Internal Server Error"}
    )

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "2.0.0"}
