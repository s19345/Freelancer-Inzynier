from rest_framework import serializers
from .models import CustomUser, FriendRequest, FriendNotes, Skill


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']


class FriendListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'profile_picture', ]


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

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'bio', 'profile_picture', 'phone_number',
                  'location', 'timezone', 'friend_notes', 'skills']

    def get_friend_notes(self, obj):
        print("*-" * 50)
        print("Retrieving friend notes for:", obj.username)
        print("*-" * 50)
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            print("No authenticated user found in request context.")
            return None

        try:
            meta = FriendNotes.objects.get(owner=request.user, friend=obj)
            print("*-" * 50)
            print("meta:", meta)
            print("*-" * 50)
            return FriendNotesSerializer(meta).data
        except FriendNotes.DoesNotExist:
            print("*-" * 50)
            print("exceprtion")
            print("*-" * 50)
            return None


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
