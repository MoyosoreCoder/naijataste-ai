import gradio as gr
import requests

API_URL = "https://mariamdev001-naijataste-ai.hf.space/recommend"

def recommend(mood, budget, spice_level):
    try:
        response = requests.post(
            API_URL,
            json={
                "mood": mood,
                "budget": budget,
                "spice_level": spice_level
            },
            timeout=10
        )
        return response.json()
    except Exception as e:
        return {"error": str(e)}

demo = gr.Interface(
    fn=recommend,
    inputs=[
        gr.Dropdown(
            ["happy", "sad", "excited", "neutral"],
            label="Mood",
            value="happy"
        ),
        gr.Dropdown(
            ["low", "medium", "high"],
            label="Budget",
            value="low"
        ),
        gr.Dropdown(
            ["mild", "spicy"],
            label="Spice Level",
            value="spicy"
        )
    ],
    outputs="json",
    title="🍲 NaijaTaste AI",
    description="Get personalized Nigerian food recommendations based on your mood, budget, and spice preference."
)

demo.launch()
