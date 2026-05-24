from fastapi import FastAPI
from app.routes.recommend import router as recommend_router
from app.routes.review import router as review_router

app = FastAPI()

app.include_router(recommend_router)
app.include_router(review_router)


@app.get("/")
def home():
    return {"message": "NaijaTaste AI is running"}