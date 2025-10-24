from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    city = models.CharField(max_length=100, blank=True,null=True)
    state = models.CharField(max_length=100, blank=True,null=True)
    address = models.TextField(blank=True,null=True)
    phone = models.CharField(max_length=15,blank=True,null=True)  
    is_seller = models.BooleanField(default=False)
    
    def __str__(self):
        return self.username


#Custom User modifying AbstractUser
#fields:- city {char<100,b & n true} , state {char<100, b & n true} , address {text,b & n true} , phone  {char<15 ,b & n true}

class SellerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    shop_name = models.CharField(max_length=100)
    tax_number = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)