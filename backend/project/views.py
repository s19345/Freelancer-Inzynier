from pyexpat.errors import messages

from rest_framework import status, generics, mixins
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.exceptions import NotFound, ValidationError
from django.db.models import Q
from django.utils import timezone
from django.http import Http404

from .models import Client, Project, Task, TimeLog
from .pagination import CustomPageNumberPagination
from .serializers import ClientSerializer, ProjectSerializer, TaskSerializer, TimeLogCreateSerializer, \
    TimeLogStopSerializer, ProjectWriteSerializer



class ProjectDetailView(mixins.RetrieveModelMixin,
                        mixins.UpdateModelMixin,
                        mixins.DestroyModelMixin,
                        generics.GenericAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_queryset(self):
        user = self.request.user
        return Project.objects.filter(
            Q(manager=user) | Q(collabolators=user)
        ).distinct()

    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'PUT']:
            return ProjectWriteSerializer
        return ProjectSerializer

    def get_object(self):
        try:
            return super().get_object()
        except Http404:
            raise NotFound(detail='Nie znaleziono projektu.')

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class ProjectListCreateView(mixins.ListModelMixin,
                            mixins.CreateModelMixin,
                            generics.GenericAPIView):
    serializer_class = ProjectWriteSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        user = self.request.user
        return Project.objects.filter(
            Q(manager=user) | Q(collabolators=user)
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(manager=self.request.user)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class ClientViewSet(ModelViewSet):
    serializer_class = ClientSerializer

    def get_queryset(self):
        return Client.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_object(self):
        try:
            return super().get_object()
        except Http404:
            raise NotFound(detail=('Nie znaleziono klienta.'))


class TaskDetailViewSet(ReadOnlyModelViewSet):
    """
    Obsługuje pojedynczy task: GET / PATCH / DELETE.
    Nie obsługuje listowania.
    """
    serializer_class = TaskSerializer
    queryset = Task.objects.all()


class TaskListAPIView(generics.ListAPIView):
    """
    Zwraca listę tasków w zależności od filtrów w query params:
    - project=<id> → taski z tym projektem i parent_task=null
    - parent_task=<id> → taski mające parent_task = <id>
    """
    serializer_class = TaskSerializer

    def get_queryset(self):
        project_id = self.request.query_params.get("project")
        parent_task_id = self.request.query_params.get("parent_task")

        queryset = Task.objects.all()

        if parent_task_id:
            return queryset.filter(parent_task_id=parent_task_id)

        if project_id:
            return queryset.filter(project_id=project_id, parent_task__isnull=True)

        return queryset.none()


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    lookup_field = 'pk'


class TaskCreateView(generics.CreateAPIView):
    """
    Tworzy nowy task:
    - POST /tasks/?project=<id>&parent_task=<id?>
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def create(self, request, *args, **kwargs):
        project_id = request.query_params.get("project")
        parent_task_id = request.query_params.get("parent_task")

        if not project_id:
            raise ValidationError({"detail": "Musisz podać parametr project=<id>"})

        data = request.data.copy()
        data["project_id"] = project_id
        # if parent_task_id:
        #     data["parent_task_id"] = parent_task_id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)


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
