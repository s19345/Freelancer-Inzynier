import datetime
from collections import defaultdict
from datetime import timedelta
from rest_framework import status, generics, mixins
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import IsAuthenticated

from django.db.models import Q, Count, Case, When, IntegerField, Min, Prefetch, Value
from django.db.models.functions import Coalesce, TruncDate
from django.utils import timezone
from django.utils.timezone import now
from django.http import Http404

from users.models import CustomUser

from .models import Client, Project, Task, TimeLog
from .pagination import CustomPageNumberPagination
from .serializers import ClientSerializer, ProjectSerializer, TaskSerializer, TimeLogCreateSerializer, \
    TimeLogStopSerializer, ProjectWriteSerializer, ProjectWithUserTasksSerializer


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

    def get_serializer(self, *args, **kwargs):
        if self.request.method == 'GET':
            return ProjectSerializer(*args, **kwargs)
        return super().get_serializer(*args, **kwargs)

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


class TaskListAPIView(generics.ListAPIView):
    """
    Zwraca listę tasków w zależności od filtrów w query params:
    - project=<id> → taski z tym projektem i parent_task=null
    - parent_task=<id> → taski mające parent_task = <id>
    """
    serializer_class = TaskSerializer

    def get_queryset(self):
        user = self.request.user
        project_id = self.request.query_params.get("project")
        parent_task_id = self.request.query_params.get("parent_task")

        queryset = Task.objects.all()

        if parent_task_id:
            queryset = queryset.filter(parent_task_id=parent_task_id)

        elif project_id:
            queryset = queryset.filter(project_id=project_id, parent_task__isnull=True)

        else:
            return queryset.none()

        return queryset.annotate(
            user_order=Case(
                When(user=user, then=0),
                default=1,
                output_field=IntegerField()
            )
        ).order_by('user_order', 'due_date')


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
        if not project_id:
            raise ValidationError({"detail": "Musisz podać parametr project=<id>"})

        data = request.data.copy()
        data["project_id"] = project_id

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
            'status': task.get_status_display()
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


class RecentProjectsWithTasksView(generics.ListAPIView):
    serializer_class = ProjectWithUserTasksSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        return context

    def get_queryset(self):
        user = self.request.user

        tasks = (
            Task.objects.filter(user=user)
            .exclude(status='completed')
            .order_by('due_date')
        )

        projects = Project.objects.filter(
            Q(manager=user) | Q(collabolators=user)
        ).distinct()

        project_ids = projects.values_list("id", flat=True)

        timelogs = (
            TimeLog.objects
            .filter(task__project_id__in=project_ids, task__user=user)
            .select_related('task__project')
            .annotate(
                date=TruncDate('start_time'),
                effective_end_time=Coalesce('end_time', Value(now()))
            )
            .order_by('start_time')
        )

        intervals_by_day = defaultdict(list)

        for log in timelogs:
            for start, end in self.split_interval_by_day(log.start_time, log.effective_end_time):
                intervals_by_day[start.date()].append((start, end))

        timelog_map = {}
        for day, intervals in intervals_by_day.items():
            merged = self.merge_intervals(intervals)
            total = sum((end - start for start, end in merged), timedelta())
            timelog_map[day] = total

        self.timelog_map = timelog_map

        collaborators_qs = CustomUser.objects.exclude(id=user.id).annotate(
            task_count=Count('tasks', filter=Q(tasks__project_id__in=project_ids))
        ).order_by('-task_count')

        status_order = Case(
            When(status='active', then=Value(0)),
            When(status='paused', then=Value(1)),
            When(status='completed', then=Value(2)),
            output_field=IntegerField(),
        )

        return (
            Project.objects.filter(id__in=project_ids)
            .annotate(
                most_urgent_due_date=Min('tasks__due_date', filter=Q(tasks__user=user)),
                status_order=status_order,
                has_due_date=Case(
                    # określa czy projekt ma jakiekolwiek taski
                    When(tasks__due_date__isnull=False, then=Value(1)),
                    default=Value(0),
                    output_field=IntegerField(),
                )
            )
            .order_by('status_order', '-has_due_date', 'most_urgent_due_date')
            .prefetch_related(
                Prefetch('tasks', queryset=tasks, to_attr='user_tasks_prefetched'),
                Prefetch(
                    'collabolators',
                    queryset=collaborators_qs,
                    to_attr='prefetched_collaborators')
            )
        )

    def split_interval_by_day(self, start, end):
        """
        Splits the interval (start, end) into smaller intervals, so that each fits within a single calendar day.
        """
        intervals = []
        current_start = start

        while current_start.date() < end.date():
            end_of_day = datetime.datetime.combine(
                current_start.date() + datetime.timedelta(days=1),
                datetime.datetime.min.time(),
                tzinfo=current_start.tzinfo
            )
            intervals.append((current_start, end_of_day))
            current_start = end_of_day

        intervals.append((current_start, end))
        return intervals

    def merge_intervals(self, intervals):
        # intervals: lista krotek (start_time, end_time)
        if not intervals:
            return []

        # Posortuj po starcie
        sorted_intervals = sorted(intervals, key=lambda x: x[0])
        merged = [sorted_intervals[0]]

        for current_start, current_end in sorted_intervals[1:]:
            last_start, last_end = merged[-1]
            if current_start < last_end:
                # scalaj przedziały
                merged[-1] = (last_start, max(last_end, current_end))
            else:
                merged.append((current_start, current_end))
        return merged

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        total_daily_times = [
            {
                "date": date.isoformat(),
                "total_time": total_time.total_seconds() if total_time else 0,
            }
            for date, total_time in sorted(self.timelog_map.items())
        ]
        return Response({
            "projects": serializer.data,
            "total_daily_times": total_daily_times,
        })
