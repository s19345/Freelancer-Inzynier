from rest_framework import serializers
from users.serializers import FriendListSerializer
from .models import Client, Project, Task, TimeLog
from users.models import CustomUser


class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username"]


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'
        read_only_fields = ["user"]


class ClientSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ["id", "company_name", "contact_person"]


class ProjectSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "name", "created_at"]


class ProjectSerializer(serializers.ModelSerializer):
    collabolators = FriendListSerializer(many=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
    manager = FriendListSerializer(read_only=True)
    client = ClientSimpleSerializer(read_only=True)


class ProjectWriteSerializer(serializers.ModelSerializer):
    collabolators = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), many=True
    )

    class Meta:
        model = Project
        fields = [
            'name', 'description', 'version', 'budget',
            'client', 'status', 'collabolators', 'id'
        ]
        read_only_fields = ['id', 'created_at', 'manager']


class Meta:
    model = Project
    fields = '__all__'
    read_only_fields = ['manager']


class TaskSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'status', 'due_date']


class TaskSerializer(serializers.ModelSerializer):
    user = FriendListSerializer(read_only=True)  # tylko do odczytu

    user_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        source="user",
        write_only=True,
        required=False,
        allow_null=True
    )
    project = ProjectSimpleSerializer(read_only=True)
    parent_task = TaskSimpleSerializer(read_only=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)

    project_id = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(), source='project', write_only=True
    )

    parent_task_id = serializers.PrimaryKeyRelatedField(
        queryset=Task.objects.all(), source='parent_task', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ('id', 'created_at')


class BaseTimeLogSerializer(serializers.Serializer):
    task_id = serializers.IntegerField()

    def validate_task_exists_and_permissions(self, task_id):
        request = self.context['request']

        try:
            task = Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            raise serializers.ValidationError('Nie znaleziono zadania.')

        if task.project.manager != request.user:
            raise serializers.ValidationError('Nie masz uprawnień do tego zadania.')

        return task


class TimeLogCreateSerializer(BaseTimeLogSerializer):
    def validate(self, attrs):
        task_id = attrs.get('task_id')
        task = self.validate_task_exists_and_permissions(task_id)

        if TimeLog.objects.filter(task=task, end_time__isnull=True).exists():
            raise serializers.ValidationError('To zadanie zostało już rozpoczęte.')

        attrs['task'] = task
        return attrs


class TimeLogStopSerializer(BaseTimeLogSerializer):
    def validate(self, attrs):
        task_id = attrs.get('task_id')
        task = self.validate_task_exists_and_permissions(task_id)

        try:
            timelog = TimeLog.objects.get(task=task, end_time__isnull=True)
        except TimeLog.DoesNotExist:
            raise serializers.ValidationError('To zadanie nie zostało jeszcze rozpoczęte.')
        attrs['task'] = task
        attrs['timelog'] = timelog
        return attrs
