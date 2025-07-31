from django.urls import path
from django.urls.conf import include
from .views import UserSearchListAPIView, FriendRequestSenderAPIView, FriendRequestReceiverAPIView, \
FriendRequestDeleteAPIView, FriendListAPIView, FriendDetailsAPIView, SkillViewSet, TimezoneListView
from rest_framework.routers import DefaultRouter
from users.views import password_reset_confirm_redirect

router = DefaultRouter()
router.register(r'skills', SkillViewSet, basename='skills')

urlpatterns = [
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path("/auth/password/reset/confirm/<str:uidb64>/<str:token>/", password_reset_confirm_redirect,
         name="password_reset_confirm"),
    path('', UserSearchListAPIView.as_view(), name='user-list'),
    path('friend-request-send/', FriendRequestSenderAPIView.as_view(), name='friend-request-send'),
    path('friend-request-receive/', FriendRequestReceiverAPIView.as_view(), name='friend-request-receive'),
    path('friend-request-delete/<int:id>/', FriendRequestDeleteAPIView.as_view(), name='friend-request-delete'),
    path('friends/', FriendListAPIView.as_view(), name='friend-list'),
    path('friends/<int:id>/', FriendDetailsAPIView.as_view(), name='friend-details'),
    path('timezones/', TimezoneListView.as_view(), name='timezone-list'),
    path('', include(router.urls)),
]
