# serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, WorkoutPlan, WorkoutSchedule, Exercise

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect credentials")


from .models import User_details

class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_details
        fields = '__all__'

class WorkoutScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutSchedule
        fields = ['day', 'workout']

class WorkoutPlanSerializer(serializers.ModelSerializer):
    schedule = WorkoutScheduleSerializer(many=True, read_only=True)
    class Meta:
        model = WorkoutPlan
        fields = ['id', 'name', 'description', 'schedule']

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'name', 'type', 'equipment', 'muscle_group', 'image_url']
