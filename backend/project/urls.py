from django.urls import path, include
from .views import ClientListView, ProjectListView, TaskListView, TimeLogListView, ProjectViewSet, ClientViewSet, TaskViewSet, TimeLogViewSet
from rest_framework.routers import DefaultRouter



project_router = DefaultRouter()
project_router.register(r'projects', ProjectViewSet, basename='project')
project_router.register(r'clients', ClientViewSet, basename='client')
project_router.register(r'tasks', TaskViewSet, basename='task')
project_router.register(r'timelogs', TimeLogViewSet, basename='timelog')



urlpatterns = [
    # path('clients/', ClientListView.as_view(), name='client_list'),
    # path('projects/', ProjectListView.as_view(), name='project_list'),
    # path('tasks/', TaskListView.as_view(), name='task_list'),
    # path('timelogs/', TimeLogListView.as_view(), name='timelog_list'),
    path('', include(project_router.urls), name='project_view_set')
]
