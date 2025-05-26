from django.contrib import admin
from django.urls import path
from django.urls.conf import include

from .views import CreateUserView, UserListView, UserViewSet
from rest_framework.routers import DefaultRouter


user_router = DefaultRouter()
user_router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('create_user/', CreateUserView.as_view(), name='create_user'),
    path('users/', UserListView.as_view(), name='user_list'),
    path('', include(user_router.urls), name='user_view_set')
]
