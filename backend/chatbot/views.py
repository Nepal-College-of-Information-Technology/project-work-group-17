from django.shortcuts import render

# Create your views here.
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def get_chatbot_response(request):
    user_message = request.data.get('message')

    if not user_message:
        return Response({"error": "No message provided."}, status=400)

    try:
        chatbot_response = requests.post(
            "http://127.0.0.1:8001/chat",
            json={"message": user_message}
        )
        return Response(chatbot_response.json())
    except requests.exceptions.ConnectionError:
        return Response({"error": "Failed to connect to chatbot API."}, status=500)
