from django.contrib.auth.models import User, Group
from quiz.models import City
from rest_framework import viewsets
from quiz.serializers import UserSerializer, GroupSerializer, CitySerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


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
