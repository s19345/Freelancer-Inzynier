from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Client, Project, Task, TimeLog
from .serializers import ClientSerializer, ProjectSerializer, TaskSerializer, TimeLogSerializer


class ClientListView(APIView):
    def get(self, request):
        clients = Client.objects.all()
        serializer = ClientSerializer(clients, many=True)
        return Response(serializer.data)


class ProjectListView(APIView):
    def get(self, request):
        projects = Project.objects.all()
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
