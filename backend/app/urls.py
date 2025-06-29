from django.urls import path
from .views import signup_view , login_view , user_fetch, predict
from .views import user_list_create

urlpatterns = [
    path('register/', signup_view, name='register'),
    path('login/', login_view, name='login'),
    path('user_details/', user_list_create, name='user-list-create'),
    path('fetch_user_details/', user_fetch, name='user-fetch'),
    path('predict/',predict, name='predict'),
]