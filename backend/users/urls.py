from django.urls import path
from django.urls.conf import include

from users.views import password_reset_confirm_redirect

urlpatterns = [
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path("auth/password/reset/confirm/<str:uidb64>/<str:token>/", password_reset_confirm_redirect,
         name="password_reset_confirm"),
]
