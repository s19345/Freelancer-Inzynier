from django.http.response import HttpResponseRedirect
from django.conf import settings
from django.db import IntegrityError
from rest_framework import status, generics
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from project.pagination import CustomPageNumberPagination
from .models import CustomUser, FriendRequest
from .serializers import CustomUserSerializer, FriendListSerializer, GetSentFriendRequestSerializer, \
    FriendRequestSendSerializer, FriendRequestAcceptSerializer, GetReceivedFriendRequestSerializer
from rest_framework.pagination import PageNumberPagination


class UserSearchListAPIView(ListAPIView):
    """ApiView to list all users except the authenticated user."""
    queryset = CustomUser.objects.all()
    serializer_class = FriendListSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        return CustomUser.objects.exclude(id=self.request.user.id)


class FriendListAPIView(ListAPIView):
    """ApiView to list all friends of the authenticated user."""
    serializer_class = FriendListSerializer

    def get_queryset(self):
        return self.request.user.friends.all()


class FriendDetailsAPIView(RetrieveAPIView):
    serializer_class = CustomUserSerializer

    lookup_field = 'id'

    def get_queryset(self):
        return self.request.user.friends.all()


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


def password_reset_confirm_redirect(request, uidb64, token):
    return HttpResponseRedirect(
        f"{settings.PASSWORD_RESET_CONFIRM_REDIRECT_BASE_URL}{uidb64}/{token}/"
    )
