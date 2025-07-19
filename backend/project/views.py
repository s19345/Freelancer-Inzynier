from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Client, Project, Task, TimeLog
from .serializers import ClientSerializer, ProjectSerializer, TaskSerializer, TimeLogSerializer
from rest_framework.viewsets import ModelViewSet


class ProjectViewSet(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_queryset(self):
        user = self.request.user
        return Project.objects.filter(manager=user)

    def perform_create(self, serializer):
        serializer.save(manager=self.request.user)


class ClientViewSet(ModelViewSet):
    serializer_class = ClientSerializer

    def get_queryset(self):
        return Client.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskViewSet(ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        queryset = Task.objects.filter(user=self.request.user)
        project_id = self.request.query_params.get("project")
        parent_task_id = self.request.query_params.get("parent_task")

        if project_id:
            queryset = queryset.filter(project_id=project_id)

        if parent_task_id == "null":
            queryset = queryset.filter(parent_task__isnull=True)
        elif parent_task_id:
            queryset = queryset.filter(parent_task_id=parent_task_id)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TimeLogViewSet(ModelViewSet):
    serializer_class = TimeLogSerializer

    def get_queryset(self):
        return TimeLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
