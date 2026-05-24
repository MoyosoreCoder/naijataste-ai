import pandas as pd
import os

# =========================
# SAFE DATA LOADING (HF SAFE)
# =========================

DATA_PATH = os.path.join("data", "food.csv")

try:
    df = pd.read_csv(DATA_PATH)
except Exception as e:
    print("⚠️ Dataset load failed:", e)
    df = pd.DataFrame(columns=["category", "description"])


# =========================
# RECOMMENDATION ENGINE
# =========================

def recommend_food(mood: str, budget: str, spice_level: str = None):

    if df.empty:
        return [
            {
                "food": "Jollof Rice",
                "category": "fallback",
                "description": "Default recommendation (dataset not loaded)"
            }
        ]

    filtered = df.copy()

    # =========================
    # MOOD LOGIC
    # =========================
    if mood and mood.lower() == "happy":
        filtered = filtered.sample(min(10, len(filtered)))

    elif mood and mood.lower() == "sad":
        filtered = filtered.sample(min(5, len(filtered)))


    # =========================
    # BUDGET LOGIC
    # =========================
    if budget and budget.lower() == "low":
        filtered = filtered[
            filtered["category"].isin(
                ["snack", "street food", "breakfast"]
            )
        ]


    # =========================
    # SPICE LOGIC (SAFE)
    # =========================
    if spice_level and spice_level.lower() == "spicy":
        filtered = filtered[
            filtered["description"]
            .fillna("")
            .str.contains("spicy", case=False, na=False)
        ]


    # =========================
    # FALLBACK HANDLING
    # =========================
    if filtered.empty:
        filtered = df.sample(min(3, len(df)))


    # =========================
    # FINAL OUTPUT
    # =========================
    return filtered.sample(min(3, len(filtered))).to_dict(orient="records")