from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.rag_pipeline import query_document

router = APIRouter()

class QueryRequest(BaseModel):
    question: str
    collection_name: str

@router.post("/query")
async def query(request: QueryRequest):
    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )
    
    try:
        result = query_document(request.question, request.collection_name)
        return {
            "question": request.question,
            "answer": result["answer"],
            "sources": result["sources"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))