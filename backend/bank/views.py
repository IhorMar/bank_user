import requests
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Bank
from .models import CustomUser
from .serializers import CustomUserSerializer, BankSerializer


class CustomUserList(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer


class BankViewSet(viewsets.ModelViewSet):
    queryset = Bank.objects.all()
    serializer_class = BankSerializer


# Create users data using random data from external API
class UserRandomCreateView(ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def perform_create(self, serializer):
        response = requests.get("https://random-data-api.com/api/v2/users")
        user_data = response.json()
        valid_fields = ["username", "email", "first_name", "last_name"]
        filtered_data = {field: user_data.get(field) for field in valid_fields}
        serializer = self.get_serializer(data=filtered_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()


class UserDeleteBankView(APIView):
    def patch(self, request, user_id, bank_id):
        user = get_object_or_404(CustomUser, id=user_id)
        bank_id = request.data.get("bankId")
        user.banks.remove(bank_id)
        user.save()

        serializer = CustomUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserAddExistingBankView(APIView):
    def patch(self, request, user_id, bank_id):
        user = get_object_or_404(CustomUser, id=user_id)
        bank = get_object_or_404(Bank, id=bank_id)
        if bank not in user.banks.all():
            user.banks.add(bank)
            user.save()

            serializer = CustomUserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Bank is already associated with the user."},
                status=status.HTTP_400_BAD_REQUEST,
            )


# Create banks data using random data from external API
class BankRandomCreateView(ListCreateAPIView):
    queryset = Bank.objects.all()
    serializer_class = BankSerializer

    def perform_create(self, serializer):
        response = requests.get("https://random-data-api.com/api/v2/banks")
        bank_data = response.json()
        valid_fields = ["bank_name", "routing_number", "swift_bic"]
        filtered_data = {field: bank_data.get(field) for field in valid_fields}
        serializer = self.get_serializer(data=filtered_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()


# Bank Views
class BankDeleteUserView(APIView):
    def patch(self, request, user_id, bank_id):
        user = get_object_or_404(CustomUser, id=user_id)
        bank_id = request.data.get("bankId")
        user.banks.remove(bank_id)
        user.save()

        serializer = CustomUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BankAddExistingUserView(APIView):
    def patch(self, request, user_id, bank_id):
        user = get_object_or_404(CustomUser, id=user_id)
        bank = get_object_or_404(Bank, id=bank_id)
        if user not in bank.users.all():
            bank.users.add(user)
            bank.save()

            serializer = BankSerializer(bank)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Bank is already associated with the user."},
                status=status.HTTP_400_BAD_REQUEST,
            )
