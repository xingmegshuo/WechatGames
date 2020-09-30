from rest_framework import serializers
from .models import *


# 所有活动
class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = \
            '__all__'


# 商城商品
class ProductSerializer(serializers.ModelSerializer):
    productImg = serializers.SerializerMethodField()

    class Meta:
        model = ProductInfo
        fields = (
            'id',
            'name', 'price', 'virtual', 'quantity', 'sail', 'property', 'date', 'is_show', 'discount', 'is_discount',
            'productImg')

    def get_productImg(self, obj):
        img = ProductImg.objects.filter(product=obj, )[0]
        return img.img.url
