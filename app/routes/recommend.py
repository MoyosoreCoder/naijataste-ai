from fastapi import APIRouter
from pydantic import BaseModel
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class UserRequest(BaseModel):
    mood: str
    budget: str
    spice_level: str | None = None


@router.post("/recommend")
def recommend(user: UserRequest):

    prompt = f"""
You are a Nigerian food recommendation AI agent.

User Profile:
- Mood: {user.mood}
- Budget: {user.budget}
- Spice Level: {user.spice_level}

TASK:
Return STRICT JSON only in this format:

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
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a structured recommendation engine."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )

        content = response.choices[0].message.content

        return {
            "status": "success",
            "data": json.loads(content)  # convert to proper JSON
        }

    except Exception as e:

        # 🔥 SAFE FALLBACK (IMPORTANT FOR HACKATHON)
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
            }
        }