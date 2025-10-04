from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.core.config import settings
from app.api import router
from app.services import vector_db, clinical_standards


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup
    print("🚀 Starting AI Malpractice Risk Scanner API...")

    # Initialize vector database
    vector_db.initialize()

    # Load clinical standards
    try:
        clinical_standards.load_standards()
    except Exception as e:
        print(f"⚠️  Could not load clinical standards: {e}")

    print("✅ API Ready!")

    yield

    # Shutdown
    print("👋 Shutting down...")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered medical malpractice risk assessment system",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api/v1", tags=["risk-assessment"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "AI Malpractice Risk Scanner API",
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.API_RELOAD
    )
