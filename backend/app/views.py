from django.contrib.auth import login, authenticate, get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User_details
from .serializers import UserDetailsSerializer
import json

User = get_user_model()

@csrf_exempt
@api_view(['POST'])
def signup_view(request):
    data = request.data if hasattr(request, 'data') else json.loads(request.body)
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    is_premium_user = data.get('isPremiumUser', False)

    if not username or not email or not password:
        return Response({'status': 'error', 'message': 'Missing required fields'}, status=400)

    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            isPremiumUser=is_premium_user,
            is_superuser=False,
            is_staff=False
        )
        login(request, user)
        refresh = RefreshToken.for_user(user)
        return Response({
            'status': 'success',
            'message': 'User created successfully',
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
        }, status=201)
    except Exception as e:
        return Response({'status': 'error', 'message': str(e)}, status=400)

@csrf_exempt
@api_view(['POST'])
def login_view(request):
    data = request.data if hasattr(request, 'data') else json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return Response({'status': 'error', 'message': 'Missing required fields'}, status=400)

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        refresh = RefreshToken.for_user(user)
        return Response({
            'status': 'success',
            'username': user.username,
            'email': user.email,
            'isPremiumUser': getattr(user, 'isPremiumUser', False),
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh)
        })
    else:
        return Response({'status': 'error', 'message': 'Invalid credentials'}, status=401)

@api_view(['GET', 'POST'])
def user_list_create(request):

    # Handle POST request (create user)
    if request.method == 'POST':
        serializer = UserDetailsSerializer(data=request.data)
        print(request.data['username'])
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def user_fetch(request):
    username = request.data['username']
    if username:
        user = User_details.objects.filter(username = username)
        serializer = UserDetailsSerializer(user, many=True)
        print("s data : ",serializer.data)
        return Response(serializer.data)






