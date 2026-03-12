from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.upload import router as upload_router
from app.routes.query import router as query_router

app = FastAPI(
    title="DocuMind API",
    description="Intelligent Document Q&A powered by RAG",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api", tags=["Upload"])
app.include_router(query_router, prefix="/api", tags=["Query"])

@app.get("/")
async def root():
    return {
        "message": "DocuMind API is running",
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}