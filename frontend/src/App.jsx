import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export default function App() {
  const [file, setFile] = useState(null);
  const [collectionName, setCollectionName] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [querying, setQuerying] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUpload = async (selectedFile) => {
    const f = selectedFile || file;
    if (!f) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", f);
    try {
      const res = await axios.post(`${API}/upload`, formData);
      setCollectionName(res.data.collection_name);
      setUploadedFileName(res.data.filename);
      setMessages([
        {
          role: "system",
          text: `Document indexed — ${res.data.chunks_processed} chunks processed`,
          filename: res.data.filename,
        },
      ]);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch {
      setMessages([
        {
          role: "system",
          text: "Upload failed. Please try again.",
          error: true,
        },
      ]);
    }
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.name.endsWith(".pdf")) {
      setFile(dropped);
      handleUpload(dropped);
    }
  };

  const handleQuery = async () => {
    if (!question.trim() || !collectionName || querying) return;
    const q = question.trim();
    setMessages((p) => [...p, { role: "user", text: q }]);
    setQuestion("");
    setQuerying(true);
    try {
      const res = await axios.post(`${API}/query`, {
        question: q,
        collection_name: collectionName,
      });
      setMessages((p) => [
        ...p,
        { role: "bot", text: res.data.answer, sources: res.data.sources },
      ]);
    } catch {
      setMessages((p) => [
        ...p,
        { role: "bot", text: "Something went wrong.", error: true },
      ]);
    }
    setQuerying(false);
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="noise" />
        <div className="glow g1" />
        <div className="glow g2" />

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" />
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-name">DocuMind</span>
              <span className="brand-tagline">Document Intelligence</span>
            </div>
          </div>

          <div className="divider" />

          <div className="section">
            <div className="section-title">Upload</div>
            <div
              className={`dropzone ${dragOver ? "drag" : ""} ${uploading ? "busy" : ""} ${uploadedFileName ? "done" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() =>
                !uploading && document.getElementById("fi").click()
              }
            >
              <input
                id="fi"
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (f) {
                    setFile(f);
                    handleUpload(f);
                  }
                }}
              />
              {uploading ? (
                <div className="dz-content">
                  <div className="bars">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="dz-text">Processing…</span>
                </div>
              ) : uploadedFileName ? (
                <div className="dz-content">
                  <div className="dz-check">✓</div>
                  <span className="dz-text done">{uploadedFileName}</span>
                  <span className="dz-sub">click to replace</span>
                </div>
              ) : (
                <div className="dz-content">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="dz-icon"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                  <span className="dz-text">Drop PDF here</span>
                  <span className="dz-sub">or click to browse</span>
                </div>
              )}
            </div>
          </div>

          {uploadedFileName && (
            <>
              <div className="divider" />
              <div className="section">
                <div className="section-title">Active Document</div>
                <div className="doc-card">
                  <div className="doc-icon">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div className="doc-info">
                    <span className="doc-name">{uploadedFileName}</span>
                    <span className="doc-status">
                      <span className="pulse-dot" />
                      Ready to query
                    </span>
                  </div>
                </div>
              </div>

              <div className="divider" />
              <div className="section">
                <div className="section-title">Powered By</div>
                {[
                  { name: "Groq LLM", desc: "Llama 3.3 70B", color: "#7c2d2d" },
                  { name: "ChromaDB", desc: "Vector Store", color: "#92400e" },
                  { name: "LangChain", desc: "RAG Pipeline", color: "#854d0e" },
                  { name: "FastAPI", desc: "REST Backend", color: "#3d6b4f" },
                ].map((s) => (
                  <div className="tech-row" key={s.name}>
                    <div className="tech-dot" style={{ background: s.color }} />
                    <span className="tech-name">{s.name}</span>
                    <span className="tech-desc">{s.desc}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div style={{ marginTop: "auto" }}>
            <div className="divider" />
            <div className="section">
              <div className="section-title">How It Works</div>
              {[
                "Upload your PDF document",
                "Text chunked & embedded",
                "Ask in natural language",
                "Relevant chunks retrieved",
                "LLM generates answer",
              ].map((s, i) => (
                <div className="step" key={i}>
                  <span className="step-n">{i + 1}</span>
                  <span className="step-t">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          <header className="topbar">
            <div className="tb-left">
              {uploadedFileName ? (
                <>
                  <span className="tb-crumb active">{uploadedFileName}</span>
                  <span className="tb-sep">›</span>
                  <span className="tb-crumb">Q&A Session</span>
                </>
              ) : (
                <span className="tb-crumb">No document loaded</span>
              )}
            </div>
            <div className="tb-right">
              {["RAG", "LangChain", "Groq"].map((t) => (
                <span className="tb-tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </header>

          <div className="messages" id="msgs">
            {messages.length === 0 && (
              <div className="empty">
                <div className="empty-emblem">
                  <div className="em-ring r1" />
                  <div className="em-ring r2" />
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    style={{
                      position: "relative",
                      zIndex: 1,
                      color: "#7c2d2d",
                    }}
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                    <path d="M11 8v3h3" />
                  </svg>
                </div>
                <h2 className="empty-title">
                  Ask anything about
                  <br />
                  your document
                </h2>
                <p className="empty-body">
                  Upload a PDF to start an intelligent Q&A session powered by
                  retrieval augmented generation
                </p>
                <div className="prompts">
                  {[
                    "Summarize the key points",
                    "What are the main conclusions?",
                    "List important dates or figures",
                    "What recommendations are made?",
                  ].map((q) => (
                    <button
                      key={q}
                      className="prompt-chip"
                      onClick={() => {
                        if (collectionName) setQuestion(q);
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`msg-row ${msg.role}`}>
                {msg.role === "system" && (
                  <div className={`sys-pill ${msg.error ? "err" : ""}`}>
                    <span className="sys-ic">{msg.error ? "✗" : "✓"}</span>
                    <span className="sys-text">{msg.text}</span>
                    {msg.filename && (
                      <span className="sys-fn">{msg.filename}</span>
                    )}
                  </div>
                )}
                {msg.role === "user" && (
                  <div className="user-wrap">
                    <div className="user-av">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div className="user-bubble">{msg.text}</div>
                  </div>
                )}
                {msg.role === "bot" && (
                  <div className="bot-wrap">
                    <div className="bot-av">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2a10 10 0 1 0 10 10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    </div>
                    <div className="bot-content">
                      <div className={`bot-bubble ${msg.error ? "err" : ""}`}>
                        {msg.text}
                      </div>
                      {msg.sources?.length > 0 && (
                        <div className="sources">
                          <div className="src-label">
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                            </svg>
                            Source References
                          </div>
                          {msg.sources.map((s, j) => (
                            <div key={j} className="src-row">
                              <span className="src-pg">pg. {s.page}</span>
                              <span className="src-preview">
                                {s.content.slice(0, 90)}…
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {querying && (
              <div className="msg-row bot">
                <div className="bot-wrap">
                  <div className="bot-av">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2a10 10 0 1 0 10 10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <div className="bot-bubble thinking">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="inputzone">
            <div className={`inputbox ${!collectionName ? "muted" : ""}`}>
              <textarea
                ref={inputRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleQuery();
                  }
                }}
                placeholder={
                  collectionName
                    ? "Ask a question about your document…"
                    : "Upload a document to begin…"
                }
                disabled={!collectionName || querying}
                rows={1}
                className="inputtext"
              />
              <button
                onClick={handleQuery}
                disabled={!question.trim() || !collectionName || querying}
                className="sendbtn"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p className="inputnote">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </main>
      </div>
    </>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@300;400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

body{
  font-family:'DM Sans',sans-serif;
  background:#f5f0e8;
  color:#2c1a0e;
  height:100vh;overflow:hidden;
}

.app{display:flex;height:100vh;position:relative;overflow:hidden;}

.noise{
  position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0.025;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

.glow{position:fixed;border-radius:50%;pointer-events:none;z-index:0;filter:blur(100px);}
.g1{width:600px;height:600px;background:radial-gradient(circle,rgba(124,45,45,0.08),transparent 70%);top:-200px;right:-100px;}
.g2{width:400px;height:400px;background:radial-gradient(circle,rgba(146,64,14,0.06),transparent 70%);bottom:-100px;left:200px;}

/* SIDEBAR */
.sidebar{
  width:260px;min-width:260px;
  background:#ede8de;
  border-right:1px solid rgba(124,45,45,0.12);
  display:flex;flex-direction:column;gap:0;
  padding:0;z-index:2;overflow-y:auto;
}

.sidebar::-webkit-scrollbar{width:3px;}
.sidebar::-webkit-scrollbar-thumb{background:rgba(124,45,45,0.15);border-radius:2px;}

.brand{
  display:flex;align-items:center;gap:10px;
  padding:20px 18px 16px;
}

.brand-mark{
  width:34px;height:34px;
  background:#7c2d2d;
  border-radius:8px;
  display:flex;align-items:center;justify-content:center;
  color:#f5f0e8;flex-shrink:0;
}

.brand-text{display:flex;flex-direction:column;gap:1px;}
.brand-name{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:#2c1a0e;letter-spacing:-0.3px;line-height:1;}
.brand-tagline{font-size:9px;color:#9c7a5a;letter-spacing:0.08em;text-transform:uppercase;font-weight:400;}

.divider{height:1px;background:rgba(124,45,45,0.1);margin:0 18px;}

.section{padding:14px 18px;display:flex;flex-direction:column;gap:8px;}
.section-title{font-size:9px;color:#9c7a5a;letter-spacing:0.1em;text-transform:uppercase;font-weight:500;margin-bottom:2px;}

/* DROPZONE */
.dropzone{
  border:1.5px dashed rgba(124,45,45,0.2);
  border-radius:10px;padding:18px 14px;
  cursor:pointer;transition:all 0.25s;
  background:rgba(245,240,232,0.5);
}

.dropzone:hover,.dropzone.drag{
  border-color:rgba(124,45,45,0.45);
  background:rgba(124,45,45,0.04);
}

.dropzone.done{
  border-style:solid;
  border-color:rgba(61,107,79,0.4);
  background:rgba(61,107,79,0.04);
}

.dropzone.busy{cursor:wait;border-color:rgba(124,45,45,0.3);}

.dz-content{display:flex;flex-direction:column;align-items:center;gap:5px;text-align:center;}
.dz-icon{color:rgba(124,45,45,0.4);margin-bottom:4px;}
.dz-text{font-size:12px;color:#6b4c3b;font-weight:500;}
.dz-text.done{color:#3d6b4f;}
.dz-sub{font-size:10px;color:#b8a090;}
.dz-check{font-size:18px;color:#3d6b4f;margin-bottom:2px;}

/* BARS LOADER */
.bars{display:flex;gap:3px;align-items:center;height:20px;margin-bottom:4px;}
.bars span{
  width:3px;height:14px;background:#7c2d2d;border-radius:2px;
  animation:barload 0.7s ease infinite;
}
.bars span:nth-child(2){animation-delay:0.1s;}
.bars span:nth-child(3){animation-delay:0.2s;}
.bars span:nth-child(4){animation-delay:0.3s;}

@keyframes barload{
  0%,100%{transform:scaleY(0.4);opacity:0.3;}
  50%{transform:scaleY(1);opacity:1;}
}

/* DOC CARD */
.doc-card{
  display:flex;align-items:center;gap:10px;
  background:rgba(245,240,232,0.7);
  border:1px solid rgba(124,45,45,0.1);
  border-radius:8px;padding:10px 12px;
}

.doc-icon{
  width:28px;height:28px;
  background:#7c2d2d;border-radius:6px;
  display:flex;align-items:center;justify-content:center;
  color:#f5f0e8;flex-shrink:0;
}

.doc-info{display:flex;flex-direction:column;gap:3px;min-width:0;}
.doc-name{font-size:11px;color:#2c1a0e;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.doc-status{display:flex;align-items:center;gap:5px;font-size:10px;color:#3d6b4f;}

.pulse-dot{
  width:5px;height:5px;border-radius:50%;
  background:#3d6b4f;flex-shrink:0;
  animation:pulsedot 2s infinite;
}

@keyframes pulsedot{0%,100%{opacity:1;}50%{opacity:0.3;}}

/* TECH STACK */
.tech-row{
  display:flex;align-items:center;gap:8px;
  padding:6px 10px;
  background:rgba(245,240,232,0.5);
  border-radius:6px;
}

.tech-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.tech-name{font-size:11px;color:#4a3020;font-weight:500;}
.tech-desc{margin-left:auto;font-size:10px;color:#9c7a5a;font-family:'DM Mono',monospace;}

/* STEPS */
.step{display:flex;align-items:flex-start;gap:8px;padding:3px 0;}
.step-n{
  font-size:9px;color:#7c2d2d;
  background:rgba(124,45,45,0.08);
  width:16px;height:16px;border-radius:4px;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;margin-top:2px;font-weight:500;
}
.step-t{font-size:11px;color:#7a5c48;line-height:1.5;}

/* MAIN */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;z-index:1;background:#faf7f2;}

/* TOPBAR */
.topbar{
  height:48px;flex-shrink:0;
  border-bottom:1px solid rgba(124,45,45,0.1);
  background:#f5f0e8;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 24px;
}

.tb-left{display:flex;align-items:center;gap:6px;}
.tb-crumb{font-size:12px;color:#b8a090;font-family:'DM Mono',monospace;}
.tb-crumb.active{color:#4a3020;}
.tb-sep{color:rgba(124,45,45,0.2);font-size:14px;margin:0 2px;}
.tb-right{display:flex;gap:5px;}
.tb-tag{
  font-size:9px;color:#9c7a5a;
  border:1px solid rgba(124,45,45,0.15);
  background:rgba(124,45,45,0.04);
  padding:3px 8px;border-radius:4px;
  font-family:'DM Mono',monospace;letter-spacing:0.05em;
}

/* MESSAGES */
.messages{
  flex:1;overflow-y:auto;
  padding:32px 28px;
  display:flex;flex-direction:column;gap:22px;
}

.messages::-webkit-scrollbar{width:3px;}
.messages::-webkit-scrollbar-thumb{background:rgba(124,45,45,0.12);border-radius:2px;}

/* EMPTY */
.empty{
  display:flex;flex-direction:column;align-items:center;
  justify-content:center;text-align:center;
  gap:16px;padding:60px 20px;
  animation:rise 0.5s ease;
}

@keyframes rise{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}

.empty-emblem{
  position:relative;width:80px;height:80px;
  display:flex;align-items:center;justify-content:center;
  margin-bottom:8px;
}

.em-ring{
  position:absolute;border-radius:50%;
  border:1px solid rgba(124,45,45,0.15);
  animation:emring 3s ease infinite;
}

.r1{width:80px;height:80px;}
.r2{width:50px;height:50px;animation-delay:-1.5s;border-color:rgba(124,45,45,0.25);}

@keyframes emring{
  0%,100%{transform:scale(1);opacity:0.4;}
  50%{transform:scale(1.07);opacity:1;}
}

.empty-title{
  font-family:'Cormorant Garamond',serif;
  font-size:28px;font-weight:500;
  color:#2c1a0e;letter-spacing:-0.5px;line-height:1.2;
}

.empty-body{font-size:13px;color:#9c7a5a;max-width:360px;line-height:1.7;}

.prompts{display:flex;flex-direction:column;gap:7px;width:100%;max-width:400px;margin-top:4px;}

.prompt-chip{
  background:rgba(237,232,222,0.8);
  border:1px solid rgba(124,45,45,0.12);
  border-radius:8px;padding:9px 14px;
  font-size:12px;color:#6b4c3b;
  cursor:pointer;text-align:left;
  font-family:'DM Sans',sans-serif;
  transition:all 0.2s;
  display:flex;align-items:center;gap:8px;
}

.prompt-chip::before{
  content:'›';color:rgba(124,45,45,0.4);
  font-size:14px;font-weight:300;
}

.prompt-chip:hover{
  border-color:rgba(124,45,45,0.3);
  background:rgba(124,45,45,0.06);
  color:#2c1a0e;
}

/* MESSAGES */
.msg-row{animation:rise 0.3s ease;}

.sys-pill{
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(61,107,79,0.06);
  border:1px solid rgba(61,107,79,0.2);
  border-radius:8px;padding:8px 14px;
  font-size:11px;color:#3d6b4f;
  font-family:'DM Mono',monospace;
  max-width:500px;
}
.sys-pill.err{background:rgba(153,27,27,0.06);border-color:rgba(153,27,27,0.2);color:#991b1b;}
.sys-ic{font-size:11px;}
.sys-text{flex:1;}
.sys-fn{color:#b8a090;font-size:10px;padding-left:8px;}

.user-wrap,.bot-wrap{display:flex;align-items:flex-start;gap:10px;}
.user-wrap{flex-direction:row-reverse;}

.user-av,.bot-av{
  width:28px;height:28px;border-radius:7px;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
}

.user-av{background:#7c2d2d;color:#f5f0e8;}
.bot-av{background:#ede8de;border:1px solid rgba(124,45,45,0.15);color:#7c2d2d;}

.user-bubble{
  background:#7c2d2d;
  border-radius:12px 3px 12px 12px;
  padding:11px 15px;max-width:65%;
  font-size:14px;line-height:1.7;color:#fef2f2;
}

.bot-content{display:flex;flex-direction:column;gap:8px;max-width:78%;}

.bot-bubble{
  background:#ede8de;
  border:1px solid rgba(124,45,45,0.1);
  border-radius:3px 12px 12px 12px;
  padding:13px 16px;
  font-size:14px;line-height:1.75;color:#3d2512;
}

.bot-bubble.err{border-color:rgba(153,27,27,0.2);color:#991b1b;background:rgba(254,242,242,0.5);}

.thinking{
  display:flex;align-items:center;gap:5px;
  padding:14px 16px;
}
.thinking span{
  width:6px;height:6px;
  background:#7c2d2d;border-radius:50%;
  animation:thinkanim 1.1s ease infinite;opacity:0.4;
}
.thinking span:nth-child(2){animation-delay:0.18s;}
.thinking span:nth-child(3){animation-delay:0.36s;}

@keyframes thinkanim{
  0%,60%,100%{transform:translateY(0);opacity:0.3;}
  30%{transform:translateY(-6px);opacity:0.9;}
}

/* SOURCES */
.sources{
  background:#f0ebe0;
  border:1px solid rgba(124,45,45,0.1);
  border-radius:8px;padding:10px 12px;
  display:flex;flex-direction:column;gap:7px;
}

.src-label{
  display:flex;align-items:center;gap:5px;
  font-size:9px;color:#9c7a5a;
  letter-spacing:0.1em;text-transform:uppercase;
  font-weight:500;
}

.src-row{
  display:flex;align-items:flex-start;gap:8px;
  background:rgba(245,240,232,0.8);
  border:1px solid rgba(124,45,45,0.07);
  border-radius:6px;padding:7px 10px;
}

.src-pg{
  font-size:9px;color:#7c2d2d;
  background:rgba(124,45,45,0.08);
  padding:2px 6px;border-radius:4px;
  flex-shrink:0;margin-top:1px;
  font-family:'DM Mono',monospace;
}

.src-preview{font-size:11px;color:#9c7a5a;line-height:1.5;}

/* INPUT */
.inputzone{
  padding:14px 24px 18px;
  border-top:1px solid rgba(124,45,45,0.1);
  background:#f5f0e8;
  display:flex;flex-direction:column;gap:7px;
}

.inputbox{
  display:flex;align-items:flex-end;gap:10px;
  background:#ede8de;
  border:1.5px solid rgba(124,45,45,0.15);
  border-radius:12px;padding:10px 12px;
  transition:all 0.2s;
}

.inputbox:focus-within{
  border-color:rgba(124,45,45,0.4);
  box-shadow:0 0 0 3px rgba(124,45,45,0.06);
}

.inputbox.muted{opacity:0.45;pointer-events:none;}

.inputtext{
  flex:1;background:transparent;border:none;outline:none;
  color:#2c1a0e;font-size:14px;
  font-family:'DM Sans',sans-serif;
  resize:none;line-height:1.6;
  max-height:120px;overflow-y:auto;
}

.inputtext::placeholder{color:#c4aa90;}

.sendbtn{
  width:32px;height:32px;
  background:#7c2d2d;
  border:none;border-radius:8px;
  color:#fef2f2;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;transition:all 0.2s;
}

.sendbtn:hover:not(:disabled){
  background:#991b1b;
  transform:translateY(-1px);
  box-shadow:0 4px 12px rgba(124,45,45,0.25);
}

.sendbtn:disabled{opacity:0.25;cursor:not-allowed;transform:none;}

.inputnote{
  font-size:10px;color:#c4aa90;
  text-align:center;
  font-family:'DM Mono',monospace;letter-spacing:0.03em;
}
`;
