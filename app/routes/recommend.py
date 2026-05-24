from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from openai import OpenAI
import os
import json
import re

router = APIRouter()


from dotenv import load_dotenv
load_dotenv()
# =========================
# REQUEST MODEL
# =========================
class UserRequest(BaseModel):
    mood: str
    budget: str
    spice_level: Optional[str] = None


# =========================
# CLIENT
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
# ROUTE
# =========================
@router.post("/recommend")
def recommend(user: UserRequest):

    client = get_client()

    if client is None:
        return {
            "status": "error",
            "message": "GROQ_API_KEY is missing"
        }

    spice = user.spice_level or "not specified"

    prompt = f"""
Return ONLY valid JSON. No markdown. No extra text.

Format:
{{
  "reasoning": [
    "Mood: {user.mood}",
    "Budget: {user.budget}",
    "Spice: {spice}"
  ],
  "recommendations": [
    {{
      "food": "string",
      "category": "string",
      "description": "string"
    }}
  ],
  "ai_explanation": "string"
}}

User:
Mood: {user.mood}
Budget: {user.budget}
Spice: {spice}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a strict JSON generator. "
                        "Return ONLY valid JSON. No markdown, no explanation."
                    )
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0,
            max_tokens=500
        )

        content = response.choices[0].message.content.strip()

        print("\n🔥 RAW GROQ RESPONSE:\n", content)

        # =========================
        # CLEAN RESPONSE
        # =========================
        content = re.sub(r"```json|```", "", content).strip()

        match = re.search(r"\{.*\}", content, re.DOTALL)
        if not match:
            return {
                "status": "error",
                "message": "No valid JSON found in AI response",
                "raw_output": content
            }

        clean_json = match.group(0)

        # =========================
        # PARSE JSON
        # =========================
        try:
            data = json.loads(clean_json)
        except Exception as e:
            return {
                "status": "error",
                "message": "JSON parsing failed",
                "error": str(e),
                "raw_output": clean_json
            }

        # =========================
        # VALIDATION
        # =========================
        if not isinstance(data, dict):
            return {
                "status": "error",
                "message": "AI response is not a JSON object"
            }

        if "recommendations" not in data:
            return {
                "status": "error",
                "message": "Missing 'recommendations' field",
                "data": data
            }

        return {
            "status": "success",
            "data": data
        }

    except Exception as e:
        print("❌ SERVER ERROR:", repr(e))

        return {
            "status": "error",
            "message": "Server error during AI request",
            "error": str(e)
        }