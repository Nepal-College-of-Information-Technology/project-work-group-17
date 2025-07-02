
from django.urls import path
from .views import create_custom_workout_plan, list_custom_workout_plans, delete_custom_workout_plan

urlpatterns = [
    path('add/', create_custom_workout_plan, name='list'),
    path('list/', list_custom_workout_plans, name='list_custom_workout_plans'),
    path('delete/<int:plan_id>/', delete_custom_workout_plan, name='delete_custom_workout_plan'),

    
]