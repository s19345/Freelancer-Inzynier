from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.db.models import Q
from django.utils import timezone

from .models import Client, Project, Task, TimeLog
from .serializers import ClientSerializer, ProjectSerializer, TaskSerializer, TimeLogCreateSerializer, \
    TimeLogStopSerializer


class ProjectViewSet(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_queryset(self):
        user = self.request.user
        return Project.objects.filter(
            Q(manager=user) | Q(collabolators=user)
        ).distinct()

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


class BaseTaskTimeLogView(generics.GenericAPIView):
    """Base class for task time log actions."""
    serializer_class = None
    new_status = None
    success_message = None

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        task = serializer.validated_data['task']
        timelog = serializer.validated_data['timelog'] if 'timelog' in serializer.validated_data else None

        if self.new_status:
            task.status = self.new_status
            task.save(update_fields=['status'])

        if timelog:
            timelog.end_time = timezone.now()
            timelog.save(update_fields=['end_time'])
        else:
            timelog = TimeLog.objects.create(task=task, start_time=timezone.now(), end_time=None)

        return Response({
            'success': self.success_message.format(status=task.get_status_display()),
            'timelog_id': timelog.id,
            'start_time': timelog.start_time,
            'end_time': timelog.end_time,
            'task.status': task.get_status_display()
        }, status=status.HTTP_200_OK)


class StartTaskTimeLogView(BaseTaskTimeLogView):
    serializer_class = TimeLogCreateSerializer
    new_status = 'in_progress'
    success_message = 'Zadanie zostało rozpoczęte, status został ustawiony na {status}.'


class StopTaskTimeLogView(BaseTaskTimeLogView):
    serializer_class = TimeLogStopSerializer
    new_status = 'to_do'
    success_message = 'Zadanie zostało wstrzymane a status został ustawiony na {status}.'


class EndTaskTimeLogView(BaseTaskTimeLogView):
    serializer_class = TimeLogStopSerializer
    new_status = 'completed'
    success_message = 'Zadanie zostało zakończone a status został ustawiony na {status}.'
