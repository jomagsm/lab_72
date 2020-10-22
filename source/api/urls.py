from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api.views import QuoteViewSet

router = DefaultRouter()
router.register('quote', QuoteViewSet)

app_name = 'api'

urlpatterns = [
    path('', include(router.urls))

]