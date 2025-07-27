from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from django.conf import settings


class CustomPageNumberPagination(PageNumberPagination):
    page_size = settings.REST_FRAMEWORK.get('PAGE_SIZE', 10)
    page_size_query_param = 'page_size'

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'page_size': self.get_page_size(self.request),
            'current_page': self.page.number,
            'total_pages': self.page.paginator.num_pages,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })
