from fastapi import APIRouter
from pydantic import BaseModel
from app.services.dataset_loader import load_reviews
import random

router = APIRouter()


class ReviewRequest(BaseModel):
    user_mood: str
    food: str
    experience: str
    budget: str | None = None
    personality: str | None = None


@router.post("/review")
def generate_review(data: ReviewRequest):

    mood = data.user_mood.lower()
    food = data.food.lower()
    experience = data.experience.lower()

    budget = data.budget.lower() if data.budget else "medium"
    personality = data.personality.lower() if data.personality else "regular"

    # =========================
    # LOAD DATASET (SAFE USE)
    # =========================
    try:
        df = load_reviews()

        # ❗ DO NOT inject raw text (prevents "tea problem")
        df = df.dropna(subset=["Text", "Score"])

        sample = df.sample(1).iloc[0]
        dataset_rating = int(sample["Score"])

        # only use STYLE, not content
        style_phrases = [
            "very satisfying experience",
            "taste was quite impressive",
            "would definitely recommend",
            "felt like a homemade meal",
            "rich and enjoyable flavor"
        ]

        dataset_style = random.choice(style_phrases)

    except Exception:
        dataset_rating = 4
        dataset_style = ""

    # =========================
    # BASE LOGIC
    # =========================
    rating = dataset_rating
    review = ""

    if experience in ["bad", "terrible", "cold", "burnt"]:
        rating = 2
        review = f"The {food} was disappointing and did not meet expectations."

    elif mood == "happy" and experience in ["nice", "good", "tasty", "delicious"]:
        rating = 5
        review = f"The {food} was absolutely delicious and enjoyable."

    elif mood == "sad":
        rating = 3
        review = f"The {food} was okay, but mood affected enjoyment."

    else:
        review = f"The {food} was decent overall."

    # =========================
    # CONTEXT BOOSTS
    # =========================
    if budget == "low":
        review += " It was affordable and budget-friendly."

    if personality == "foodie":
        review += " As a foodie, this stood out nicely."

    # =========================
    # SAFE DATASET STYLE INJECTION
    # =========================
    if dataset_style:
        review += f" {dataset_style}."

    # =========================
    # NAIJA FLAVOR
    # =========================
    review += random.choice([
        " Omo, the flavor was actually impressive.",
        " It had that proper Naija taste.",
        " The seasoning was on point.",
        " This felt like street food quality."
    ])

    return {
        "food": data.food.title(),
        "rating": rating,
        "review": review
    }