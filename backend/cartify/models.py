from django.db import models
from django.utils.text import slugify
from django.conf import settings

class Product(models.Model):
    
    CATEGORY = (("Earbuds", "EARBUDS"),
                ("Earphones", "EARPHONES"),
                ("Headsets", "HEADSETS"),
                ("Headphones", "HEADPHONES"),
                ("Peripherals", "PERIPHERALS"),
                ("Mouse", "MOUSE"),
                ("keyboard", "KEYBOARD"),
                ("Gaming", "GAMING"),
                ("Mic", "MIC"),
                ("Camera", "CAMERA"),
                )
    
    name =models.CharField(max_length=100)
    slug = models.SlugField(blank=True,null=True)
    image = models.ImageField(upload_to="img")
    description = models.TextField(blank=True,null=True)
    price = models.DecimalField(max_digits=15,decimal_places=2)
    category = models.CharField(max_length=15 ,choices=CATEGORY, blank=True,null=True)
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.name
    
    def save(self , *args , **kwargs):
        if not self.slug :
            self.slug = slugify(self.name)
            unique_slug = self.slug
            counter = 1
            if Product.objects.filter(slug = unique_slug).exists():
                unique_slug=f'${self.slug}-{counter}'
                counter += 1
            self.slug = unique_slug
        super().save(*args,**kwargs)
#save function make the value in slug field unique, if duplication occurs thw value will changed to value-1,value-2 etc and etc 

#Product __=Category with choice -electronics,groceries,clothings-
# fields = name - char <100 , slug - Slug, b&n True , image - img, to '/img' , description - text,b&n true , 
# price - decimal < 10 & dec <2 , category - choice from CATEGORY > 15 ,b&n true


class Cart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    cart_code = models.CharField(max_length=100, unique=True)
    paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    modified_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    
    def __str__(self):
        return self.cart_code
    
#Cart __= 
# Fields = cart_code - Char < 11,unique , user - foreignkey(AUTH_USER_MODEL frm settings), ondelete-cascade,b&n true,
# paid - Boolean,def False , created_at - datetime , autoaddnow true , b&n true , 
# modified_at - datetime , autonow true , b&n true {return cartcode}


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    
    def __str__(self):
        return f"{self.quantity} * {self.product} in cart {self.cart_id}"
    
#CartItem __=
#Fields = cart - foreignkey(cart),name items,ondelete-cascade , product - foreignkey(Product),ondelete-cascade, 
# quantity - integer,def 1 , return{f quantity * product in  cart cart_id}


class Transaction(models.Model):
    ref = models.CharField(max_length=255,unique= True)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE,related_name="transactions")
    amount = models.DecimalField(max_digits=10,decimal_places=2)
    currency = models.CharField(max_length=100, default="INR")
    status = models.CharField(max_length=20,default="not_paid")
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Transaction {self.ref} - {self.status}"
    
class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="order_items")
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
