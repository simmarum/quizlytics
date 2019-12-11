from rest_framework.test import APIClient, force_authenticate
from django.test import TestCase
from django.urls import reverse
from quiz.models import User


class TestUsersApi(TestCase):

    def setUp(self):
        self.client = APIClient()
        User.objects.create_superuser(
            email='1@1.pl',
            first_name='1',
            last_name='1',
            username='1_1',
            password='1')
        User.objects.create(
            email='2@2.pl',
            first_name='2',
            last_name='2',
            username='2_2',
            password='2')

    def test_users_list_all_admin(self):
        user = User.objects.all().filter(id=1).first()
        self.client.force_authenticate(user)
        # get API response
        response = self.client.get(reverse('users-list'))
        res_data = response.json()
        # assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_data['count'], 2)

    def test_users_list_normal_user(self):
        user = User.objects.all().filter(id=2).first()
        self.client.force_authenticate(user)
        # get API response
        response = self.client.get(reverse('users-list'))
        res_data = response.json()
        # assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_data['count'], 1)

    def test_users_list_no_user(self):
        # get API response
        response = self.client.get(reverse('users-list'))
        res_data = response.json()
        # assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_data['count'], 0)
