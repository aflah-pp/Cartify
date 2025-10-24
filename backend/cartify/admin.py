from django.contrib import admin
from .models import Product, Cart, CartItem, Transaction, OrderItem

admin.site.register([Product, Cart, CartItem, Transaction, OrderItem])
