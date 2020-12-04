from .models import *
from rest_framework import serializers


class KnowlageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MengYou_knowlage
        fields = \
            '__all__'


class AdversingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertising
        fields = ('title', 'logo', 'appid')
