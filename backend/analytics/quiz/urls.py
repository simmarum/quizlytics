from django.conf.urls import url, include
from rest_framework import routers
from quiz.views import UserViewSet, CityViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'cities', CityViewSet)

urlpatterns = [
    url(r'', include(router.urls)),
]
