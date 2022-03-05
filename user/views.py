from django.shortcuts import render

# Create your views here.

import logging
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.forms import model_to_dict
from Mypro import settings
from django.views.static import serve
from user.models import MyUser, APP
from user.serializers import *
from rest_framework.status import *
from rest_framework.response import Response
from games.models import GameInfo
from rest_framework.views import APIView
from rest_framework import serializers, viewsets
from rest_framework.request import Request
from weixin import WXAPPAPI
from weixin.oauth2 import OAuth2AuthExchangeError
from weixin.lib.wxcrypt import WXBizDataCrypt
from .util import deal_ip
from django.http import QueryDict

logger = logging.getLogger('django')


def get_parameter_dic(request, *args, **kwargs):
    if isinstance(request, Request) is False:
        return {}
    query_params = request.query_params
    if isinstance(query_params, QueryDict):
        query_params = query_params.dict()
    result_data = request.data
    if isinstance(result_data, QueryDict):
        result_data = result_data.dict()
    if query_params != {}:
        return query_params
    else:
        return result_data


def api_doc(request, path):
    """
    api文档视图，从url中移动到views
    :param 路径
    """
    if path == '':
        path = 'index.html'
    response = serve(
        request, path, document_root=settings.APIDOC_ROOT, show_indexes=True)
    return response


class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.filter(is_show=False)
    serializer_class = AddressSerializer


class AppViewSet(viewsets.ModelViewSet):
    """
        @api {GET} /data/app/ 游戏配置信息
        @apiVersion 0.0.1
        @apiDescription 可通过加id来获取单个活动
        @apiName 获取全部游戏配置
        @apiGroup DATA
    """
    queryset = APP.objects.filter(on_line='1').order_by('id')
    serializer_class = APPSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
        @api {GET} /data/user/ 用户信息
        @apiVersion 0.0.1
        @apiDescription 可通过加id来获取单个活动
        @apiName 获取全部用户信息
        @apiGroup DATA
    """

    queryset = MyUser.objects.all().order_by('id')
    serializer_class = WxUserSerializer


def create_or_update_user_info(openid, user_info):
    """
    创建或者更新用户信息
    :param openid: 微信 openid
    :param user_info: 微信用户信息
    :return: 返回用户对象
    """
    if openid:
        if user_info:
            user, created = MyUser.objects.update_or_create(
                openid=openid, defaults=user_info)
        else:
            user, created = MyUser.objects.get_or_create(openid=openid)
        return user
    return None


def get_app_config(app_name):
    """
    获取小游戏配置信息
    :param app_name: 游戏名称
    :return: 游戏小程序openid,secret秘钥
    """
    if app_name:
        app = APP.objects.get(name=app_name)
        return app
    else:
        return None, None


def record_time(user):
    """
    更新用户登录时间和上次登录时间
    :param 用户对象
    :return None
    """
    logging.info('修改登录时间')
    from django.utils import timezone
    user.last_login = user.login
    user.login = timezone.now()
    user.save()


class WxLoginView(APIView):
    """
    @api {POST} /api/wx_login/ 微信登录接口
    @apiVersion 0.0.1
    @apiDescription 通过微信登录,获取秘钥
    @apiName 微信登录
    @apiGroup GAME

    @apiParam {String} name 小游戏名称
    @apiParam {String} code 请求码


    @apiSuccess {String} jwt 认证秘钥,获取游戏信息需要此秘钥
    @apiSuccess {json} user 用户信息,openid,session_key

    @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "status": 1,
        "jwt": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTk4MzMzMzE4LCJqdGkiOiIzNTMwMTZjOWZlODg0NjMyYjI2MjZjMDc2NTZiMTg0OCIsInVzZXJfaWQiOjJ9.w4Jbv93fWhxHK2rg1bTN9lTc-s3OpltJVL7ROgV8gms",
        "user": {
            "openid": "oXzWY5EGlH7IypN0W8Y7mQ0QeedI",
            "session_key": "OouXbl87Nv0495rSCp+jLg=="
        }
    }
    如果用户已经授权
    {
        "status": 1,
        "jwt": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTk4MzMzODQwLCJqdGkiOiJlZTVmYzI4ZWQ2YTc0MTU3OWQ1ODU5NTk4MTZhZDE4ZCIsInVzZXJfaWQiOjJ9.oFNCpzwbdwtI3sJlZRFw_oK1dLwopTpvX2gCkCzv7WM",
        "user": {
            "id": 2,
            "last_login": "2020-08-24T13:28:38.468543",
            "avatar_url": null,
            "nick_name": "small_ant",
            "gender": null,
            "city": null,
            "province": null,
            "country": null,
            "login": "2020-08-24T13:37:20.455855"
        }
    }
    @apiError {String} status 请求状态1,成功,0失败
    @apiError {String} mes 信息提示
    @apiErrorExample {json} Error-Response:
    HTTP/1.1 204 Error
    {
        'status': 0,
        'mes':'code 失效'
    }
    '解决办法：重新生成code请求'

    """

    authentication_classes = []
    permission_classes = []
    fields = {
        'unionId': 'unionId',
        'nick_name': 'nickName',
        'gender': 'gender',
        'language': 'language',
        'city': 'city',
        'province': 'province',
        'country': 'country',
        'avatar_url': 'avatarUrl',
    }

    def post(self, request):
        params = get_parameter_dic(request)
        name = params.get('name')
        code = params.get('code')
        app = get_app_config(name)
        if code:
            api = WXAPPAPI(appid=app.app_id, app_secret=app.secret)
            try:
                session_info = api.exchange_code_for_session_key(code=code)
            except OAuth2AuthExchangeError:
                session_info = None
            if session_info:
                openid = session_info.get('openid', None)
                session_key = session_info.get('session_key', None)
                user = create_or_update_user_info(openid, None)
                logger.info('用户id:{}'.format(user.id))
                try:
                    deal_ip(request, user)
                except:
                    logger.info("分析ip地址失败", user.id)
                record_time(user)
                token = TokenObtainPairSerializer.get_token(user).access_token
                login_record = RecordLogin.objects.create(user=user, game=app)
                login_record.save()
                try:
                    GameInfo.objects.get(user_id=user, game_id=app)
                except:
                    GameInfo.objects.create(user_id=user, game_id=app)
                if user.is_auth is True:
                    logger.info('用户登录成功' + user.nick_name)
                    user = model_to_dict(
                        user,
                        fields=[
                            'nick_name', 'last_login', 'avatar_url', 'gender',
                            'city', 'province', 'country', 'login', 'id',
                            'company', 'restaurant', 'current_role',
                            'is_owner', 'is_client', 'is_manager', 'openid'
                        ])

                else:
                    user = {'openid': openid, 'session_key': session_key}
                    logger.info('用户登录成功' + openid)
                return Response(
                    {
                        'status': 1,
                        'jwt': str(token),
                        'user': user
                    },
                    status=HTTP_200_OK)

                # if openid:
                #     try:
                #         user = MyUser.objects.get(openid=openid)
                #     except:
                #         try:
                #             encryptedData = \
                #                 params.get('encryptedData').replace(' ', '+')
                #             iv = \
                #                 params.get('iv').replace(' ', '+')
                #         except:
                #             return Response({'error': '缺少解密参数！'})
                #         crypt = WXBizDataCrypt(app.app_id, session_key)
                #         user_info_raw = crypt.decrypt(encryptedData, iv)
                #         logger.info("user_info: {0}".format(user_info_raw))
                #         if user_info_raw:
                #             for k, v in self.fields.items():
                #                 user_info[k] = user_info_raw.get(v)
                #         user = create_or_update_user_info(openid, user_info)
                #         game_info = GameInfo.objects.create(user_id=user, game_id=app)
                #     if user:
                #         token = TokenObtainPairSerializer.get_token(user).access_token
                #         record_time(user)
                #         # response = Response()
                #         # response.set_cookie('app',app.id)
                #         # logger.info('cookie:{}'.format(request.COOKIES))
                #         return Response(
                #             {
                #                 'status': 1,
                #                 'jwt': str(token),
                #                 'user': model_to_dict(
                #                     user,
                #                     fields=[
                #                         'nick_name', 'last_login', 'avatar_url', 'gender',
                #                         'city', 'province', 'country', 'login',
                #                         'company', 'restaurant', 'current_role',
                #                         'is_owner', 'is_client', 'is_manager'
                #                     ])
                #             },
                #             status=HTTP_200_OK)
            else:
                logger.info('用户登录失败')
                return Response({'status': 0, 'mes': 'code失效！'})
        return Response({'status': 0, 'mes': '没有信息'}, status=HTTP_204_NO_CONTENT)


class WxAuthView(APIView):
    """
    @api {POST} /api/wx_auth/ 发起微信授权接口
    @apiVersion 0.0.1
    @apiName 微信授权
    @apiGroup GAME
    @apiHeader {string} Authorization jwt验证秘钥必须添加次内容请求

    @apiParam {String} openid wx_login 的返回值
    @apiParam {String} iv 解密参数
    @apiParam {string} encrypteData 解密参数
    @apiParam {string} session_key wx_login 返回参数
    @apiParam {string} name 游戏名字

    @apiSuccess {String} status 状态码，请求是否成功
    @apiSuccess {String} mes 提示信息
    @apiSuccess {json} user 授权后的用户信息

    @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    {
        "status": 1,
        "mes": "授权成功",
        "user": {
            "last_login": "2020-08-21T19:10:14.515026",
            "avatar_url": null,
            "nick_name": "small_ant",
            "gender": null,
            "city": null,
            "province": null,
            "country": null,
            "login": "2020-08-24T13:28:38.468543"
        }
    }
    """
    fields = {
        'unionId': 'unionId',
        'nick_name': 'nickName',
        'gender': 'gender',
        'language': 'language',
        'city': 'city',
        'province': 'province',
        'country': 'country',
        'avatar_url': 'avatarUrl',
    }

    def post(self, request):
        params = get_parameter_dic(request)
        user_info = {}
        try:
            encryptedData = params['encrypteData'].replace(' ', '+')
            iv = params['iv'].replace(' ', '+')
            crypt = WXBizDataCrypt(get_app_config(
                params.get('name')).app_id, params.get('session_key'))
            user_info_raw = crypt.decrypt(encryptedData, iv)
            logger.info("user_info: {0}".format(user_info_raw))
            if user_info_raw:
                for k, v in self.fields.items():
                    user_info[k] = user_info_raw.get(v)
            user_info['is_auth'] = 'True'
            user = create_or_update_user_info(params.get('openid'), user_info)
            logger.info('用户授权成功' + str(request.user) + user.nick_name)
            return Response(
                {
                    'status': 1,
                    'mes': '授权成功',
                    'user': model_to_dict(
                        user,
                        fields=[
                            'nick_name', 'last_login', 'avatar_url', 'gender',
                            'city', 'province', 'country', 'login', 'unionId',
                            'company', 'restaurant', 'current_role',
                            'is_owner', 'is_client', 'is_manager'
                        ])
                },
                status=HTTP_200_OK)
        except:
            return Response({
                'status': 1,
                'mes': '请检查参数'
            })


class RegisterView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        params = get_parameter_dic(request)
        if params.get("account", "") != "" and params.get("password", "") != "":
            # return Response({'status': 1, "mes": params})
            users = MyUser.objects.filter(unionId=params['account'])
            if len(users) > 0:
                return Response({
                    "status": 1,
                    "mes": '用户已经注册'
                })
            else:
                user = create_or_update_user_info(
                    params['password'], {'unionId': params['account']})
                token = TokenObtainPairSerializer.get_token(user).access_token
                return Response(
                    {
                        'status': 1,
                        'jwt': str(token),
                        'user': model_to_dict(
                            user,
                            fields=[
                                'nick_name', 'last_login', 'avatar_url', 'gender',
                                'city', 'province', 'country', 'login', 'unionId',
                                'company', 'restaurant', 'current_role',
                                'is_owner', 'is_client', 'is_manager'
                            ])
                    },
                    status=HTTP_200_OK)
          
        else:
            return Response({'status': 1, 'mes': '账号或密码不能为空'})


class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        params = get_parameter_dic(request)
        if params.get("account", "") != "" and params.get("password", "") != "":
            user = MyUser.objects.get(
                unionId=params['account'], openId=params['password'])
            if user:
                token = TokenObtainPairSerializer.get_token(user).access_token
                return Response(
                    {
                        'status': 1,
                        'jwt': str(token),
                        'user': model_to_dict(
                            user,
                            fields=[
                                'nick_name', 'last_login', 'avatar_url', 'gender',
                                'city', 'province', 'country', 'login', 'unionId',
                                'company', 'restaurant', 'current_role',
                                'is_owner', 'is_client', 'is_manager'
                            ])
                    },
                    status=HTTP_200_OK)
            else:
                return Response({'status': 1, 'mes': '账号或密码不正确'}, status=HTTP_204_NO_CONTENT)
        else:
            return Response({'status': 1, 'mes': '账号或密码不能为空'}, status=HTTP_204_NO_CONTENT)


class ChangePwdView(APIView):
    def post(self, request):
        params = get_parameter_dic(request)
        id = request.user.id
        if params["oldpassword"] != params["newpassword"] and params["newpassword"] != "":
            user = MyUser.objects.get(id=id)
            user.__dict__.update({"openId": params["newpassword"]})
            user.save()
            token = TokenObtainPairSerializer.get_token(user).access_token
            return Response({
                'status': 1,
                'mes': '更新密码成功'
            }, status=HTTP_200_OK)

        else:
            return Response({'status': 1, 'mes': '账号或密码不能为空'}, status=HTTP_204_NO_CONTENT)
