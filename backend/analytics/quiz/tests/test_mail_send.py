from rest_framework.test import APIClient
from django.test import TestCase
from django.urls import reverse
from quiz.models import MailSend
import json
from django.db.utils import IntegrityError
from django.db import transaction


class TestMailSendApi(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_send_mail_create(self):
        valid_payload = {
            'subject': '1',
            'message': '1',
            'to_email': '1@1.pl'
        }
        response = self.client.post(reverse('mail_send-list'),
                                    data=json.dumps(valid_payload),
                                    content_type='application/json'
                                    )

        res_data = response.json()
        res_assert = {'subject': '1', 'message': '1', 'to_email': '1@1.pl'}
        tmp_ms = MailSend.objects.filter(id=1).first()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(res_data, res_assert)
        self.assertIsInstance(tmp_ms, MailSend)
