from django.contrib.auth import login, authenticate, get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User_details
from .serializers import UserDetailsSerializer
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

@csrf_exempt
@api_view(['GET'])
def Workout(request):
    workout_plans = [
        {
            "name": "Push–Pull–Legs (PPL) — 6-day split",
            "description": "Balanced hypertrophy, repeatable every week",
            "schedule": [
                {"day": 1, "workout": "Push (Chest, Shoulders, Triceps)"},
                {"day": 2, "workout": "Pull (Back, Biceps)"},
                {"day": 3, "workout": "Legs (Quads, Hamstrings, Glutes, Calves)"},
                {"day": 4, "workout": "Push"},
                {"day": 5, "workout": "Pull"},
                {"day": 6, "workout": "Legs"},
                {"day": 7, "workout": "Rest"}
            ]
        },
        {
            "name": "Bro Split — 5-day muscle group isolation",
            "description": "Maximum focus per muscle group",
            "schedule": [
                {"day": 1, "workout": "Chest"},
                {"day": 2, "workout": "Back"},
                {"day": 3, "workout": "Shoulders"},
                {"day": 4, "workout": "Legs"},
                {"day": 5, "workout": "Arms (Biceps + Triceps)"},
                {"day": 6, "workout": "Optional Cardio/Abs"},
                {"day": 7, "workout": "Rest"}
            ]
        },
        {
            "name": "Upper–Lower Split — 4-day plan",
            "description": "Strength & hypertrophy balance",
            "schedule": [
                {"day": 1, "workout": "Upper Body"},
                {"day": 2, "workout": "Lower Body"},
                {"day": 3, "workout": "Rest"},
                {"day": 4, "workout": "Upper Body"},
                {"day": 5, "workout": "Lower Body"},
                {"day": 6, "workout": "Active Rest/Abs/Cardio"},
                {"day": 7, "workout": "Rest"}
            ]
        },
        {
            "name": "Back–Biceps, Chest–Triceps, Legs–Shoulders–Abs — 3-day full body rotation",
            "description": "Intermediate bodybuilders",
            "schedule": [
                {"day": 1, "workout": "Back + Biceps"},
                {"day": 2, "workout": "Chest + Triceps"},
                {"day": 3, "workout": "Legs + Shoulders + Abs"},
                {"day": 4, "workout": "Rest"},
                {"day": 5, "workout": "Repeat or split across week"}
            ]
        },
        {
            "name": "Full-Body Split — 3 or 4 days a week",
            "description": "Beginners or time-constrained routines",
            "schedule": [
                {"day": 1, "workout": "Full Body (Compound focus)"},
                {"day": 2, "workout": "Rest or Cardio"},
                {"day": 3, "workout": "Full Body (Different variation)"},
                {"day": 4, "workout": "Rest"},
                {"day": 5, "workout": "Full Body"},
                {"day": 6, "workout": "Optional Abs/Cardio"},
                {"day": 7, "workout": "Rest"}
            ]
        }
    ]
    return JsonResponse({"workouts": workout_plans}, safe=False)

@csrf_exempt
@api_view(['GET'])
def chest(request):
    chest_exercises = [
        {
            "name": "Bench Press",
            "type": "Compound",
            "equipment": "Barbell"
        },
        {
            "name": "Incline Dumbbell Press",
            "type": "Compound",
            "equipment": "Dumbbell"
        },
        {
            "name": "Chest Dips",
            "type": "Compound",
            "equipment": "Bodyweight/Dip Bar"
        },
        {
            "name": "Push-Ups",
            "type": "Compound",
            "equipment": "Bodyweight"
        },
        {
            "name": "Dumbbell Flyes",
            "type": "Isolation",
            "equipment": "Dumbbell/Bench"
        },
        {
            "name": "Cable Crossovers",
            "type": "Isolation",
            "equipment": "Cable Machine"
        }
    ]
    return JsonResponse({"chest_exercises": chest_exercises}, safe=False)

@csrf_exempt
@api_view(['GET'])
def triceps(request):
    triceps_exercises = [
        {
            "name": "Close-Grip Bench Press",
            "type": "Compound",
            "equipment": "Barbell"
        },
        {
            "name": "Dips (Triceps Focus)",
            "type": "Compound",
            "equipment": "Bodyweight"
        },
        {
            "name": "Skull Crushers (Lying Triceps Extensions)",
            "type": "Isolation",
            "equipment": "Barbell/EZ Bar"
        },
        {
            "name": "Overhead Triceps Extensions",
            "type": "Isolation",
            "equipment": "Dumbbell/Cable"
        },
        {
            "name": "Triceps Pushdowns",
            "type": "Isolation",
            "equipment": "Cable"
        },
        {
            "name": "Kickbacks",
            "type": "Isolation",
            "equipment": "Dumbbell"
        }
    ]
    return JsonResponse({"triceps_exercises": triceps_exercises}, safe=False)

@csrf_exempt
@api_view(['GET'])
def biceps(request):
    biceps_exercises = [
        {
            "name": "Barbell Curls",
            "type": "Isolation",
            "equipment": "Barbell"
        },
        {
            "name": "Dumbbell Curls",
            "type": "Isolation",
            "equipment": "Dumbbell"
        },
        {
            "name": "Hammer Curls",
            "type": "Isolation",
            "equipment": "Dumbbell"
        },
        {
            "name": "Preacher Curls",
            "type": "Isolation",
            "equipment": "Barbell/EZ Bar"
        },
        {
            "name": "Concentration Curls",
            "type": "Isolation",
            "equipment": "Dumbbell"
        },
        {
            "name": "Cable Bicep Curls",
            "type": "Isolation",
            "equipment": "Cable Machine"
        }
    ]
    return JsonResponse({"biceps_exercises": biceps_exercises}, safe=False)

@csrf_exempt
@api_view(['GET'])
def back(request):
    back_exercises = [
        {
            "name": "Pull-Ups",
            "type": "Compound",
            "equipment": "Bodyweight"
        },
        {
            "name": "Bent-Over Rows",
            "type": "Compound",
            "equipment": "Barbell/Dumbbell"
        },
        {
            "name": "Lat Pulldowns",
            "type": "Compound",
            "equipment": "Cable Machine"
        },
        {
            "name": "Seated Cable Rows",
            "type": "Compound",
            "equipment": "Cable Machine"
        },
        {
            "name": "Deadlifts",
            "type": "Compound",
            "equipment": "Barbell"
        },
        {
            "name": "Face Pulls",
            "type": "Isolation",
            "equipment": "Cable Machine"
        }
    ]
    return JsonResponse({"back_exercises": back_exercises}, safe=False)

@csrf_exempt
@api_view(['GET'])
def shoulders(request):
    shoulder_exercises = [
        {
            "name": "Overhead Press",
            "type": "Compound",
            "equipment": "Barbell/Dumbbell"
        },
        {
            "name": "Lateral Raises",
            "type": "Isolation",
            "equipment": "Dumbbell"
        },
        {
            "name": "Front Raises",
            "type": "Isolation",
            "equipment": "Dumbbell/Cable"
        },
        {
            "name": "Rear Delt Flyes",
            "type": "Isolation",
            "equipment": "Dumbbell/Cable"
        },
        {
            "name": "Arnold Press",
            "type": "Compound",
            "equipment": "Dumbbell"
        },
        {
            "name": "Upright Rows",
            "type": "Compound",
            "equipment": "Barbell/Dumbbell"
        }
    ]
    return JsonResponse({"shoulder_exercises": shoulder_exercises}, safe=False)

@csrf_exempt
@api_view(['GET'])
def legs(request):
    leg_exercises = [
        {
            "name": "Squats",
            "type": "Compound",
            "equipment": "Barbell/Dumbbell"
        },
        {
            "name": "Leg Press",
            "type": "Compound",
            "equipment": "Leg Press Machine"
        },
        {
            "name": "Lunges",
            "type": "Compound",
            "equipment": "Bodyweight/Dumbbell"
        },
        {
            "name": "Deadlifts (Romanian/Conventional)",
            "type": "Compound",
            "equipment": "Barbell"
        },
        {
            "name": "Leg Curls",
            "type": "Isolation",
            "equipment": "Leg Curl Machine"
        },
        {
            "name": "Calf Raises",
            "type": "Isolation",
            "equipment": "Calf Raise Machine/Dumbbell"
        }
    ]
    return JsonResponse({"leg_exercises": leg_exercises}, safe=False)


@csrf_exempt
@api_view(['GET'])
def abs(request):
    abs_exercises = [
        {
            "name": "Plank",
            "type": "Core Stability",
            "equipment": "Bodyweight"
        },
        {
            "name": "Crunches",
            "type": "Isolation",
            "equipment": "Bodyweight"
        },
        {
            "name": "Leg Raises",
            "type": "Isolation",
            "equipment": "Bodyweight"
        },
        {
            "name": "Russian Twists",
            "type": "Isolation",
            "equipment": "Bodyweight/Dumbbell"
        },
        {
            "name": "Bicycle Crunches",
            "type": "Isolation",
            "equipment": "Bodyweight"
        },
        {
            "name": "Cable Woodchoppers",
            "type": "Isolation",
            "equipment": "Cable Machine"
        }
    ]
    return JsonResponse({"abs_exercises": abs_exercises}, safe=False)

