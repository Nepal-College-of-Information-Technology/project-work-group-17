from django.db import models
from django.conf import settings


class CustomWorkoutPlan(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='custom_workout_plans', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    day = models.IntegerField()  
    def __str__(self):
        return self.name
