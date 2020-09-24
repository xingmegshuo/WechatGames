from .models import *
from rest_framework import serializers


class KnowlageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MengYou_knowlage
        fields = \
            '__all__'
