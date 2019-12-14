from rest_framework.test import APIClient, force_authenticate
from django.test import TestCase
from django.urls import reverse
from quiz.models import User, City, UserProfile, Question
import json
from django.db.utils import IntegrityError
from django.db import transaction


class TestQuestionsApi(TestCase):

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
        Question.objects.create(
            uid=1,
            title='1',
            user=User.objects.all().filter(id=1).first(),
            version=2,
            active=1,
        )
        Question.objects.create(
            uid=2,
            title='1',
            user=User.objects.all().filter(id=1).first(),
            version=1,
            active=0,
        )
        Question.objects.create(
            uid=3,
            title='1',
            user=User.objects.all().filter(id=2).first(),
            version=1,
            active=1,
        )

    def test_question_list_all(self):
        user = User.objects.all().filter(id=1).first()
        self.client.force_authenticate(user)

        response = self.client.get(reverse('questions-list'))
        res_data = response.json()

        res_assert = [
            {'id': 4, 'uid': 3, 'title': '1', 'user_id': 2, 'version': 1},
            {'id': 2, 'uid': 1, 'title': '1', 'user_id': 1, 'version': 2},
            {'id': 1, 'uid': 1, 'title': '1', 'user_id': 1, 'version': 1},
        ]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_data['results'], res_assert)

    def test_question_list_user_questions(self):
        user = User.objects.all().filter(id=1).first()
        self.client.force_authenticate(user)

        response = self.client.get(
            reverse('questions-list')+'?user_id=1')
        res_data = response.json()

        res_assert = [
            {'id': 2, 'uid': 1, 'title': '1', 'user_id': 1, 'version': 2},
            {'id': 1, 'uid': 1, 'title': '1', 'user_id': 1, 'version': 1},
        ]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_data['results'], res_assert)

    def test_question_list_user_questions(self):
        user = User.objects.all().filter(id=1).first()
        self.client.force_authenticate(user)

        response = self.client.get(
            reverse('questions-list')+'?uid=3')
        res_data = response.json()

        res_assert = [
            {'id': 4, 'uid': 3, 'title': '1', 'user_id': 2, 'version': 1},
        ]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_data['results'], res_assert)

    def test_question_create_valid(self):
        user = User.objects.all().filter(id=1).first()
        self.client.force_authenticate(user)
        valid_payload = {
            'title': '1',
            'answers': [
                {'answer_number': 1, 'answer_text': '1'},
                {'answer_number': 2, 'answer_text': '2'},
            ]
        }
        response = self.client.post(reverse('questions-list'),
                                    data=json.dumps(valid_payload),
                                    content_type='application/json'
                                    )
        res_assert = {
            'id': 5,
            'uid': 4,
            'title': '1',
            'user_id': 1,
            'version': 1
        }
        self.assertEqual(response.data, res_assert)
        self.assertEqual(response.status_code, 201)

    def test_question_delete(self):
        user = User.objects.all().filter(id=1).first()
        self.client.force_authenticate(user)
        response = self.client.delete(
            reverse('questions-detail', kwargs={'pk': 1}))

        res_assert = {
            'id': 5,
            'uid': 4,
            'title': '1',
            'user_id': 1,
            'version': 1
        }
        self.assertEqual(response.data, "OK")
        tmp_q = Question.objects.get(id=1)
        self.assertEqual(tmp_q.active, 0)
        tmp_q = Question.objects.get(id=2)
        self.assertEqual(tmp_q.active, 0)
        self.assertEqual(response.status_code, 200)
