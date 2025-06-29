from django.urls import path
from .views import signup_view , login_view , user_fetch, predict,BMI,Workout,chest,biceps,triceps,back,shoulders,legs,abs
from .views import user_list_create

urlpatterns = [
    path('register/', signup_view, name='register'),
    path('login/', login_view, name='login'),
    path('user_details/', user_list_create, name='user-list-create'),
    path('fetch_user_details/', user_fetch, name='user-fetch'),
    path('predict/',predict, name='predict'),
    path('BMI/',BMI, name='BMI'),
    path('Workout/',Workout, name='workout'),
    path('chest/', chest, name='chest'),
    path('triceps/', triceps, name='triceps'),
    path('back/', back, name='back'),
    path('shoulders/', shoulders, name='shoulders'),
    path('legs/', legs, name='legs'),
    path('abs/', abs, name='abs'),
    path('biceps/', biceps, name='biceps'),

    
]