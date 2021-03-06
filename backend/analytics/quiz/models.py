from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _
from django.conf import settings


class City(models.Model):
    name = models.TextField(max_length=30, unique=True)

    def __str__(self):
        return self.name


class User(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    username = models.CharField(max_length=120, null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'username']

    def __str__(self):
        return '{}'.format(self.email)


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE, related_name='profile')
    city = models.ForeignKey(City, on_delete=models.PROTECT)


class Question(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    uid = models.IntegerField()
    version = models.IntegerField()
    title = models.CharField(max_length=100)
    active = models.IntegerField()

    class Meta:
        unique_together = (('uid', 'version'),)

    def __str__(self):
        tmp_s = f'id={self.id}, '
        tmp_s += f'uid={self.uid}, '
        tmp_s += f'version={self.version}, '
        tmp_s += f'title={self.title}'
        return tmp_s


class QuestionAnswer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.PROTECT)
    answer_number = models.IntegerField()
    answer_text = models.CharField(max_length=500)


class MailSend(models.Model):
    subject = models.CharField(max_length=100)
    message = models.CharField(max_length=500)
    to_email = models.EmailField(max_length=100)
