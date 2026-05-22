from app.services.recommender import recommend_food
import random


class RecommendationAgent:

    def __init__(self, mood, budget, spice_level=None):
        self.mood = mood
        self.budget = budget
        self.spice_level = spice_level

    def generate_explanation(self, recommendations):

        intros = [
            "Based on your preferences, these meals fit your current mood.",
            "These recommendations were selected using your food behavior profile.",
            "Considering your Nigerian food preferences, these options stand out.",
        ]

        mood_reason = {
            "happy": "You seem to enjoy exciting and satisfying meals.",
            "sad": "Comfort foods and warm meals may improve your mood.",
            "neutral": "Balanced meal choices were selected for you."
        }

        return (
            random.choice(intros)
            + " "
            + mood_reason.get(self.mood, "")
        )

    def respond(self):

        recommendations = recommend_food(
            mood=self.mood,
            budget=self.budget,
            spice_level=self.spice_level
        )

        explanation = self.generate_explanation(recommendations)

        return {
            "recommendations": recommendations,
            "ai_explanation": explanation
        }