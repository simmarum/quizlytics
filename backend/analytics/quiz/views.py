from quiz.permissions import (get_permissions_login, get_permissions_admin,
                              get_permissions_owner, get_permissions_create_no_login)
from quiz.serializers import (UserSerializer, GroupSerializer, CitySerializer,
                              QuestionSerializer, QuestionAnswerSerializer,
                              MailSendSerializer)
from rest_framework import viewsets
from quiz.models import City, User, Question, QuestionAnswer, MailSend
from django.contrib.auth.models import Group
from rest_framework import viewsets, mixins
from django_filters import rest_framework as filters
from rest_framework import filters as rffilters
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
    filter_backends = (filters.DjangoFilterBackend, rffilters.SearchFilter)
    filter_fields = ('user_id', 'uid')
    search_fields = ('title',)

    def get_queryset(self):
        return Question.objects.all().filter(active=1).order_by('-id')

    def get_permissions(self):
        return get_permissions_owner(cls=self)

    def destroy(self, request, *args, **kwargs):
        inst = self.get_object()
        instances = Question.objects.filter(uid=inst.uid).update(active=0)
        return Response(data='OK')


class QuestionAnswerViewSet(mixins.ListModelMixin,
                            viewsets.GenericViewSet):
    """
    API endpoint that allows questions to be viewed or deleted.
    """
    queryset = QuestionAnswer.objects.all()
    serializer_class = QuestionAnswerSerializer

    def get_queryset(self):
        q_id = self.request.GET.get('id')

        q_uid = self.request.GET.get('uid')
        q_ids = [v['id'] for v
                 in Question.objects.filter(uid=q_uid).filter(active=1)
                 .values('id').distinct()]

        if q_id is not None:
            try:
                q_id = int(q_id)
                q_ids = [q_id] if q_id in q_ids else []
            except ValueError:
                pass

        tmp_q = Question.objects.filter(uid=q_uid).filter(active=1).first()
        q_id = tmp_q.id if tmp_q is not None else None
        return QuestionAnswer.objects.all()\
            .filter(question_id__in=q_ids)\
            .order_by('-question_id', 'answer_number')

    def get_permissions(self):
        return get_permissions_owner(cls=self)


class MailSendViewSet(mixins.CreateModelMixin,
                      viewsets.GenericViewSet):
    """
    API endpoint that allows MailSend to be created.
    """
    queryset = MailSend.objects.all()
    serializer_class = MailSendSerializer

    def get_permissions(self):
        return get_permissions_create_no_login(cls=self)
