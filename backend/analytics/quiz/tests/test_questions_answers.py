from rest_framework.test import APIClient, force_authenticate
from django.test import TestCase
from django.urls import reverse
from quiz.models import User, City, UserProfile, Question, QuestionAnswer
import json
from django.db.utils import IntegrityError
from django.db import transaction


class TestQuestionsAnswersApi(TestCase):

    def setUp(self):
        self.client = APIClient()
        UserProfile.objects.create(
            user_id=1,
            city_id=1
        )
        UserProfile.objects.create(
            user_id=2,
            city_id=1
        )
        User.objects.create_superuser(
            email='1@1.pl',
            first_name='1',
            last_name='1',
            username='1_1',
            password='1',
            profile=UserProfile.objects.all().filter(user_id=1).first())
        User.objects.create(
            email='2@2.pl',
            first_name='2',
            last_name='2',
            username='2_2',
            password='2',
            profile=UserProfile.objects.all().filter(user_id=2).first())
        City.objects.create(
            name='Other'
        )
        City.objects.create(
            name='New'
        )
        Question.objects.create(
            uid=1,
            title='1',
            user=User.objects.all().filter(id=1).first(),
            version=1,
            active=1,
        )
        QuestionAnswer.objects.create(
            question=Question.objects.all().filter(id=1).first(),
            answer_number=1,
            answer_text='1'
        )
        QuestionAnswer.objects.create(
            question=Question.objects.all().filter(id=1).first(),
            answer_number=2,
            answer_text='2'
        )
        Question.objects.create(
            uid=1,
            title='1',
            user=User.objects.all().filter(id=1).first(),
            version=2,
            active=1,
        )
        QuestionAnswer.objects.create(
            question=Question.objects.all().filter(id=2).first(),
            answer_number=1,
            answer_text='1'
        )

    def test_question_answers_list_uid(self):
        user = User.objects.all().filter(id=1).first()
        self.client.force_authenticate(user)

        response = self.client.get(
            reverse('questions_answers-list')+'?uid=1')
        res_data = response.json()

        res_assert = [
            {'answer_number': 1, 'answer_text': '1', 'question_id': 2},
            {'answer_number': 1, 'answer_text': '1', 'question_id': 1},
            {'answer_number': 2, 'answer_text': '2', 'question_id': 1}
        ]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_data['results'], res_assert)
