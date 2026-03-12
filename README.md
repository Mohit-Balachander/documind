# DocuMind — Intelligent Document Q&A

> RAG-powered document intelligence platform built with LangChain, ChromaDB, Groq LLM, FastAPI, and React.

## What it does
Upload any PDF document and ask questions in natural language. DocuMind retrieves the most relevant chunks using vector similarity search and generates precise answers using Groq's Llama 3.3 70B model.

## Tech Stack
| Layer | Technology |
|---|---|
| LLM | Groq (Llama 3.3 70B) |
| RAG Framework | LangChain |
| Vector Database | ChromaDB |
| Embeddings | HuggingFace all-MiniLM-L6-v2 |
| Backend | FastAPI (Python) |
| Frontend | React.js |
| Containerization | Docker + Docker Compose |

## Architecture
```
User uploads PDF
      ↓
FastAPI receives file → PyPDF loads document
      ↓
LangChain splits into chunks (1000 tokens, 200 overlap)
      ↓
HuggingFace embeddings → stored in ChromaDB
      ↓
User asks question → vector similarity search
      ↓
Top 3 chunks + question → Groq LLM
      ↓
Accurate answer with source references
```

## Quick Start

### Prerequisites
- Docker Desktop
- Groq API key (free at console.groq.com)

### Run with Docker
```bash
git clone https://github.com/Mohit-Balachander/documind.git
cd documind
echo "GROQ_API_KEY=your_key_here" > backend/.env
docker-compose up --build
```

Open http://localhost:5173

### Run Locally
```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/upload | Upload and process PDF |
| POST | /api/query | Ask question about document |
| GET | /health | Health check |

## Why This Matters
Enterprise organizations store petabytes of unstructured documents that can't be queried intelligently. DocuMind demonstrates the AI retrieval layer that sits on top of document storage — directly relevant to NetApp's mission of reducing data silos to accelerate AI workloads.