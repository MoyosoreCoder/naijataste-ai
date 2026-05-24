import pandas as pd
import os

# =========================
# SAFE DATA LOADER
# =========================
def load_data():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    data_path = os.path.join(base_dir, "data", "food.csv")

    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}")

    return pd.read_csv(data_path)


# =========================
# RECOMMENDATION ENGINE
# =========================
def recommend_food(mood: str, budget: str, spice_level: str = None):

    df = load_data()
    filtered = df.copy()

    mood = mood.lower()
    budget = budget.lower()
    spice_level = spice_level.lower() if spice_level else None

    # =========================
    # MOOD FILTER
    # =========================
    if mood == "happy":
        filtered = filtered.sample(min(10, len(filtered)))

    elif mood == "sad":
        filtered = filtered.sample(min(5, len(filtered)))

    # =========================
    # BUDGET FILTER
    # =========================
    if budget == "low":
        filtered = filtered[
            filtered["category"].isin(["snack", "street food", "breakfast"])
        ]

    # =========================
    # SPICE FILTER
    # =========================
    if spice_level == "spicy":
        filtered = filtered[
            filtered["description"].str.contains("spicy", case=False, na=False)
        ]

    # =========================
    # SAFE FALLBACK
    # =========================
    if filtered.empty:
        filtered = df.sample(min(3, len(df)))

    # =========================
    # FINAL OUTPUT SAFETY
    # =========================
    return filtered.sample(min(3, len(filtered))).to_dict(orient="records")