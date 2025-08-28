from rest_framework import serializers
from django.db import models
from datetime import timedelta

from project.models import Project, Task, TimeLog
from .models import CustomUser, FriendRequest, FriendNotes, Skill


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']


class FriendListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'profile_picture', ]


class FriendSearchSerializer(serializers.ModelSerializer):
    request_sent = serializers.SerializerMethodField()
    request_received = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            "id", "username", "profile_picture",
            "location", "specialization", "timezone",
            "request_sent", "request_received"
        ]

    def get_request_sent(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return FriendRequest.objects.filter(
                sender=request.user, receiver=obj
            ).exists()
        return False

    def get_request_received(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return FriendRequest.objects.filter(
                sender=obj, receiver=request.user
            ).exists()
        return False


class CustomUserSerializer(serializers.ModelSerializer):
    friends = FriendListSerializer(many=True, read_only=True)
    skills = SkillSerializer(many=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'bio', 'profile_picture', 'phone_number',
                  'location', 'timezone', 'friends', 'skills', 'specialization']


class FriendDetailSerializer(serializers.ModelSerializer):
    friend_notes = serializers.SerializerMethodField()
    skills = SkillSerializer(many=True, read_only=True)
    collaboration_history = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'first_name', 'last_name', 'email', 'bio', 'profile_picture',
            'phone_number', 'location', 'timezone', 'friend_notes', 'skills', 'collaboration_history'
        ]

    def get_friend_notes(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None

        try:
            meta = FriendNotes.objects.get(owner=request.user, friend=obj)
            return FriendNotesSerializer(meta).data
        except FriendNotes.DoesNotExist:
            return None

    def get_collaboration_history(self, obj):
        """
        Returns stats about common projects and time logs.
        """
        request = self.context['request']

        friend_projects = Project.objects.filter(
            models.Q(manager=obj) | models.Q(collabolators=obj)
        )
        user_projects = Project.objects.filter(
            models.Q(manager=request.user) | models.Q(collabolators=request.user)
        )
        common_projects = friend_projects & user_projects

        if not common_projects.exists():
            return {
                "common_projects_count": 0,
                "first_project_date": None,
                "last_project_date": None,
                "total_hours": 0
            }

        first_project_date = common_projects.order_by("created_at").first().created_at
        last_project_date = common_projects.order_by("-created_at").first().created_at

        tasks = Task.objects.filter(project__in=common_projects, user=obj)

        total_duration = timedelta()
        for timelog in TimeLog.objects.filter(task__in=tasks):
            if timelog.end_time:
                total_duration += timelog.end_time - timelog.start_time

        total_hours = total_duration.total_seconds() / 3600

        return {
            "common_projects_count": common_projects.count(),
            "first_project_date": first_project_date.date(),
            "last_project_date": last_project_date.date(),
            "total_hours": round(total_hours, 2)
        }


class GetSentFriendRequestSerializer(serializers.ModelSerializer):
    receiver = FriendListSerializer(read_only=True)

    class Meta:
        model = FriendRequest
        fields = ['id', 'receiver', 'created_at']


class GetReceivedFriendRequestSerializer(serializers.ModelSerializer):
    sender = FriendListSerializer()

    class Meta:
        model = FriendRequest
        fields = ['id', 'sender', 'created_at']


class FriendRequestAcceptSerializer(serializers.Serializer):
    id = serializers.IntegerField()


class FriendRequestSendSerializer(serializers.ModelSerializer):
    receiver = serializers.IntegerField()

    class Meta:
        model = FriendRequest
        fields = ['receiver']
        read_only_fields = ['id', 'sender', 'created_at']

    def create(self, validated_data):
        receiver_id = validated_data.pop('receiver')
        validated_data['sender'] = self.context['request'].user
        validated_data['receiver'] = CustomUser.objects.get(id=receiver_id)
        return super().create(validated_data)


class SkillAddSerializer(serializers.Serializer):
    skills = serializers.ListField(
        child=serializers.CharField(max_length=100),
        allow_empty=False
    )

    def validate_skills(self, value):
        return [v.strip() for v in value if v.strip()]


class FriendNotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendNotes
        fields = ['id', 'friend', 'notes', 'rate']
        read_only_fields = ['id']
