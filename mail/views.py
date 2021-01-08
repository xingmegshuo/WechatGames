from django.shortcuts import render

# Create your views here.
from user.views import APIView, Response
from rest_framework.status import *


class Mail(APIView):
    def get(self, request):
        # 获取个人邮件
        return Response({'mes': '获取个人邮件和系统邮件'}, status=HTTP_200_OK)

    def post(self, request):
        # 仅支持创建个人邮件
        return Response({'mes': '创建个人邮件,游戏中程序调用'}, status=HTTP_200_OK)

    def put(self, request):
        # 修改个邮件和系统邮件的状态，用户删除操作
        return Response({'mes': '删除邮件'}, status=HTTP_200_OK)
