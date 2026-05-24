from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.recommend import router as recommend_router
from app.routes.review import router as review_router

app = FastAPI(
    title="NaijaTaste AI",
    description="LLM-powered Nigerian food review and recommendation system",
    version="1.0.0"
)

# ── CORS ──────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",     
        "http://127.0.0.1:3000",     
        "*",                           
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────

app.include_router(recommend_router)
app.include_router(review_router)

# ── Health check ──────────────────────────────────────────────────────────────

@app.get("/")
def home():
    return {"message": "NaijaTaste AI is running"}