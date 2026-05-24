from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from openai import OpenAI
from dotenv import load_dotenv
import os
import json

load_dotenv()

router = APIRouter()


# =========================
# REQUEST MODEL
# =========================
class UserRequest(BaseModel):
    mood: str
    budget: str
    spice_level: Optional[str] = None


# =========================
# FALLBACK RESPONSE
# =========================
def fallback_response(user: UserRequest):
    return {
        "status": "success",
        "data": {
            "reasoning": [
                f"Mood = {user.mood}",
                f"Budget = {user.budget}",
                f"Spice preference = {user.spice_level}"
            ],
            "recommendations": [
                {
                    "food": "Jollof Rice",
                    "category": "main",
                    "description": "Classic Nigerian rice dish"
                },
                {
                    "food": "Suya",
                    "category": "street_food",
                    "description": "Spicy grilled meat skewers"
                },
                {
                    "food": "Akara",
                    "category": "breakfast",
                    "description": "Fried bean cakes"
                }
            ],
            "ai_explanation": "Fallback mode activated due to missing API key or service failure."
        }
    }


# =========================
# SAFE CLIENT INITIALIZER
# =========================
def get_client():
    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        return None  # prevents app crash

    return OpenAI(
        api_key=api_key,
        base_url="https://api.groq.com/openai/v1"
    )


# =========================
# ROUTE
# =========================
@router.post("/recommend")
def recommend(user: UserRequest):

    client = get_client()

    # If no API key → fallback immediately
    if client is None:
        return fallback_response(user)

    try:
        prompt = f"""
You are a Nigerian food recommendation AI.

Return ONLY valid JSON.

User:
- Mood: {user.mood}
- Budget: {user.budget}
- Spice level: {user.spice_level}

Format:
{{
  "reasoning": ["..."],
  "recommendations": [
    {{
      "food": "",
      "category": "",
      "description": ""
    }}
  ],
  "ai_explanation": ""
}}
"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": "You must return ONLY valid JSON. No markdown. No explanation."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2
        )

        content = response.choices[0].message.content.strip()

        # SAFE JSON PARSING
        try:
            data = json.loads(content)
        except Exception:
            return fallback_response(user)

        return {
            "status": "success",
            "data": data
        }

    except Exception as e:
        print("Recommend API Error:", e)
        return fallback_response(user)