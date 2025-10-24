import math
from django.shortcuts import render
from rest_framework import status,generics, permissions
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated 
from django.conf import settings
from .models import OrderItem, Product, Cart, CartItem, Transaction
from .serializers import  ProductSerializer, DetailProductSerializer, CartItemSerializer, CartSerializer, SimpleCartSerializer
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
import uuid
from decimal import Decimal


@api_view(["GET"])
def products(requests):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many = True)
    return Response(serializer.data)


@api_view(["GET"])
def product_detail(request, slug):
    product = Product.objects.get(slug = slug)
    serializer = DetailProductSerializer(product)
    return Response(serializer.data) 


@api_view(["POST"])
def add_item(request):
    try:
        cart_code = request.data.get("cart_code")
        product_id = request.data.get("product_id")
        
        cart, created = Cart.objects.get_or_create(cart_code = cart_code)
        product = Product.objects.get(id = product_id)
        
        cartitem, created = CartItem.objects.get_or_create(cart=cart, product=product)
        cartitem.quantity = 1
        cartitem.save()
    
        serializer = CartItemSerializer(cartitem)
        return Response ({"data" : serializer.data, "message" : "Cart Item created"}, status= 201 )
    
    except Exception as e:
        return Response ({"error" : str(e)}, status=400)
    

@api_view(["GET"])
def product_in_cart(request):
    cart_code = request.query_params.get("cart_code")
    product_id = request.query_params.get("product_id")
    cart = Cart.objects.get(cart_code = cart_code)
    product = Product.objects.get(id=product_id)
    product_exist_in_cart = CartItem.objects.filter(cart = cart, product = product).exists()
    return Response ({"product_in_cart": product_exist_in_cart})

@api_view(["GET"])
def get_cart_stat(request):
    cart_code = request.GET.get("cart_code")

    if not cart_code:
        return Response({"error": "Cart code is required"}, status=400)

    cart, created = Cart.objects.get_or_create(
        cart_code=cart_code,
        defaults={"paid": False}
    )

    # ✅ Don't assign the cart to user here — only at payment

    # Prepare cart summary if it exists
    items = cart.items.all()
    total_items = sum(item.quantity for item in items)
    total_price = sum(item.product.price * item.quantity for item in items)

    return Response({
        "cart_code": cart.cart_code,
        "total_items": total_items,
        "total_price": float(total_price),
        "is_new": created,
    })


@api_view(["GET"])
def get_cart(request):
    cart_code = request.query_params.get("cart_code")
    
    try:
        cart = Cart.objects.get(cart_code=cart_code, paid=False)
    except Cart.DoesNotExist:
        return Response({"detail": "Cart not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = CartSerializer(cart)
    return Response(serializer.data)


@api_view(["PATCH"])
def update_quantity(request):
    try:
        cartitem_id = request.data.get("item_id")
        quantity = request.data.get("quantity")
        quantity = int(quantity)
        cartitem = CartItem.objects.get(id = cartitem_id)
        cartitem.quantity = quantity
        cartitem.save()
        serializer = CartItemSerializer(cartitem)
        return Response ({"data" : serializer.data, "message" : "CartItem Updated"})
    except Exception as e:
        return Response ({"error" : str(e)},status=400 )
    
    
@api_view(["DELETE"])
def delete_cartitem(request):
    cartitem_id = request.data.get("item_id")

    if not cartitem_id:
        return Response({"error": "Missing item_id"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        cartitem = CartItem.objects.get(id=cartitem_id)
        cartitem.delete()
        return Response({"message": "CartItem deleted"}, status=status.HTTP_204_NO_CONTENT)
    except CartItem.DoesNotExist:
        return Response({"error": "CartItem not found"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_username(request):
    user = request.user
    return Response({"username": user.username,"is_seller": user.is_seller})




#----- Payment Based Logics

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def initiate_payment(request):
    cart_code = request.data.get("cart_code")

    try:
        # Get unpaid cart owned by user
        cart = Cart.objects.get(cart_code=cart_code,  paid=False)
    except Cart.DoesNotExist:
        return Response({"error": "Invalid or already paid cart"}, status=404)

    total_amount = sum(item.product.price * item.quantity for item in cart.items.all())
    total_amount = Decimal(total_amount)

    tax = total_amount * Decimal("0.03")
    total_amount = Decimal(math.ceil(total_amount + tax))

    
    # Create transaction
    tx_ref = str(uuid.uuid4())
    order_id = f"order_{tx_ref[:8]}"

    Transaction.objects.create(
        ref=tx_ref,
        cart=cart,
        amount=total_amount,
        status="pending"
    )

    # Return a custom payment link (to a frontend route)
    payment_link = f"http://localhost:5173/payment?order_id={order_id}&amount={total_amount}"

    return Response({
        "payment_link": payment_link,
        "order_id": order_id,
        "amount": total_amount,
        "message": "Custom payment initiated"
    })
    
    
@api_view(["POST"])
def payment_status(request):
    order_id = request.data.get("order_id")
    payment_status = request.data.get("status")  # "success" or "failed"

    try:
        # tx_ref is the UUID part in order_id
        tx_ref = order_id[6:]
        transaction = Transaction.objects.get(ref__startswith=tx_ref)
        cart = transaction.cart

        if payment_status == "success":
            transaction.status = "completed"
            cart.paid = True

            # ✅ Assign the user who is currently authenticated
            if request.user.is_authenticated:
                cart.user = request.user  # Always overwrite to payer
            cart.save()

             # Create OrderItems from CartItems
            for item in cart.items.all():
                OrderItem.objects.create(
                    cart=cart,
                    product=item.product,
                    quantity=item.quantity
                )
            success_url = f"http://localhost:5173/payment-status?order_id={order_id}&status=success"
        else:
            transaction.status = "failed"
            success_url = f"http://localhost:5173/payment-status?order_id={order_id}&status=failed"

        transaction.save()

        return Response({
            "order_id": order_id,
            "status": transaction.status,
            "redirect_url": success_url,
            "message": f"Payment {transaction.status}"
        })

    except Transaction.DoesNotExist:
        return Response({"error": "Transaction not found"}, status=404)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_order_history(request):
    user = request.user
    carts = Cart.objects.filter(user=user, paid=True)

    all_orders = []

    for cart in carts:
        for transaction in cart.transactions.all():
            order_data = {
                "order_id": cart.cart_code,
                "transaction_id": transaction.ref,
                "order_date": cart.modified_at.strftime("%Y-%m-%d %H:%M"),
                "status": transaction.status,
                "items": []
            }

            cart_items = cart.items.all()
            for item in cart_items:
                order_data["items"].append({
                    "id": item.id,
                    "product_name": item.product.name,
                    "product_image": item.product.image.url if item.product.image else None,
                    "price": float(item.product.price),
                    "quantity": item.quantity,
                })

            all_orders.append(order_data)

    return Response({"orders": all_orders})



# ------------ Seller Logics


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seller_products(request):
    if not request.user.is_seller:
        return Response({"error": "Not authorized"}, status=403)
    
    products = Product.objects.filter(seller=request.user)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

from django.utils.text import slugify

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_product(request):
    if not request.user.is_seller:
        return Response({"error": "Not a seller"}, status=status.HTTP_403_FORBIDDEN)

    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        product = serializer.save(seller=request.user, slug=slugify(serializer.validated_data['name']))
        return Response({"message": "Product created", "id": product.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_product(request, pk):
    try:
        product = Product.objects.get(pk=pk, seller=request.user)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

    for field in ['name', 'description', 'price', 'stock', 'category']:
        if field in request.data:
            setattr(product, field, request.data[field])
    
    product.save()
    return Response({"message": "Product updated"})

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_product(request, pk):
    try:
        product = Product.objects.get(pk=pk, seller=request.user)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

    product.delete()
    return Response({"message": "Product deleted"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seller_dashboard_data(request):
    if not request.user.is_seller:
        return Response({"error": "Unauthorized"}, status=403)

    products = Product.objects.filter(seller=request.user)
    total_sales = 0
    earnings = 0
    chart_data = []

    for product in products:
        order_items = OrderItem.objects.filter(product=product)
        qty = sum([item.quantity for item in order_items])
        revenue = sum([item.quantity * item.product.price for item in order_items])

        chart_data.append({
            "name": product.name,
            "quantity": qty
        })

        total_sales += qty
        earnings += revenue

    return Response({
        "total_sales": total_sales,
        "earnings": earnings,
        "chart_data": chart_data
    })





# AI Model Help Logic


question_map = {
    "order_status": "Can you update me on the status of my orders?",
    "how_to_shop": "Whats the process to shop on Cartify?",
    "about_cartify": "What is Cartify?",
    "become_seller": "How do I sign up and start selling on Cartify?",
    "why_seller": "What are the benefits of becoming a seller on Cartify?",
}


answer_map = {
    "order_status": "You can view all your order details and status in the User profile section. You just have to go to the profile page.",
    
    "how_to_shop": "Shopping on Cartify is seamless: discover products via search or categories, add your favorites to the cart, and head to checkout when you're ready. We support only payment via card, and your order status is on your order history.",
    
    "about_cartify": "Cartify is a next-gen e-commerce platform built to connect shoppers and sellers with speed, style, and security. Whether you're buying your first product or scaling a digital storefront, Cartify simplifies the journey end-to-end.",
    
    "become_seller": "To start selling on Cartify, Click the button 'Upgrade to Seller' in the navbar. Complete the quick registration form, and once approved, you will unlock your seller dashboard where you can add products, manage inventory, and track earnings.",
    
    "why_seller": "Becoming a Cartify seller gives you instant access to a fast-growing customer base, marketing tools, and real-time analytics. Its perfect for creators, brands, or side hustlers looking to grow online — with low entry barriers and high potential returns.",
}


class HelpCustomView(APIView):

    def post(self, request):
        qid = request.data.get("question_id")

        # Special logic for order_status if user is authenticated
        if qid == "order_status" and request.user:
            # You can fetch real order info here if you want, or just keep generic
            return Response({
                "answer": "You can view all your order details and status in the User profile section. You just have to go to the profile page."
            })

        answer = answer_map.get(qid, "Sorry, I don't have an answer for that question yet.")

        return Response({"answer": answer})
