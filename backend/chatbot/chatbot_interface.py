# chatbot_interface.py
import json
from .chatbot.chatbot import predict_class, get_response

with open('chatbot_app/chatbot/intents.json') as f:
    intents = json.load(f)

def get_bot_response(message):
    intents_list = predict_class(message)
    return get_response(intents_list, intents)
