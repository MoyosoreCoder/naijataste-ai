from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.recommend import router as recommend_router
from app.routes.review import router as review_router

app = FastAPI()

# =========================
# CORS MIDDLEWARE
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can restrict later to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# ROUTES
# =========================
app.include_router(recommend_router)
app.include_router(review_router)

@app.get("/")
def home():
    return {"message": "NaijaTaste AI is running"}