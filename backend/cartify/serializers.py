from rest_framework import serializers
from .models import Product, Cart, CartItem


# ------------------ PRODUCT SERIALIZERS ------------------ #


class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "name", "slug", "image", "description", "price", "category"]

    def get_image(self, obj):
        """Return full image URL instead of just /media/..."""
        request = self.context.get("request")
        if obj.image and hasattr(obj.image, "url"):
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class DetailProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    similar_product = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "image",
            "description",
            "price",
            "similar_product",
        ]

    def get_image(self, obj):
        """Return full image URL for detailed product"""
        request = self.context.get("request")
        if obj.image and hasattr(obj.image, "url"):
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_similar_product(self, obj):
        products = Product.objects.filter(category=obj.category).exclude(id=obj.id)
        serializer = ProductSerializer(products, many=True, context=self.context)
        return serializer.data


# ------------------ CART SERIALIZERS ------------------ #


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ["id", "quantity", "product", "total"]

    def get_total(self, cartitem):
        return cartitem.product.price * cartitem.quantity


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(read_only=True, many=True)
    sum_total = serializers.SerializerMethodField()
    num_of_items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = [
            "id",
            "cart_code",
            "items",
            "sum_total",
            "num_of_items",
            "created_at",
            "modified_at",
        ]

    def get_sum_total(self, cart):
        items = cart.items.all()
        return sum(item.product.price * item.quantity for item in items)

    def get_num_of_items(self, cart):
        return sum(item.quantity for item in cart.items.all())


class SimpleCartSerializer(serializers.ModelSerializer):
    num_of_items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "cart_code", "num_of_items"]

    def get_num_of_items(self, cart):
        return sum(item.quantity for item in cart.items.all())


# ------------------ ORDER SERIALIZERS ------------------ #


class NewCartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    order_id = serializers.SerializerMethodField()
    order_date = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ["id", "product", "quantity", "order_id", "order_date"]

    def get_order_id(self, cartitem):
        return cartitem.cart.cart_code

    def get_order_date(self, cartitem):
        return cartitem.cart.modified_at


class PaidOrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    order_id = serializers.CharField(source="cart.cart_code", read_only=True)
    transaction_id = serializers.SerializerMethodField()
    order_date = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product_name",
            "quantity",
            "order_id",
            "transaction_id",
            "order_date",
            "status",
        ]

    def get_transaction_id(self, obj):
        transaction = obj.cart.transactions.first()
        return transaction.ref if transaction else None

    def get_order_date(self, obj):
        return obj.cart.modified_at.strftime("%Y-%m-%d %H:%M")

    def get_status(self, obj):
        transaction = obj.cart.transactions.first()
        return transaction.status if transaction else "unknown"
