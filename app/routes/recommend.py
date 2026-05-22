from fastapi import APIRouter
from pydantic import BaseModel
from enum import Enum
from typing import Optional
from openai import OpenAI
from dotenv import load_dotenv
import os
import json
import re

load_dotenv()

router = APIRouter()

# Groq / OpenAI client
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

# -----------------------
# ENUM DEFINITIONS
# -----------------------

class Mood(str, Enum):
    happy = "happy"
    sad = "sad"
    neutral = "neutral"
    excited = "excited"


class Budget(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class SpiceLevel(str, Enum):
    mild = "mild"
    medium = "medium"
    spicy = "spicy"


# -----------------------
# REQUEST MODEL
# -----------------------

class UserRequest(BaseModel):
    mood: Mood
    budget: Budget
    spice_level: Optional[SpiceLevel] = None


# -----------------------
# FALLBACK
# -----------------------

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
            "ai_explanation": "Fallback mode activated due to service unavailability."
        }
    }


# -----------------------
# ROUTE
# -----------------------

@router.post("/recommend")
def recommend(user: UserRequest):

    prompt = f"""
You are a Nigerian food recommendation AI.

Return ONLY valid JSON.

User:
- Mood: {user.mood}
- Budget: {user.budget}
- Spice: {user.spice_level}

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

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": "You are a strict JSON generator. Output ONLY valid JSON. No markdown. No extra text."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )

        content = response.choices[0].message.content.strip()

        # SAFE JSON PARSE
        match = re.search(r"\{.*\}", content, re.DOTALL)

        if not match:
            return fallback_response(user)

        data = json.loads(match.group())

        return {
            "status": "success",
            "data": data
        }

    except Exception:
        return fallback_response(user)