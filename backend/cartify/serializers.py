from rest_framework import serializers
from .models import Product ,Cart ,CartItem
from . import models

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id','name', 'slug','image', 'description', 'price', 'category']
    

class DetailProductSerializer(serializers.ModelSerializer):
    similar_product = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "name", "slug", "image", "description", "price", "similar_product"]

    def get_similar_product(self, obj):
        products = Product.objects.filter(category=obj.category).exclude(id=obj.id)
        serializer = ProductSerializer(products, many=True)
        return serializer.data
    

#REVIEW Product serializer - fetch product data from models and convert it from instance to json DetailProduct serializer - making a url for product detail page in frontend, extra  added is similar product with function get_similar_product which filters the product with its category.


#NOTE -  {HAPPENED DOING THIS CODE} - Put the line Product.objects.filter(category=obj.category).exclude(id=Product.id)' returned with error id is not number'
#REVIEW corrected with changing 'id=Product.id' into 'id=obj.id'
        

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only = True)
    total = serializers.SerializerMethodField()
    class Meta:
        model = CartItem
        fields = ["id", "quantity", "product", "total"]
        
    def get_total(self, CartItem):
        price = CartItem.product.price * CartItem.quantity
        return price


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(read_only=True, many=True)
    sum_total = serializers.SerializerMethodField()
    num_of_items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = [
            "id", "cart_code", "items", "sum_total",
            "num_of_items", "created_at", "modified_at"
        ]

    def get_sum_total(self, cart):
        items = cart.items.all()  # Access related items from the instance
        total = sum([item.product.price * item.quantity for item in items])
        return total

    def get_num_of_items(self, cart):
        items = cart.items.all()
        return sum(item.quantity for item in items)



class SimpleCartSerializer(serializers.ModelSerializer):
    num_of_items = serializers.SerializerMethodField()
    class Meta:
        model = Cart
        fields = ["id", "cart_code", "num_of_items"]
        
    def get_num_of_items(self, cart):
        num_of_items = sum([item.quantity for item in cart.items.all()])
        return num_of_items
    
class NewCartItemSerializer(serializers.ModelSerializer):
    product=ProductSerializer(read_only = True)
    order_id = serializers.SerializerMethodField()
    order_date = serializers.SerializerMethodField()
    class Meta:
        model = CartItem
        fields = ["id","product","quantity","order_id","order_date"]
        
    def get_order_id (self,cartitem):
        order_id = cartitem.cart.cart_code
        return order_id
        
        
    def get_order_date (self,cartitem):
        order_date = cartitem.cart.modified_at
        return order_date
    


class PaidOrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    order_id = serializers.CharField(source='cart.cart_code', read_only=True)
    transaction_id = serializers.SerializerMethodField()
    order_date = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product_name', 'quantity', 'order_id', 'transaction_id', 'order_date', 'status']

    def get_transaction_id(self, obj):
        transaction = obj.cart.transactions.first()
        return transaction.ref if transaction else None

    def get_order_date(self, obj):
        return obj.cart.modified_at.strftime("%Y-%m-%d %H:%M")

    def get_status(self, obj):
        transaction = obj.cart.transactions.first()
        return transaction.status if transaction else "unknown"



