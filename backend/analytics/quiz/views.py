from quiz.permissions import get_permissions_login, get_permissions_admin
from quiz.serializers import UserSerializer, GroupSerializer, CitySerializer
from rest_framework import viewsets
from quiz.models import City, User
from django.contrib.auth.models import Group
from rest_framework.response import Response


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        tmp_user = self.request.user
        queryset = User.objects.all()
        if tmp_user.is_superuser == 0:
            queryset = queryset.filter(id=tmp_user.id)

        return queryset

    def get_permissions(self):
        return get_permissions_login(cls=self)


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class CityViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows city to be viewed or edited.
    """
    queryset = City.objects.all()
    serializer_class = CitySerializer

    def get_permissions(self):
        return get_permissions_admin(cls=self)
