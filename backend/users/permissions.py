from rest_framework.permissions import BasePermission
from django.contrib.auth import get_user_model

User = get_user_model()


class IsFriend(BasePermission):
    """
    Permits access only if the `pk` in the URL points to a user who is a friend of request.user.
    """

    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):
        print("*-" * 50)
        print(f"Checking if {request.user} is a friend of {obj}")
        print(f"view = {view}")
        print("*-" * 50)
        return obj.friend_of.filter(user=request.user).exists()
