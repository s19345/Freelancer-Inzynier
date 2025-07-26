from rest_framework.pagination import PageNumberPagination

from django.conf import settings


class CustomPageNumberPagination(PageNumberPagination):
    page_size = settings.REST_FRAMEWORK.get('PAGE_SIZE', 10)
    page_size_query_param = 'page_size'