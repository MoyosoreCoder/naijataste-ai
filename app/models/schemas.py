from pydantic import BaseModel
from typing import List, Optional


class UserRequest(BaseModel):
    mood: str
    budget: str
    spice_level: Optional[str] = None


class FoodRecommendation(BaseModel):
    food: str
    category: str
    description: str


class RecommendationResponse(BaseModel):
    recommendations: List[FoodRecommendation]