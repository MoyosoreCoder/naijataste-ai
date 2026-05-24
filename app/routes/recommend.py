from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from openai import OpenAI
import os
import json
import re

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
                f"Spice preference = {user.spice_level or 'not specified'}"
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
            "ai_explanation": "Fallback mode used (no API or parsing failure)."
        }
    }


# =========================
# SAFE CLIENT INITIALIZER
# =========================
def get_client():
    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        return None

    return OpenAI(
        api_key=api_key,
        base_url="https://api.groq.com/openai/v1"
    )


# =========================
# SAFE JSON PARSER
# =========================
def extract_json(text: str):
    try:
        return json.loads(text)
    except:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except:
                return None
    return None


# =========================
# ROUTE
# =========================
@router.post("/recommend")
def recommend(user: UserRequest):

    client = get_client()

    if client is None:
        return fallback_response(user)

    try:
        prompt = f"""
You are a Nigerian food recommendation AI.

Return ONLY valid JSON.

User:
- Mood: {user.mood}
- Budget: {user.budget}
- Spice level: {user.spice_level or "not specified"}

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
            model="llama3-8b-8192",
            messages=[
                {
                    "role": "system",
                    "content": "Return ONLY valid JSON. No markdown. No extra text."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2
        )

        content = response.choices[0].message.content.strip()

        data = extract_json(content)

        if not data:
            return fallback_response(user)

        return {
            "status": "success",
            "data": data
        }

    except Exception as e:
        print("🔥 GROQ ERROR:", repr(e))
        return fallback_response(user)