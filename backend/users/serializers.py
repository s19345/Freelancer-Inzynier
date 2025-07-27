from rest_framework import serializers
from .models import CustomUser, FriendRequest, FriendNotes


class FriendNotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendNotes
        fields = ['notes', 'rate']


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'bio', 'profile_picture', 'phone_number',
                  'location', 'timezone']


class FriendListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'profile_picture', ]


class FriendDetailSerializer(serializers.ModelSerializer):
    friend_notes = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'bio', 'profile_picture', 'phone_number',
                  'location', 'timezone', 'friend_notes']

    def get_friend_notes(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None

        try:
            meta = FriendNotes.objects.get(owner=request.user, friend=obj)
            return FriendNotesSerializer(meta).data
        except FriendNotes.DoesNotExist:
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
