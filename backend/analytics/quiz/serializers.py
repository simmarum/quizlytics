from django.contrib.auth.models import Group
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from quiz.models import City, UserProfile, User, QuestionAnswer, Question
from rest_framework import serializers
from pprint import pprint
from django.db.models import Max


class UserProfileSerializer(serializers.ModelSerializer):
    city_id = serializers.CharField(source='city.id', read_only=True)

    class Meta:
        model = UserProfile
        fields = ('city_id',)


class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = UserProfileSerializer(required=True)
    url = serializers.HyperlinkedIdentityField(view_name="users-detail")

    class Meta:
        model = User
        fields = ('url', 'id', 'email', 'first_name', 'last_name', 'password', 'profile')
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


class QuestionAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionAnswer
        fields = ('answer_number', 'answer_text', "question_id")


class QuestionSerializer(serializers.ModelSerializer):
    # answers = QuestionAnswerSerializer(required=True, many=True)
    uid = serializers.SerializerMethodField('get_uid')
    version = serializers.SerializerMethodField('get_version')

    def get_uid(self, obj):
        return obj.uid

    def get_version(self, obj):
        return obj.version

    class Meta:
        model = Question
        fields = ('id', 'uid', 'title', 'owner_id', 'version')

    def validate_answers(self, value):
        if len(value) < 1:
            raise serializers.ValidationError({
                'answers': 'This field is required.'
            })
        if not isinstance(value, list):
            raise serializers.ValidationError({
                'answers': 'This field should be list is /{}/'.format(type(value))
            })
        if len([1 for e in value if not isinstance(e, dict)]) > 0:
            raise serializers.ValidationError({
                'answers': 'List should contains /dict/ as elements'
            })

        return value

    def create(self, validated_data):
        m_uid = Question.objects.all().aggregate(Max('uid')).get('uid__max')
        m_version = Question.objects.all().aggregate(Max('version')).get('version__max')

        m_uid = 1 if m_uid is None else m_uid+1
        m_version = 1 if m_version is None else m_version+1

        answers = self.initial_data['answers']
        answers = self.validate_answers(answers)
        question = Question(uid=m_uid, version=m_version, owner=self.context['request'].user, ** validated_data)
        question.save()
        for one_answer in answers:
            q_answer = QuestionAnswer(question=question, **one_answer)
            try:
                q_answer.full_clean()
            except ValidationError as exc:
                raise serializers.ValidationError(exc.message_dict)
            q_answer.save()

        # profile_data = self.initial_data['profile']
        # validated_data.pop('profile')

        # password = validated_data.pop('password')

        # validated_data['username'] = "{}_{}".format(
        #     validated_data['first_name'],
        #     validated_data['last_name']
        # )

        # user = User(**validated_data)
        # validate_password(password, user)
        # user.set_password(password)
        # user.save()

        # UserProfile.objects.create(user=user, **profile_data)
        return question
