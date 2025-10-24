from django.urls import path
from . import views

urlpatterns = [
    path("products/",views.products , name="products"),
    path("products_detail/<slug:slug>",views.product_detail , name="product_detail"),
    path("add_item", views.add_item, name="add_item"),
    path("product_in_cart", views.product_in_cart, name="product_in_cart"),
    path("get_cart_stat", views.get_cart_stat, name="get_cart_stat"),
    path("get_cart", views.get_cart, name="get_cart"),
    path("update_quantity/", views.update_quantity, name="update_quantity"),
    path("delete_cartitem/", views.delete_cartitem, name="delete_cartitem"),
    
    path("initiate_payment", views.initiate_payment, name="initiate_payment"),
    path("payment_status", views.payment_status, name="payment_status"),
    
    path("get_username/", views.get_username, name="get_username"),
    path('user_order_history', views.user_order_history, name='user_order_history'),
    
     
    path("seller/products/", views.seller_products, name="seller-products"),
    path("seller/products/create/", views.create_product, name="create-product"),
    path("seller/products/<int:pk>/update/", views.update_product, name="update-product"),
    path("seller/products/<int:pk>/delete/", views.delete_product, name="delete-product"),
    path("seller/dashboard/", views.seller_dashboard_data, name="seller-dashboard"),



    path("api/help_ai/", views.HelpCustomView.as_view(), name="help-ai"),
     
]
