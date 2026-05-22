import pandas as pd

DATA_PATH = "data/amazon_reviews.csv"

def load_reviews():
    df = pd.read_csv(DATA_PATH)

    # clean columns (depends on dataset)
    df = df.dropna()

    return df