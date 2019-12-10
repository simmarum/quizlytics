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

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    extra_kwargs = {
        'first_name': {'required': True},
        'last_name': {'required': True}
    }

    def __str__(self):
        return "{}".format(self.email)


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    city = models.ForeignKey(City, on_delete=models.PROTECT)
