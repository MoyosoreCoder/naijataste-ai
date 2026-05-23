import streamlit as st
import requests

st.title("🍲 NaijaTaste AI")

mood = st.text_input("Mood")
budget = st.text_input("Budget")
spice_level = st.text_input("Spice Level")

if st.button("Recommend"):
    res = requests.post(
        "https://mariamdev001-naijataste-ai.hf.space/recommend",
        json={
            "mood": mood,
            "budget": budget,
            "spice_level": spice_level
        }
    )
    st.json(res.json())
