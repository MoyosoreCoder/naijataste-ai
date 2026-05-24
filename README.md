title: NaijaTaste AI 🍲
emoji: 🍲
colorFrom: green
colorTo: yellow
sdk: docker
app_port: 7860
---


# NaijaTaste AI

NaijaTaste AI is an intelligent food recommendation and review simulation system that models user behavior, generates contextual Nigerian food reviews, and delivers personalized food recommendations using rule-based logic and LLM-assisted reasoning.

This project was built for the DSN x BCT LLM Agent Challenge.

---

## Features

- Food review generation based on user mood, experience, and personality
- Personalized Nigerian food recommendation system
- Context-aware rating prediction logic
- LLM-powered reasoning with fallback support
- REST API using FastAPI
- Dataset-driven behavior simulation (Amazon Reviews)
- Docker container support

---

## Project Goals

- Simulate realistic user food preferences and behavior
- Generate contextual and human-like food reviews
- Provide intelligent recommendations based on user input
- Combine dataset-driven logic with rule-based reasoning
- Build a structured decision system for food preference modeling

---
## Architecture Overview

The system is structured into three layers:

### API Layer
FastAPI handles:
- /review
- /recommend

### Logic Layer
- Rule-based sentiment analysis
- User preference modeling
- Added logic for LLM

### Data Layer
- Amazon Reviews dataset used for behavioral simulation
---

## Tech Stack

- Python
- FastAPI
- Pandas
- OpenAI API
- Docker
- Amazon Reviews Dataset (CSV)

---

## API Endpoints

### Home

```http
GET /

Response:

{
  "message": "NaijaTaste AI is running"
}
Generate Review
POST /review

Request:

{
  "user_mood": "happy",
  "food": "Jollof Rice",
  "experience": "delicious",
  "budget": "low",
  "personality": "foodie"
}

Response:

{
  "food": "Jollof Rice",
  "rating": 5,
  "review": "The jollof rice was absolutely delicious and enjoyable..."
}
Get Recommendations
POST /recommend
This uses enum for ease

Request:

{
  "mood": "happy",
  "budget": "low",
  "spice_level": "spicy"
}

Response:

{
  "status": "success",
  "data": {
    "reasoning": [
      "Mood = happy",
      "Budget = low",
      "Spice preference = spicy"
    ],
    "recommendations": [
      {
        "food": "Jollof Rice",
        "category": "main",
        "description": "Classic Nigerian rice dish"
      }
    ],
    "ai_explanation": "Based on user context, recommendations were generated."
  }
}
How to Run Locally
pip install -r requirements.txt
uvicorn app.main:app --reload
Run with Docker
docker build -t naijataste-ai .
docker run -p 8000:8000 naijataste-ai
Notes
Implements intelligent fallback reasoning system to ensure consistent recommendations even without LLM availability.
Combines the dataset-driven logic with rule-based reasoning
Designed as a structured AI system for food behavior modeling

## Docker Deployment

The application is fully containerized.

Build:
docker build -t naijataste-ai .

Run:
docker run -p 8000:8000 naijataste-ai