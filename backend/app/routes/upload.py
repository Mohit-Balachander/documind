import os
import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.rag_pipeline import process_document

router = APIRouter()

UPLOAD_DIR = "./uploaded_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported"
        )
    
    collection_name = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{collection_name}.pdf")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        chunk_count = process_document(file_path, collection_name)
        return {
            "message": "Document uploaded and processed successfully",
            "collection_name": collection_name,
            "filename": file.filename,
            "chunks_processed": chunk_count
        }
    except Exception as e:
        os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))