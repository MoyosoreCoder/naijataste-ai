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
# GROQ CLIENT
# =========================
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

# =========================
# REQUEST MODEL (SAFE)
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
            "ai_explanation": "Fallback mode activated due to API or parsing failure."
        }
    }


# =========================
# ROUTE
# =========================
@router.post("/recommend")
def recommend(user: UserRequest):

    # If API key missing → immediate fallback
    if not os.getenv("GROQ_API_KEY"):
        return fallback_response(user)

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": "Return ONLY valid JSON. No markdown. No extra text."
                },
                {
                    "role": "user",
                    "content": f"""
You are a Nigerian food recommendation AI.

User:
- Mood: {user.mood}
- Budget: {user.budget}
- Spice level: {user.spice_level}

Return JSON in this format:
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
                }
            ],
            temperature=0.2
        )

        content = response.choices[0].message.content.strip()

        # SAFE JSON PARSE (NO REGEX)
        try:
            data = json.loads(content)
        except:
            return fallback_response(user)

        return {
            "status": "success",
            "data": data
        }

    except Exception as e:
        print("Recommend API Error:", e)
        return fallback_response(user)