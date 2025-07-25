from django.urls import path, include
from .views import ProjectViewSet, ClientViewSet, TaskViewSet, StartTaskTimeLogView, StopTaskTimeLogView, \
    EndTaskTimeLogView
from rest_framework.routers import DefaultRouter

project_router = DefaultRouter()
project_router.register(r'projects', ProjectViewSet, basename='project')
project_router.register(r'clients', ClientViewSet, basename='client')
project_router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(project_router.urls), name='project_view_set'),
    path('start-task-timelog/', StartTaskTimeLogView.as_view(), name='start_task_timelog'),
    path('stop-task-timelog/', StopTaskTimeLogView.as_view(), name='stop_task_timelog'),
    path('end-task-timelog/', EndTaskTimeLogView.as_view(), name='end_task_timelog'),

]
