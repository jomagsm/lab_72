from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api.views import QuoteViewSet, AddRatingView, DeleteRatingView

router = DefaultRouter()
router.register('quote', QuoteViewSet, basename='quote')

app_name = 'api'

urlpatterns = [
    path('', include(router.urls)),
    path('rating/<int:pk>/+/', AddRatingView.as_view()),
    path('rating/<int:pk>/-/', DeleteRatingView.as_view())

]