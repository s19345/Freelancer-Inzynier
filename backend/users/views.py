from django.http.response import HttpResponseRedirect
from django.conf import settings
from django.db import IntegrityError
from rest_framework import status, generics
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
import pytz
from project.pagination import CustomPageNumberPagination
from .models import CustomUser, FriendRequest, Skill, FriendNotes
from .serializers import FriendListSerializer, GetSentFriendRequestSerializer, \
    FriendRequestSendSerializer, FriendRequestAcceptSerializer, GetReceivedFriendRequestSerializer, \
    FriendDetailSerializer, SkillAddSerializer, SkillSerializer, FriendNotesSerializer, FriendSearchSerializer


class UserSearchListAPIView(ListAPIView):
    """ApiView to list all users except the authenticated user."""
    queryset = CustomUser.objects.all()
    serializer_class = FriendSearchSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        user = self.request.user
        return CustomUser.objects.exclude(
            Q(id=user.id) | Q(id__in=user.friends.all())
        )

    def filter_queryset(self, queryset):
        params = self.request.query_params

        username = params.get("username")
        first_name = params.get("first_name")
        last_name = params.get("last_name")
        specialization = params.get("specialization")
        location = params.get("location")
        skills = params.get("skills")

        if username:
            queryset = queryset.filter(username__icontains=username)
        if first_name:
            queryset = queryset.filter(first_name__icontains=first_name)
        if last_name:
            queryset = queryset.filter(last_name__icontains=last_name)
        if specialization:
            queryset = queryset.filter(specialization__icontains=specialization)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if skills:
            skill_list = [s.strip() for s in skills.split(",") if s.strip()]
            if skill_list:
                queryset = queryset.filter(skills__name__in=skill_list).distinct()

        return queryset


class FriendListAPIView(ListAPIView):
    """ApiView to list all friends of the authenticated user."""
    serializer_class = FriendSearchSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        return self.request.user.friends.all()

    def filter_queryset(self, queryset):
        return UserSearchListAPIView.filter_queryset(self, queryset)


class FriendDetailsAPIView(RetrieveAPIView):
    """ApiView to retrieve details of a specific friend."""
    serializer_class = FriendDetailSerializer
    lookup_field = 'id'

    def get_queryset(self):
        return self.request.user.friends.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class FriendRequestSenderAPIView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestSendSerializer
    queryset = FriendRequest.objects.all()
    pagination_class = CustomPageNumberPagination

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return FriendRequestSendSerializer
        return GetSentFriendRequestSerializer

    def get(self, request, *args, **kwargs):
        """Returns sent friend requests with pagination."""
        queryset = FriendRequest.objects.filter(sender=request.user)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = FriendRequestSendSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        receiver_id = serializer.validated_data['receiver']

        if str(request.user.id) == str(receiver_id):
            return Response({'error': 'Nie możesz wysłać zaproszenia do siebie samego.'},
                            status=status.HTTP_418_IM_A_TEAPOT)

        try:
            receiver = CustomUser.objects.get(id=receiver_id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Nie znaleziono odbiorcy zaproszenia.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.friends.filter(id=receiver_id).exists():
            return Response({'error': 'Ten użytkownik już jest Twoim znajomym.'}, status=status.HTTP_409_CONFLICT)

        if FriendRequest.objects.filter(sender=receiver, receiver=request.user).exists():
            return Response({'error': 'Ten użytkownik już wysłał Ci zaproszenie.'}, status=status.HTTP_409_CONFLICT)

        try:
            FriendRequest.objects.create(sender=request.user, receiver=receiver)
            return Response({'success': 'Zaproszenie wysłane.'}, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response({'error': 'Zaproszenie zostało już wcześniej wysłane.'}, status=status.HTTP_400_BAD_REQUEST)


class FriendRequestReceiverAPIView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    queryset = FriendRequest.objects.all()
    pagination_class = CustomPageNumberPagination

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return FriendRequestAcceptSerializer
        return GetReceivedFriendRequestSerializer

    def get(self, request, *args, **kwargs):
        """Returns received friend requests with pagination."""
        queryset = FriendRequest.objects.filter(receiver=request.user)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """Accepts a friend request."""
        serializer = FriendRequestAcceptSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        friend_request_id = serializer.validated_data['id']

        try:
            friend_request = FriendRequest.objects.get(id=friend_request_id, receiver=request.user)
        except FriendRequest.DoesNotExist:
            return Response({'error': 'Nie znaleziono zaproszenia.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.friends.filter(id=friend_request.sender.id).exists():
            return Response({'error': 'Ten użytkownik już jest Twoim znajomym.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friend = CustomUser.objects.get(id=friend_request.sender.id)
            request.user.friends.add(friend)
            friend_request.delete()
            return Response({'success': 'Zaakceptowano zaproszenie.'}, status=status.HTTP_200_OK)
        except IntegrityError:
            return Response({'error': 'Zaproszenie zostało już zaakceptowane.'}, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Nie znaleziono użytkownika który wysłał zaproszenie.'},
                            status=status.HTTP_404_NOT_FOUND)


class FriendRequestDeleteAPIView(APIView):

    def delete(self, request, *args, **kwargs):
        """Delete a friend request"""
        friend_request_id = kwargs.get('id')

        try:
            friend_request = FriendRequest.objects.get(id=friend_request_id)
            is_user_sender = request.user == friend_request.sender
            friend_request.delete()
            if is_user_sender:
                return Response({'success': 'Zaproszenie zostało anulowane.'}, status=status.HTTP_200_OK)
            else:
                return Response({'success': 'Zaproszenie zostało odrzucone.'}, status=status.HTTP_200_OK)
        except FriendRequest.DoesNotExist:
            return Response({'error': 'Nie znaleziono zaproszenia.'}, status=status.HTTP_404_NOT_FOUND)


class SkillViewSet(GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SkillSerializer
    pagination_class = None

    def get_serializer_class(self):
        if self.action == 'create':
            return SkillAddSerializer
        return SkillSerializer

    def list(self, request):
        skills = request.user.skills.all()
        serializer = self.get_serializer(skills, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        skills_to_add = serializer.validated_data['skills']

        added = []
        for name in skills_to_add:
            skill, _ = Skill.objects.get_or_create(name__iexact=name, defaults={'name': name})
            request.user.skills.add(skill)
            added.append(skill)

        return Response(SkillSerializer(added, many=True).data, status=status.HTTP_201_CREATED)

    def destroy(self, request, pk=None):
        try:
            skill = Skill.objects.get(pk=pk)
            request.user.skills.remove(skill)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Skill.DoesNotExist:
            return Response({'error': 'Skill not found.'}, status=status.HTTP_404_NOT_FOUND)


class TimezoneListView(APIView):
    permission_classes = [IsAuthenticated]  # każdy może pobrać

    def get(self, request):
        timezones = pytz.common_timezones
        return Response(timezones)


class FriendNotesUpdateCreateView(generics.GenericAPIView):
    serializer_class = FriendNotesSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, friend_id):
        """
        Utwórz lub zaktualizuj notatkę (friend_id w URL)
        """
        data = request.data.copy()
        data["friend"] = friend_id  # żeby nie musiał być podany w body

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        friend = serializer.validated_data['friend']

        note, created = FriendNotes.objects.get_or_create(
            owner=request.user,
            friend=friend,
            defaults={
                'notes': serializer.validated_data.get('notes', ''),
                'rate': serializer.validated_data.get('rate', ''),
            }
        )

        if not created:
            note.notes = serializer.validated_data.get('notes', note.notes)
            note.rate = serializer.validated_data.get('rate', note.rate)
            note.save()

        return Response(
            FriendNotesSerializer(note).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )


def password_reset_confirm_redirect(request, uidb64, token):
    return HttpResponseRedirect(
        f"{settings.PASSWORD_RESET_CONFIRM_REDIRECT_BASE_URL}{uidb64}/{token}/"
    )
