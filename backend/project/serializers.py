from rest_framework import serializers
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


class ProjectSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "name"]


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['manager']


class TaskSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'status', 'due_date']


class TaskSerializer(serializers.ModelSerializer):
    user = UserSimpleSerializer(read_only=True)
    project = ProjectSimpleSerializer(read_only=True)

    user_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), source='user', write_only=True, required=False
    )
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(), source='project', write_only=True
    )

    parent_task_id = serializers.PrimaryKeyRelatedField(
        queryset=Task.objects.all(), source='parent_task', write_only=True, required=False
    )
    parent_task = TaskSimpleSerializer(read_only=True)

    subtasks = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = '__all__'

    def get_subtasks(self, obj):
        subtasks = Task.objects.filter(parent_task=obj)
        return TaskSimpleSerializer(subtasks, many=True, context=self.context).data


class TimeLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeLog
        fields = '__all__'
