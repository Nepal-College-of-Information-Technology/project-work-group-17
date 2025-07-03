from fastapi import FastAPI
from pydantic import BaseModel
from chatbot.chatbot.chatbot import predict_class, get_response
import json
import os

# Load intents file
intents_path = os.path.join(os.path.dirname(__file__), "chatbot", "intents.json")
with open(intents_path) as f:
    intents = json.load(f)

app = FastAPI()

class Message(BaseModel):
    message: str

@app.post("/chat")
def chat_with_bot(message: Message):
    predicted = predict_class(message.message)
    response = get_response(predicted, intents)
    return {"response": response}
