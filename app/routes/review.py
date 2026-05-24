from fastapi import APIRouter
from pydantic import BaseModel
import random
import pandas as pd
from app.services.dataset_loader import load_reviews

router = APIRouter()


class ReviewRequest(BaseModel):
    user_mood: str
    food: str
    experience: str
    budget: str | None = None
    personality: str | None = None


@router.post("/review")
def generate_review(data: ReviewRequest):

    mood = (data.user_mood or "").lower()
    food = (data.food or "food").lower()
    experience = (data.experience or "").lower()

    budget = (data.budget or "medium").lower()
    personality = (data.personality or "regular").lower()

    # =========================
    # SAFE DATA LOADING
    # =========================
    try:
        df = load_reviews()

        if df is None or df.empty:
            raise ValueError("Empty dataset")

        dataset_rating = 4
        dataset_style = None

        # safe column check
        if "Text" in df.columns and "Score" in df.columns:
            df_clean = df.dropna(subset=["Text", "Score"])

            if len(df_clean) > 0:
                sample = df_clean.sample(1).iloc[0]
                dataset_rating = int(sample["Score"])

        style_phrases = [
            "very satisfying experience",
            "taste was quite impressive",
            "would definitely recommend",
            "felt like a homemade meal",
            "rich and enjoyable flavor"
        ]

        dataset_style = random.choice(style_phrases)

    except Exception as e:
        print("Review dataset error:", e)
        dataset_rating = 4
        dataset_style = None

    # =========================
    # SENTIMENT LOGIC (SAFE)
    # =========================
    positive_words = ["nice", "good", "tasty", "delicious", "great", "amazing"]
    negative_words = ["bad", "terrible", "cold", "burnt", "awful", "horrible"]

    sentiment_positive = any(w in experience for w in positive_words)
    sentiment_negative = any(w in experience for w in negative_words)

    rating = dataset_rating

    if sentiment_negative:
        rating = 2
        review = f"The {food} was disappointing and did not meet expectations."

    elif mood == "happy" and sentiment_positive:
        rating = 5
        review = f"The {food} was absolutely delicious and enjoyable."

    elif mood == "sad":
        rating = 3
        review = f"The {food} was okay, but mood affected enjoyment."

    else:
        rating = 4
        review = f"The {food} was decent overall."

    # =========================
    # CONTEXT ENHANCEMENT
    # =========================
    if budget == "low":
        review += " It was affordable and budget-friendly."

    if personality == "foodie":
        review += " As a foodie, this stood out nicely."

    # =========================
    # DATASET STYLE INJECTION
    # =========================
    if dataset_style and sentiment_positive:
        review += f" {dataset_style}."

    # =========================
    # NAIJA FLAVOR BOOST
    # =========================
    review += random.choice([
        " Omo, the flavor was actually impressive.",
        " It had that proper Naija taste.",
        " The seasoning was on point.",
        " This felt like street food quality."
    ])

    return {
        "status": "success",
        "data": {
            "food": data.food.title(),
            "rating": rating,
            "review": review
        }
    }