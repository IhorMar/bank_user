from django.contrib.auth.models import AbstractUser
from django.db import models



class Bank(models.Model):
    bank_name = models.CharField(max_length=100)
    routing_number = models.CharField(max_length=20)
    swift_bic = models.CharField(max_length=20)
    users = models.ManyToManyField(
        "CustomUser", related_name="bank_users", blank=True
    )

    def __str__(self):
        return self.bank_name


class CustomUser(AbstractUser):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    banks = models.ManyToManyField(Bank, related_name="user_banks", blank=True)
    groups = models.ManyToManyField("auth.Group", related_name="customuser_groups")
    user_permissions = models.ManyToManyField(
        "auth.Permission", related_name="customuser_user_permissions"
    )

    def __str__(self):
        return self.username
