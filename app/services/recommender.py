import pandas as pd
import os


# =========================
# LOAD DATASET
# =========================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

DATA_PATH = os.path.join(BASE_DIR, "data", "food.csv")

df = pd.read_csv(DATA_PATH)


# =========================
# RECOMMENDATION ENGINE
# =========================

def recommend_food(mood: str, budget: str, spice_level: str = None):

    filtered = df.copy()

    # mood behavior
    if mood.lower() == "happy":
        filtered = filtered.sample(min(10, len(filtered)))

    elif mood.lower() == "sad":
        filtered = filtered.sample(min(5, len(filtered)))

    # budget behavior
    if budget.lower() == "low":
        filtered = filtered[
            filtered["category"].isin(
                ["snack", "street food", "breakfast"]
            )
        ]

    # spice preference
    if spice_level and spice_level.lower() == "spicy":

        filtered = filtered[
            filtered["description"].str.contains(
                "spicy",
                case=False,
                na=False
            )
        ]

    # fallback
    if filtered.empty:
        filtered = df.sample(min(3, len(df)))

    return filtered.sample(
        min(3, len(filtered))
    ).to_dict(orient="records")