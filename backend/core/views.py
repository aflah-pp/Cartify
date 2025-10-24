from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from .models import SellerProfile
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# views.py
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upgrade_to_seller(request):
    user = request.user
    data = request.data
    shop_name = data.get("shop_name")
    tax_number = data.get("tax_number")

    if not shop_name or not tax_number:
        return Response({"detail": "Missing fields"}, status=400)

    # Set is_seller and create SellerProfile
    user.is_seller = True
    user.save()

    SellerProfile.objects.update_or_create(
        user=user,
        defaults={"shop_name": shop_name, "tax_number": tax_number},
    )

    return Response({"detail": "Upgraded to seller"}, status=200)
