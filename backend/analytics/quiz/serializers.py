from django.contrib.auth.models import Group
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from quiz.models import City, UserProfile, User
from rest_framework import serializers
from pprint import pprint


class UserProfileSerializer(serializers.ModelSerializer):
    city_id = serializers.CharField(source='city.id', read_only=True)

    class Meta:
        model = UserProfile
        fields = ('city_id',)


class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = UserProfileSerializer(required=True)

    class Meta:
        model = User
        fields = ('url', 'email', 'first_name', 'last_name', 'password', 'profile')
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as exc:
            raise serializers.ValidationError(str(exc))
        return value

    def create(self, validated_data):
        profile_data = self.initial_data['profile']
        validated_data.pop('profile')

        password = validated_data.pop('password')

        validated_data['username'] = "{}_{}".format(
            validated_data['first_name'],
            validated_data['last_name']
        )

        user = User(**validated_data)
        validate_password(password, user)
        user.set_password(password)
        user.save()

        UserProfile.objects.create(user=user, **profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = self.initial_data['profile']
        profile = instance.profile

        profile.city_id = profile_data.get('city_id', profile.city_id)
        profile.save()
        instance.profile = profile

        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.first_name = validated_data.get('first_name', instance.first_name)

        instance.save()

        return instance


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class CitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name']
