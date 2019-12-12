from rest_framework.test import APIClient, force_authenticate
from django.test import TestCase
from django.urls import reverse
from quiz.models import City
import json


class TestCitiesApi(TestCase):

    def setUp(self):
        self.client = APIClient()
        City.objects.create(
            name='Other'
        )
        City.objects.create(
            name='New'
        )

    def test_cities_list_all_admin(self):
        response = self.client.get(reverse('cities-list'))
        res_data = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_data['count'], 2)

    def test_get_valid_single_city(self):
        response = self.client.get(reverse('cities-detail', kwargs={'pk': 1}))
        res_data = response.json()

        self.assertEqual(response.status_code, 401)
