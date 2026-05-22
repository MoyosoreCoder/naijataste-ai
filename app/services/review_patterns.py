import pandas as pd
import os
import random

# Get project root
BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(__file__)
    )
)

# Dataset path
DATA_PATH = os.path.join(
    BASE_DIR,
    "data",
    "amazon_reviews.csv"
)

# Load dataset
df = pd.read_csv(DATA_PATH)

# Keep useful columns only
df = df[["Score", "Text"]].dropna()


def get_review_by_sentiment(sentiment: str):

    if sentiment == "positive":
        reviews = df[df["Score"] >= 4]["Text"].tolist()

    elif sentiment == "negative":
        reviews = df[df["Score"] <= 2]["Text"].tolist()

    else:
        reviews = df[df["Score"] == 3]["Text"].tolist()

    return random.choice(reviews) if reviews else ""