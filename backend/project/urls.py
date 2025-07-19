from django.urls import path, include
from .views import ProjectViewSet, ClientViewSet, TaskViewSet, TimeLogViewSet
from rest_framework.routers import DefaultRouter

project_router = DefaultRouter()
project_router.register(r'projects', ProjectViewSet, basename='project')
project_router.register(r'clients', ClientViewSet, basename='client')
project_router.register(r'tasks', TaskViewSet, basename='task')
project_router.register(r'timelogs', TimeLogViewSet, basename='timelog')

urlpatterns = [
    path('', include(project_router.urls), name='project_view_set')
]
