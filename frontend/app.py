import gradio as gr
import requests

def recommend(mood, budget, spice_level):
    response = requests.post(
        "https://mariamdev001-naijataste-ai.hf.space/recommend",
        json={
            "mood": mood,
            "budget": budget,
            "spice_level": spice_level
        }
    )

    return response.json()

demo = gr.Interface(
    fn=recommend,
    inputs=[
        gr.Textbox(label="Mood"),
        gr.Textbox(label="Budget"),
        gr.Textbox(label="Spice Level")
    ],
    outputs="json",
    title="🍲 NaijaTaste AI"
)

demo.launch()
