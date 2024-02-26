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

    list_display = ("username", "first_name", "last_name", "email", "id", "display_related_field")
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
    def display_related_field(self, obj):
        # Define your logic to retrieve information from many-to-many field or reverse foreign key
        # Example: Concatenate names of related objects
        return ' ; '.join("BANK: " + str(bank) for bank in obj.banks.all())

admin.site.register(Bank, BankAdmin)
admin.site.register(CustomUser, CustomUserAdmin)
