from django.contrib.auth.models import User, Group
from quiz.models import City, CityUser
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class CitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name']


class CityUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CityUser
        fields = ['id', 'user_id', 'city_id']
