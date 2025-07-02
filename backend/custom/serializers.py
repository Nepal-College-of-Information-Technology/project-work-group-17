from .models import CustomWorkoutPlan
from rest_framework import serializers

class CustomWorkoutPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomWorkoutPlan
        fields = ['id', 'user', 'name', 'day', 'description']
        read_only_fields = ['user']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
