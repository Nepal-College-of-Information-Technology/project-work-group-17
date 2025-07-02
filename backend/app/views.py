from django.contrib.auth import login, authenticate, get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User_details, WorkoutPlan, Exercise
from .serializers import UserDetailsSerializer, WorkoutPlanSerializer, ExerciseSerializer
from .ml_utils import DietRecommendationModel
import json

User = get_user_model()

@csrf_exempt
@api_view(['POST'])
def signup_view(request):
    data = request.data if hasattr(request, 'data') else json.loads(request.body)
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return Response({'status': 'error', 'message': 'Missing required fields'}, status=400)

    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
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
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh)
        })
    else:
        return Response({'status': 'error', 'message': 'Invalid credentials'}, status=401)

@api_view(['GET', 'POST'])
def user_list_create(request):
    
    if request.method == 'GET':
        users = User_details.objects.all()
        serializer = UserDetailsSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = UserDetailsSerializer(data=request.data)
        print(request.data.get('username'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def user_fetch(request):
    username = request.data['username']
    if username:
        user = User_details.objects.filter(username=username)
        serializer = UserDetailsSerializer(user, many=True)
        print("s data : ", serializer.data)
        return Response(serializer.data)



@csrf_exempt
@api_view(['POST'])
def predict(request):
    if request.method == 'POST':
        try:
            # Parse JSON data from the request body
            data = json.loads(request.body)
            BMI = float(data['BMI'])
            BMR = float(data['BMR'])
            Total_Calories = float(data['Total_Calories'])
            veg_only = float(bool(data.get('veg_only', False)))
            '''BMI = float(request.data.get('BMI', 0))
            BMR = float(request.data.get('BMR', 0))
            Total_Calories = float(request.data.get('Total_Calories', 0))
            veg_only = bool(request.data.get('veg_only'))'''
            model=DietRecommendationModel()
            # Get diet recommendation based on the input data
            recommendation =model.recommend_diet(BMI, BMR, Total_Calories, veg_only)
            
            return JsonResponse(recommendation, safe=False)
           # return Response(recommendation, status=status.HTTP_200_OK)

        except (KeyError, json.JSONDecodeError) as e:
            # Handle cases where data is missing or not properly formatted
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method.'}, status=405)
    
@api_view(['POST'])
def BMI(request):
    if request.method == 'POST':
        data = request.data if hasattr(request, 'data') else json.loads(request.body)
        weight = data.get('weight')
        height = data.get('height')

        if not weight or not height:
            return JsonResponse({'error': 'Weight and height are required'}, status=400)

        try:
            weight = float(weight)
            #height in cm
            height = float(height)
            bmi= weight / ((height / 100) ** 2)  # Convert height to meters
            bmi = round(bmi, 2)  # Round to two decimal places
            return JsonResponse({'bmi': bmi}, status=200)
        except (ValueError, ZeroDivisionError):
            return JsonResponse({'error': 'Invalid input'}, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

@api_view(['GET'])
def Workout(request):
    plans = WorkoutPlan.objects.prefetch_related('schedule').all()
    serializer = WorkoutPlanSerializer(plans, many=True)
    return Response({'workouts': serializer.data})

@api_view(['GET'])
def chest(request):
    exercises = Exercise.objects.filter(muscle_group='chest')
    serializer = ExerciseSerializer(exercises, many=True)
    return Response({'chest_exercises': serializer.data})

@api_view(['GET'])
def triceps(request):
    exercises = Exercise.objects.filter(muscle_group='triceps')
    serializer = ExerciseSerializer(exercises, many=True)
    return Response({'triceps_exercises': serializer.data})

@api_view(['GET'])
def biceps(request):
    exercises = Exercise.objects.filter(muscle_group='biceps')
    serializer = ExerciseSerializer(exercises, many=True)
    return Response({'biceps_exercises': serializer.data})

@api_view(['GET'])
def back(request):
    exercises = Exercise.objects.filter(muscle_group='back')
    serializer = ExerciseSerializer(exercises, many=True)
    return Response({'back_exercises': serializer.data})

@api_view(['GET'])
def shoulders(request):
    exercises = Exercise.objects.filter(muscle_group='shoulders')
    serializer = ExerciseSerializer(exercises, many=True)
    return Response({'shoulder_exercises': serializer.data})

@api_view(['GET'])
def legs(request):
    exercises = Exercise.objects.filter(muscle_group='legs')
    serializer = ExerciseSerializer(exercises, many=True)
    return Response({'leg_exercises': serializer.data})

@api_view(['GET'])
def abs(request):
    exercises = Exercise.objects.filter(muscle_group='abs')
    serializer = ExerciseSerializer(exercises, many=True)
    return Response({'abs_exercises': serializer.data})



