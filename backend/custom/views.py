from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import CustomWorkoutPlan
from .serializers import CustomWorkoutPlanSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_custom_workout_plan(request):
    serializer = CustomWorkoutPlanSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_custom_workout_plans(request):
    plans = CustomWorkoutPlan.objects.filter(user=request.user)
    serializer = CustomWorkoutPlanSerializer(plans, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_custom_workout_plan(request, plan_id):
    try:
        plan = CustomWorkoutPlan.objects.get(id=plan_id, user=request.user)
    except CustomWorkoutPlan.DoesNotExist:
        return Response({'error': 'Workout plan not found'}, status=status.HTTP_404_NOT_FOUND)

    plan.delete()
    return Response({'message': 'Workout plan deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
