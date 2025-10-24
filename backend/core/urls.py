from django.urls import path
from .views import RegisterView, UserDetailView, upgrade_to_seller

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('user_details/', UserDetailView.as_view(), name='user-detail'),
    path("upgrade_to_seller/", upgrade_to_seller),
]
