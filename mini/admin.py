from django.contrib import admin
from .models import *


# Register your models here.


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'is_show')
    search_fields = ('title',)
    list_filter = ('is_show',)


@admin.register(ProductInfo)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'is_show', 'is_discount', 'quantity')
    list_filter = ('is_show', 'is_discount')
    search_fields = ('name',)


@admin.register(ProductImg)
class ProductImgAdmin(admin.ModelAdmin):
    list_display = ('product', 'is_show', 'property', 'img')
    list_filter = ('is_show',)
    search_fields = ('product__name',)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    def product_show(self, obj):
        return [bt.name for bt in obj.product.all()]

    list_display = ('unionId', 'product_show', 'money', 'is_send', 'remarks', 'is_over', 'number')
    list_filter = ('is_show', 'is_send', 'is_over', 'is_fail', 'is_virtual')
    search_fields = ('product__name', 'unionId', 'number')


@admin.register(ShoppingCat)
class CatAdmin(admin.ModelAdmin):
    list_display = ('unionId', 'product', 'num', 'create_time', 'is_show')
    list_filter = ('unionId', 'product__name', 'create_time', 'is_show')
    search_fields = ('unionId', 'product__name')
