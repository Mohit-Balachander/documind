# 📄 DocuMind — Intelligent Document Q&A

RAG-powered platform to chat with any PDF using LangChain, ChromaDB, and Groq LLM.

---

## 📌 About

Upload a PDF and ask questions in plain English. DocuMind splits the document into chunks, embeds them into a vector database, and retrieves the most relevant context to generate precise answers using Groq's Llama 3.3 70B model.

---

## 🛠️ Tech Stack

- **LLM** — Groq (Llama 3.3 70B)
- **RAG Framework** — LangChain
- **Vector Database** — ChromaDB
- **Embeddings** — HuggingFace all-MiniLM-L6-v2
- **Backend** — FastAPI (Python)
- **Frontend** — React.js
- **Containerization** — Docker + Docker Compose

---

## ✅ What Was Achieved

- End-to-end RAG pipeline from PDF upload to accurate answer generation
- Vector similarity search over chunked documents (1000 tokens, 200 overlap)
- Top-3 chunk retrieval passed to Groq LLM for grounded responses
- Source references returned alongside every answer
- Fully containerized with Docker Compose for one-command setup

---

## 👨‍💻 Author

**Mohit Balachander** — Integrated M.Tech CSE, VIT-AP University

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat&logo=linkedin)](https://www.linkedin.com/in/mohit-balachander/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat&logo=github)](https://github.com/Mohit-Balachander)
