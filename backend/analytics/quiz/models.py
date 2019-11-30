from django.db import models
from django.contrib.auth.models import User


class City(models.Model):
    name = models.TextField(max_length=30, unique=True)

    def __str__(self):
        return self.name


class CityUser(models.Model):
    user_id = models.OneToOneField(User, on_delete=models.CASCADE)
    city_id = models.ForeignKey(City, on_delete=models.CASCADE)
