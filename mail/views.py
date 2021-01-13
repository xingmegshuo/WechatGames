from django.shortcuts import render

# Create your views here.
from user.views import APIView, Response, get_parameter_dic, get_app_config
from rest_framework.status import *
from games.models import GameInfo
from .models import Mail, SysMail
from django.forms import model_to_dict


class MyMail(APIView):
    def get(self, request):
        # 获取个人邮件  name 游戏名字,
        params = get_parameter_dic(request)
        user = request.user.id
        game_info = GameInfo.objects.get(user_id=int(user),
                                         game_id=int(get_app_config(params.get('name')).id))
        mails = Mail.objects.filter(game_info=game_info.id, on_line=0)
        sysMails = SysMail.objects.filter(game_info__in=[game_info.id])
        mymail = {'个人邮件': [model_to_dict(i, fields=['id', 'title', 'date', 'text']) for i in mails],
                  '系统邮件': [model_to_dict(i, fields=['id', 'title', 'date', 'text']) for i in sysMails]}
        return Response({'status': 'ok', 'mes': '获取个人邮件和系统邮件', 'mails': mymail}, status=HTTP_200_OK)

    def post(self, request):
        # 仅支持创建个人邮件
        params = get_parameter_dic(request)
        user = request.user.id
        try:
            game_info = GameInfo.objects.get(user_id=int(user),
                                             game_id=int(get_app_config(params.get('name')).id))
            mail = Mail(title=params.get('title'), text=params.get('text'), game_info=game_info)
            mail.save()
            return Response({'mes': '创建个人邮件,游戏中程序调用'}, status=HTTP_200_OK)
        except:
            return Response({'status': 'error', 'mes': '创建失败，请检查参数'})

    def put(self, request):
        # 修改个邮件和系统邮件的状态，用户删除操作
        params = get_parameter_dic(request)
        try:
            if params.get('Mid'):
                mail = Mail.objects.get(id=params.get('Mid'))
                mail.online = 1
                mail.save()
            elif params.get("SysId"):
                user = request.user.id
                game_info = GameInfo.objects.get(user_id=int(user),
                                                 game_id=int(get_app_config(params.get('name')).id))
                mail = SysMail.objects.get(id=params.get("SysId"))
                mail.game_info.remove(game_info.id)
                mail.save()
            return Response({'mes': '删除邮件'}, status=HTTP_200_OK)
        except:
            return Response({'mes':'操作失败'},status=HTTP_200_OK)
