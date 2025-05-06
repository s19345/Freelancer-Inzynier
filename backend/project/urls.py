from django.urls import path
from .views import ClientListView, ProjectListView, TaskListView, TimeLogListView

urlpatterns = [
    path('clients/', ClientListView.as_view(), name='client_list'),
    path('projects/', ProjectListView.as_view(), name='project_list'),
    path('tasks/', TaskListView.as_view(), name='task_list'),
    path('timelogs/', TimeLogListView.as_view(), name='timelog_list'),
]
