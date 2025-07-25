from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    bio = models.TextField(blank=True)
    profile_picture = models.URLField(blank=True, null=True)
    friends = models.ManyToManyField(
        'self',
        symmetrical=True,
        blank=True,
        related_name='friend_of'
    )


class FriendRequest(models.Model):
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sent_requests')
    receiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='received_requests')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('sender', 'receiver')

    def __str__(self):
        return f"Request from {self.sender.username} to {self.receiver.username}"
