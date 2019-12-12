from quiz.permissions import get_permissions_login, get_permissions_admin
from quiz.serializers import UserSerializer, GroupSerializer, CitySerializer, QuestionSerializer
from rest_framework import viewsets
from quiz.models import City, User, Question
from django.contrib.auth.models import Group
from rest_framework.response import Response
from pprint import pprint
from rest_framework import viewsets, mixins


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        tmp_user = self.request.user
        queryset = User.objects.all()
        if tmp_user.is_superuser:
            return queryset.order_by('id')
        if tmp_user.id is not None:
            return queryset.filter(id=tmp_user.id).order_by('id')
        else:
            return queryset.filter(id=-1).order_by('id')

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

    def get_queryset(self):
        return City.objects.all().order_by('id')

    def get_permissions(self):
        return get_permissions_admin(cls=self)


class QuestionViewSet(mixins.CreateModelMixin,
                      mixins.RetrieveModelMixin,
                      mixins.DestroyModelMixin,
                      mixins.ListModelMixin,
                      viewsets.GenericViewSet):
    """
    API endpoint that allows questions to be viewed or deleted.
    """
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    def get_queryset(self):
        return Question.objects.all().order_by('title')
