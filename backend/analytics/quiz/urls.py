from django.conf.urls import url, include
from django.urls import path
from rest_framework import routers
from quiz.views import UserViewSet, CityViewSet
from rest_framework.documentation import include_docs_urls

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'cities', CityViewSet)

urlpatterns = [
    url(r'', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    url(r'docs/', include_docs_urls(title='Analytics API docs'))

]
