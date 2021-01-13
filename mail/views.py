from django.shortcuts import render

# Create your views here.
from user.views import APIView, Response, get_parameter_dic, get_app_config
from rest_framework.status import *
from games.models import GameInfo
from .models import Mail, SysMail
from django.forms import model_to_dict
import datetime


class MyMail(APIView):
    def get(self, request):
        """
            @api {GET} /api/mail/ 获取系统邮件和个人邮件
            @apiVersion 0.0.1
            @apiName 邮件系统
            @apiGroup GAME

            @apiHeader {string} Authorization jwt验证秘钥必须添加次内容请求
            @apiParam {String} name 游戏名字，参数必须
            @apiSuccess {String} status 请求状态
            @apiSuccess {String}  mails 系统邮件和个人游戏内获得邮件
            @apiSuccessExample Success-Response:
            HTTP/1.1 200 OK
            {
                "status": 1,
                "mes": "获取个人邮件和系统邮件",
                "mails": {
                    "个人邮件": [
                        {
                            "id": 1,
                            "title": "升级奖励",
                            "text": "恭喜升级了",
                            "date": "2021-01-13 16:11:00"
                        }
                    ],
                    "系统邮件": []
                }
            }
            '需要携带token否则就是post的错误提示'
        """
        # 获取个人邮件  name 游戏名字,
        params = get_parameter_dic(request)
        user = request.user.id
        if params.get('name'):
            try:
                game_info = GameInfo.objects.get(user_id=int(user),
                                                 game_id=int(get_app_config(params.get('name')).id))
                mails = Mail.objects.filter(game_info=game_info.id, online=0)
                sysMails = SysMail.objects.filter(game_info__in=[game_info.id])
                mymail = {
                    '个人邮件': [{**(model_to_dict(i, fields=['id', 'title', 'text'])),
                              **({'date': str(i.date).replace('T', " ")})}
                             for i in mails],
                    '系统邮件': [{**(model_to_dict(i, fields=['id', 'title', 'text'])),
                              **({'date': str(datetime.datetime.strptime(str(i.date), "%Y-%m-%d %H:%M:%S") +
                                              datetime.timedelta(hours=8)).replace('T', " ")})}
                             for i in sysMails]
                }
                return Response({'status': 1, 'mes': '获取个人邮件和系统邮件', 'mails': mymail}, status=HTTP_200_OK)
            except:
                return Response({'status': 0, 'mes': '用户获取出错'}, status=HTTP_200_OK)
        else:
            return Response({'status': 0, 'mes': '没有参数name'}, status=HTTP_200_OK)

    def post(self, request):
        """
            @api {POST} /api/mail/ 游戏内创建个人邮件
            @apiVersion 0.0.1
            @apiName 邮件系统
            @apiGroup GAME

            @apiHeader {string} Authorization jwt验证秘钥必须添加次内容请求
            @apiParam {String} name 游戏名字，参数必须
            @apiParam {String} title 邮件标题，参数必须
            @apiParam {String} text 邮件内容，参数必须

            @apiSuccess {String} status 请求状态
            @apiSuccess {String}  mes 提示信息
            @apiSuccessExample Success-Response:
            HTTP/1.1 200 OK
            {
                "status": 1,
                "mes": "创建个人邮件,游戏中程序调用"
            }

            '需要携带token否则就是post的错误提示' - 仅支持创建个人邮件
        """
        # 支持创建个人邮件仅
        params = get_parameter_dic(request)
        user = request.user.id
        try:
            game_info = GameInfo.objects.get(user_id=int(user),
                                             game_id=int(get_app_config(params.get('name')).id))
            mail = Mail(title=params.get('title'), text=params.get('text'), game_info=game_info)
            mail.save()
            return Response({'status': 1, 'mes': '创建个人邮件,游戏中程序调用'}, status=HTTP_200_OK)
        except:
            return Response({'status': 0, 'mes': '创建失败，请检查参数'})

    def put(self, request):
        """
            @api {POST} /api/mail/ 游戏内删除系统邮件和个人邮件
            @apiVersion 0.0.1
            @apiName 邮件系统
            @apiGroup GAME

            @apiHeader {string} Authorization jwt验证秘钥必须添加次内容请求
            删除个人邮件
            @apiParam {String} Mid 邮件id，参数必须
            删除系统邮件
            @apiParam {String} name 游戏名字，参数必须
            @apiParam {String} SysId 系统邮件Id，参数必须

            @apiSuccess {String} status 请求状态
            @apiSuccess {String}  mes 提示信息
            @apiSuccessExample Success-Response:
            HTTP/1.1 200 OK
            {
                "status": 1,
                "mes": "删除邮件"
            }
            '需要携带token否则就是post的错误提示' - 仅支持创建个人邮件
        """
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
            return Response({'status': 1, 'mes': '删除邮件'}, status=HTTP_200_OK)
        except:
            return Response({'status': 0, 'mes': '操作失败'}, status=HTTP_200_OK)
