from django.contrib import admin
from django.urls import path

from .views import CreateUserView, UserListView

urlpatterns = [
    path('create_user/', CreateUserView.as_view(), name='create_user'),
    path('users/', UserListView.as_view(), name='user_list'),
]
