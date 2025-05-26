from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Client, Project, Task, TimeLog
from .serializers import ClientSerializer, ProjectSerializer, TaskSerializer, TimeLogSerializer
from rest_framework.viewsets import ModelViewSet


class ClientListView(APIView):
    def get(self, request):
        clients = Client.objects.all()
        serializer = ClientSerializer(clients, many=True)
        return Response(serializer.data)


class ProjectListView(APIView):
    def get(self, request):
        projects = Project.objects.filter(user=request.user)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)


class TaskListView(APIView):
    def get(self, request):
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)


class TimeLogListView(APIView):
    def get(self, request):
        timelogs = TimeLog.objects.all()
        serializer = TimeLogSerializer(timelogs, many=True)
        return Response(serializer.data)


class ProjectViewSet(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_queryset(self):
        user = self.request.user
        return Project.objects.filter(manager=user)


class ClientViewSet(ModelViewSet):
    serializer_class = ClientSerializer

    def get_queryset(self):
        return Client.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskViewSet(ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TimeLogViewSet(ModelViewSet):
    serializer_class = TimeLogSerializer

    def get_queryset(self):
        return TimeLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)