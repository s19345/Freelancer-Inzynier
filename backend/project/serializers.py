from rest_framework import serializers
from .models import Client, Project, Task, TimeLog


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'


class TimeLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeLog
        fields = '__all__'
