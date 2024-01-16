from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Bank, CustomUser


class BankAdmin(admin.ModelAdmin):
    list_display = ["bank_name", "routing_number", "swift_bic", "id"]


class CustomUserAdmin(UserAdmin):
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "email", "banks")}),
    )

    list_display = ("username", "first_name", "last_name", "email", "id")
    list_filter = ()
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "password1", "password2"),
            },
        ),
    )


admin.site.register(Bank, BankAdmin)
admin.site.register(CustomUser, CustomUserAdmin)
