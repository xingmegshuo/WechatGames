from django.contrib.auth.models import User, Group
from rest_framework import serializers
from user.models import *
import django_filters


# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# class JfwTokenObtainPairSerializer(TokenObtainPairSerializer):
#
#     @classmethod
#     def get_token(cls, user):
#         token = super(JfwTokenObtainPairSerializer, cls).get_token(user)
#         token['username'] = 'wx_{0}'.format(user.username)
#         return token


class WxUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = \
            '__all__'
        # read_only_fields = ['__all__']
        extra_kwargs = {
            'url': {
                'read_only': True
            }
        }
        # ['id', 'nick_name', 'avatar_url', 'gender']


class APPSerializer(serializers.ModelSerializer):
    # app_config = serializers.PrimaryKeyRelatedField(many=True, required=False, read_only=True)
    app_config = serializers.SerializerMethodField()

    class Meta:
        model = APP
        fields = ('id', 'name', 'img', 'app_config', 'app_id')

    def get_app_config(self, obj):
        config = App_config.objects.filter(app_id=obj).filter(on_line='1')
        if len(config) > 0:
            return {i.name: i.value for i in config}
        else:
            return 'none'
