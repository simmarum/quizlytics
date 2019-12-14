from rest_framework.test import APIClient, force_authenticate
from django.test import TestCase
from django.urls import reverse
from quiz.models import User, City, UserProfile
import json
from django.db.utils import IntegrityError
from django.db import transaction


class TestUsersApi(TestCase):

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

    def test_users_list_all_admin(self):
        user = User.objects.all().filter(id=1).first()
        self.client.force_authenticate(user)

        response = self.client.get(reverse('users-list'))
        res_data = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_data['count'], 2)

    def test_users_list_normal_user(self):
        user = User.objects.all().filter(id=2).first()
        self.client.force_authenticate(user)

        response = self.client.get(reverse('users-list'))
        res_data = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_data['count'], 1)

    def test_users_list_no_user(self):
        response = self.client.get(reverse('users-list'))
        res_data = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_data['count'], 0)

    def test_get_valid_single_user(self):
        user = User.objects.all().filter(id=2).first()
        self.client.force_authenticate(user)

        response = self.client.get(reverse('users-detail', kwargs={'pk': 2}))
        res_data = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_data['email'], '2@2.pl')

    def test_get_invalid_single_user(self):
        user = User.objects.all().filter(id=2).first()
        self.client.force_authenticate(user)

        response = self.client.get(reverse('users-detail', kwargs={'pk': -1}))
        res_data = response.json()

        self.assertEqual(response.status_code, 404)

    def test_get_valid_single_user_no_login(self):

        response = self.client.get(reverse('users-detail', kwargs={'pk': 1}))
        res_data = response.json()

        self.assertEqual(response.status_code, 404)

    def test_create_valid_user(self):
        valid_payload = {
            'email': '3@3.pl',
            'first_name': '3',
            'last_name': '3',
            'username': '3_3',
            'password': '!QAZXSW@',
            'profile': {
                'city_id': 1
            }
        }
        response = self.client.post(reverse('users-list'),
                                    data=json.dumps(valid_payload),
                                    content_type='application/json'
                                    )
        self.assertEqual(response.status_code, 201)

    def test_create_invalid_user_password_too_short(self):
        invalid_payload = {
            'email': '3@3.pl',
            'first_name': '3',
            'last_name': '3',
            'username': '3_3',
            'password': '@Sd',
            'profile': {
                'city_id': 1
            }
        }
        response = self.client.post(reverse('users-list'),
                                    data=json.dumps(invalid_payload),
                                    content_type='application/json'
                                    )
        res_data = response.json()

        self.assertIn('This password is too short', res_data['password'][0])
        self.assertEqual(response.status_code, 400)

    def test_create_invalid_user_password_too_short(self):
        invalid_payload = {
            'email': '3@3.pl',
            'first_name': '3',
            'last_name': '3',
            'username': '3_3',
            'password': '@Sd',
            'profile': {
                'city_id': 1
            }
        }
        response = self.client.post(reverse('users-list'),
                                    data=json.dumps(invalid_payload),
                                    content_type='application/json'
                                    )
        res_data = response.json()

        self.assertIn('This password is too short', res_data['password'][0])
        self.assertEqual(response.status_code, 400)

    def test_create_invalid_user_password_is_numeric(self):
        invalid_payload = {
            'email': '3@3.pl',
            'first_name': '3',
            'last_name': '3',
            'username': '3_3',
            'password': '1029384',
            'profile': {
                'city_id': 1
            }
        }
        response = self.client.post(reverse('users-list'),
                                    data=json.dumps(invalid_payload),
                                    content_type='application/json'
                                    )
        res_data = response.json()

        self.assertIn('This password is entirely numeric.', res_data['password'][0])
        self.assertEqual(response.status_code, 400)

    def test_create_invalid_user_password_too_common(self):
        invalid_payload = {
            'email': '3@3.pl',
            'first_name': '3',
            'last_name': '3',
            'username': '3_3',
            'password': 'qwerty',
            'profile': {
                'city_id': 1
            }
        }
        response = self.client.post(reverse('users-list'),
                                    data=json.dumps(invalid_payload),
                                    content_type='application/json'
                                    )
        res_data = response.json()

        self.assertIn('This password is too common', res_data['password'][0])
        self.assertEqual(response.status_code, 400)

    def test_create_invalid_user_other_params(self):
        invalid_payload = {
            'email': '3',
            'first_name': '',
            'last_name': '',
            'username': '',
            'password': 'ASD#rfw#2FSA',
            'profile': ''
        }
        response = self.client.post(reverse('users-list'),
                                    data=json.dumps(invalid_payload),
                                    content_type='application/json'
                                    )
        res_data = response.json()

        assert_response = {
            'email': ['Enter a valid email address.'],
            'first_name': ['This field may not be blank.'],
            'last_name': ['This field may not be blank.'],
            'profile': {
                'non_field_errors': ['Invalid data. Expected a dictionary, but got str.']
            }
        }
        self.assertEqual(assert_response, res_data)
        self.assertEqual(response.status_code, 400)

    def test_update_valid_user(self):
        user = User.objects.all().filter(id=2).first()
        self.client.force_authenticate(user)

        valid_payload = {
            'first_name': 'new',
            'last_name': 'new',
            'profile': {
                'city_id': 2
            }
        }
        response = self.client.patch(reverse('users-detail', kwargs={'pk': 2}),
                                     data=json.dumps(valid_payload),
                                     content_type='application/json'
                                     )
        res_data = response.json()

        assert_response = {
            'email': '2@2.pl',
            'id': 2,
            'first_name': 'new',
            'last_name': 'new',
            'profile': {'city_id': '2'},
            'url': 'http://testserver/api/users/2/'
        }
        self.assertEqual(assert_response, res_data)
        self.assertEqual(response.status_code, 200)
