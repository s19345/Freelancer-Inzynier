from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import pytz


class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class CustomUser(AbstractUser):
    TIMEZONE_CHOICES = [(tz, tz) for tz in pytz.common_timezones]
    bio = models.TextField(blank=True)
    profile_picture = models.URLField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    skills = models.ManyToManyField(Skill, related_name='users', blank=True)
    specialization = models.CharField(max_length=100, blank=True, null=True)
    timezone = models.CharField(
        max_length=50,
        choices=TIMEZONE_CHOICES,
        default=timezone.get_current_timezone_name,
        blank=True,
        null=True
    )
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


class FriendNotes(models.Model):
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='friend_notes')
    friend = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='noted_by')

    notes = models.TextField(blank=True)
    rate = models.CharField(max_length=20, blank=True)

    class Meta:
        unique_together = ('owner', 'friend')

    def __str__(self):
        return f"{self.owner.username}'s note about {self.friend.username}"
