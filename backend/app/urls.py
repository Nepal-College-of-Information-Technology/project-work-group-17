from django.urls import path
from .views import signup_view , login_view , user_list_create , user_fetch
urlpatterns = [
    path('register/', signup_view, name='register'),
    path('login/', login_view, name='login'),
    path('user_details/', user_list_create, name='user-list-create'),
    path('fetch_user_details/', user_fetch, name='user-fetch'),
]