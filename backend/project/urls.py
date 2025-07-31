from django.urls import path, include
from .views import ClientViewSet, StartTaskTimeLogView, StopTaskTimeLogView, \
    EndTaskTimeLogView, TaskDetailViewSet, TaskListAPIView, TaskDetailView, TaskCreateView, ProjectDetailView, \
    ProjectListCreateView
from rest_framework.routers import DefaultRouter

project_router = DefaultRouter()
# project_router.register(r'projects', ProjectViewSet, basename='project')
project_router.register(r'clients', ClientViewSet, basename='client')
# project_router.register(r'tasks', TaskDetailViewSet, basename='task')

urlpatterns = [
    path('', include(project_router.urls), name='project_view_set'),
    path('start-task-timelog/', StartTaskTimeLogView.as_view(), name='start_task_timelog'),
    path('stop-task-timelog/', StopTaskTimeLogView.as_view(), name='stop_task_timelog'),
    path('end-task-timelog/', EndTaskTimeLogView.as_view(), name='end_task_timelog'),
    path("task/", TaskCreateView.as_view(), name="task_create"),
    path("tasks/", TaskListAPIView.as_view(), name="task_list"),
    path("tasks/<int:pk>/", TaskDetailView().as_view(), name="task_detail"),
    path("projects/", ProjectListCreateView.as_view(), name="project_list_create"),
    path("projects/<int:pk>/", ProjectDetailView.as_view(), name="project_detail"),

]
