from rest_framework import serializers
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from cartify.serializers import NewCartItemSerializer
from cartify.models import Cart

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'city', 'state', 'address', 'phone', 'password','is_seller'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
    def get_items(self,user):
        cart_items = Cart.objects.filter(cart_user = user,cart_paid = True)
        serializer = NewCartItemSerializer(cart_items,many=True)
        return Response(serializer.data)