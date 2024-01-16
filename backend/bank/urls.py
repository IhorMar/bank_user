from django.urls import path
from rest_framework import routers

from . import views
from .views import (
    UserAddExistingBankView,
    UserDeleteBankView,
    UserRandomCreateView,
    BankRandomCreateView,
    BankAddExistingUserView,
    BankDeleteUserView,
)

router = routers.DefaultRouter()
router.register("banks", views.BankViewSet, basename="banks")
router.register("users", views.CustomUserList, basename="users")
urlpatterns = [
    path(
        "users/<int:user_id>/delete-user-bank/<int:bank_id>/",
        UserDeleteBankView.as_view(),
        name="delete-bank",
    ),
    path(
        "users/<int:user_id>/add-existing-bank/<int:bank_id>/",
        UserAddExistingBankView.as_view(),
        name="add-existing-bank",
    ),
    path(
        "users/random-create/", UserRandomCreateView.as_view(), name="user-list-create"
    ),
    path(
        "banks/random-create/", BankRandomCreateView.as_view(), name="bank-list-create"
    ),
    path(
        "banks/<int:bank_id>/add-existing-user/<int:user_id>/",
        BankAddExistingUserView.as_view(),
        name="add-existing-user",
    ),
    path(
        "banks/<int:bank_id>/delete-user-in-bank/<int:user_id>/",
        BankDeleteUserView.as_view(),
        name="delete-bank",
    ),
]
urlpatterns += router.urls
