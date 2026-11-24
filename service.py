from pathlib import Path
import re
from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field, ConfigDict, field_validator

ROOT = Path(__file__).resolve().parent
app = FastAPI(title="Document Q&A")

class Query(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    query: str = Field(min_length=1, max_length=2000)
    previous_order: str | None = Field(default=None, pattern=r"^[A-Z]\d{4}$")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/", include_in_schema=False)
def home():
    return FileResponse(ROOT / "index.html")

@app.get("/app.mjs", include_in_schema=False)
def client():
    return FileResponse(ROOT / "server-client.mjs", media_type="text/javascript")

@app.get("/engine.mjs", include_in_schema=False)
def engine():
    return FileResponse(ROOT / "engine.mjs", media_type="text/javascript")

@app.get("/style.css", include_in_schema=False)
def style():
    return FileResponse(ROOT / "style.css")
from collections import Counter
from math import log
DOCS = {"Returns": "You can return unused items within 30 days of delivery. Start your return from the Orders page. Refunds typically arrive within five business days after inspection.",
        "Shipping": "Standard shipping takes three to five business days after dispatch. Express shipping takes one to two business days.",
        "Warranty": "Hardware includes a one-year warranty for manufacturing defects. Keep your order confirmation as proof of purchase.",
        "Account access": "Use the password reset link on the sign-in page. The reset email expires after 30 minutes."}

def tokens(text):
    stop = set("a an and are can do does for how i in is it me of on the to what when where my long many about policy".split())
    return [w.rstrip("s") for w in re.findall(r"[a-z0-9]+", text.lower()) if w not in stop]

def retrieve(question, documents):
    passages = [(name, chunk.strip()) for name, body in documents.items()
                for chunk in re.split(r"(?<=[.!?])\s+|\n+", body) if chunk.strip()]
    counts = [Counter(tokens(title) * 2 + tokens(body)) for title, body in passages]
    ranked = []
    for i, count in enumerate(counts):
        score = sum(log(1 + len(counts) / (1 + sum(term in c for c in counts))) * min(3, count[term])
                    for term in set(tokens(question)))
        if score:
            ranked.append((score, i))
    selected = [passages[i] for _, i in sorted(ranked, key=lambda pair: (-pair[0], pair[1]))[:2]]
    return {"answer": " ".join(body for _, body in selected) or "No supporting passage found.",
            "citations": [{"document": title, "quote": body} for title, body in selected]}
class DocumentQuery(Query):
    documents: dict[str, str] | None = Field(default=None, max_length=12)

    @field_validator("documents")
    @classmethod
    def limit_input(cls, value):
        if value is not None and any(not key.strip() or len(key)>150 or not body.strip() or len(body)>6000 for key, body in value.items()):
            raise ValueError("Use named documents with 1–6000 characters each.")
        return value

@app.post("/api/query")
def query(request: DocumentQuery):
    return retrieve(request.query, DOCS if request.documents is None else request.documents)
