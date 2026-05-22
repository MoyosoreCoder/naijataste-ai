from fastapi import APIRouter
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os
import json

load_dotenv()

router = APIRouter()

# You can switch between OpenAI or Groq here
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)


class UserRequest(BaseModel):
    mood: str
    budget: str
    spice_level: str | None = None


# -----------------------
# SAFE FALLBACK FUNCTION
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
                    "food": "Akara",
                    "category": "breakfast",
                    "description": "Fried bean cakes"
                },
                {
                    "food": "Yam and Egg",
                    "category": "breakfast",
                    "description": "Fried yam with egg sauce"
                }
            ],
            "ai_explanation": "Fallback mode activated due to service unavailability."
        }
    }


@router.post("/recommend")
def recommend(user: UserRequest):

    prompt = f"""
You are a Nigerian food recommendation AI agent.

Return STRICT JSON ONLY.

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
                {"role": "system", "content": "You are a structured recommendation engine."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )

        content = response.choices[0].message.content.strip()

        # SAFE JSON PARSE
        data = json.loads(content)

        return {
            "status": "success",
            "data": data
        }

    except Exception:
        # NEVER expose raw error to user
        return fallback_response(user)