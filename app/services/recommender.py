from fastapi import APIRouter
from pydantic import BaseModel
import os
import json
import httpx
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL   = "llama-3.3-70b-versatile"
GROQ_API_KEY = os.getenv("GROQ_API_KEY")


class UserRequest(BaseModel):
    mood: str
    budget: str
    spice_level: str
    location: str = "Lagos, Nigeria"
    favorite_foods: list[str] = []
    vibe: str = "local_chop"


@router.post("/recommend")
async def recommend(request: UserRequest):
    system_prompt = """You are a Nigerian restaurant recommendation engine that knows 
real Nigerian cities, neighborhoods, and food spots deeply.

Given a user's profile, recommend 6 real-sounding Nigerian restaurants with specific 
locations — not just food items.

Rules:
- Recommend actual RESTAURANTS or FOOD SPOTS, not just food types
- Include a specific Nigerian location (city + area e.g. "Lagos Island", "Wuse 2 Abuja")
- Match location to the user's city if provided
- The reason must be PERSONAL — reference their specific favourite foods and vibe
- Be conversational and Nigerian in tone if naija_mode is implied
- Vary categories: local buka, street food, fine dining, fast food, owambe spot
- budget low = bukas and street food, medium = mid-range restaurants, high = fine dining
- spice_level spicy = pepper soup spots, suya joints, spicy buka

Respond ONLY with valid JSON, no extra text:
{
  "reasoning": ["reason 1", "reason 2", "reason 3"],
  "recommendations": [
    {
      "food": "Restaurant name",
      "category": "Category",
      "location": "Area, City",
      "description": "Personalised reason this user would love it"
    }
  ],
  "ai_explanation": "One sentence summary"
}"""

    user_prompt = f"""User profile:
- Mood: {request.mood}
- Budget: {request.budget}
- Spice preference: {request.spice_level}
- Location: {request.location}
- Favourite foods: {', '.join(request.favorite_foods) if request.favorite_foods else 'Nigerian food'}
- Reviewer vibe: {request.vibe}

Generate 6 Nigerian restaurant recommendations personalised to this user.
Make the locations realistic for {request.location}."""

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                GROQ_API_URL,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                },
                json={
                    "model": GROQ_MODEL,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user",   "content": user_prompt},
                    ],
                    "temperature": 0.8,
                    "max_tokens": 1200,
                    "response_format": {"type": "json_object"},
                },
                timeout=30.0,
            )

        if response.status_code != 200:
            raise Exception(f"Groq error: {response.text}")

        raw = response.json()["choices"][0]["message"]["content"]
        parsed = json.loads(raw)

        return {
            "status": "success",
            "data": {
                "reasoning":       parsed.get("reasoning", []),
                "recommendations": parsed.get("recommendations", []),
                "ai_explanation":  parsed.get("ai_explanation", ""),
            }
        }

    except Exception as e:
        print(f"Groq failed: {e}")
        # Fallback with locations
        return {
            "status": "fallback",
            "data": {
                "reasoning": [
                    f"Mood = {request.mood}",
                    f"Budget = {request.budget}",
                    f"Spice preference = {request.spice_level}",
                ],
                "recommendations": [
                    {"food": "Buka Hut",        "category": "Local Buka",    "location": "Victoria Island, Lagos",  "description": "Smoky jollof rice and rich soups in the heart of VI"},
                    {"food": "Suya Spot",        "category": "Street Food",   "location": "Surulere, Lagos",         "description": "Best spiced suya in Lagos — open till midnight"},
                    {"food": "Mama Cass",        "category": "Local Nigerian", "location": "Ikeja, Lagos",           "description": "Affordable, authentic Nigerian meals done right"},
                    {"food": "Yellow Chilli",    "category": "Fine Dining",   "location": "Lekki Phase 1, Lagos",   "description": "Elevated Nigerian cuisine for a special outing"},
                    {"food": "Jevenik",          "category": "Local Nigerian", "location": "GRA, Port Harcourt",     "description": "Fan favourite for local soups across Nigeria"},
                    {"food": "Nkoyo",            "category": "Modern Nigerian","location": "Maitama, Abuja",         "description": "Modern Nigerian fine dining with stunning ambience"},
                ],
                "ai_explanation": "Fallback recommendations based on popular Nigerian restaurants.",
            }
        }