from ast import Param
from string import ascii_letters
from django.shortcuts import render

# Create your views here.
import datetime
from django.forms import model_to_dict
from rest_framework.response import Response
from rest_framework.status import *
from rest_framework.views import APIView
from rest_framework import viewsets
from .models import *
from user.views import get_parameter_dic, get_app_config, logger

from user.models import MyUser

from web.views import scheduler
from job.views import send_mes, change_status
from .serializers import KnowlageSerializer, AdversingSerializer
from django.http import HttpResponse
from django.utils.timezone import utc, get_default_timezone


class SignView(APIView):
    """
            @api {POST} /api/sign/ 签到接口
            @apiVersion 0.0.1
            @apiName 游戏签到
            @apiGroup GAME

            @apiHeader {string} Authorization jwt验证秘钥必须添加次内容请求

            @apiParam {String} name 游戏名字，参数必须

            @apiSuccess {String} status 请求状态
            @apiSuccess {String} date list 签到时间

            @apiSuccessExample Success-Response:
            HTTP/1.1 200 OK
            {
                'status': 1,
                "mes": "ok,今日签到成功！",
                "time": [
                    {
                        "date": "2020-08-06T17:15:42.109339"
                    }
                ]
            }

            @apiError {String} status 请求状态,请求状态为0表示签到失败，请求状态为1表示签到成功
            @apiError {String} mes 信息提示

            @apiErrorExample Error-Response:
            {
                "mes": "error,今日签到已完成！",
                'mes': 'error, 七日签到完成,

            }
            '需要携带token否则就是post的错误提示'
    """

    def post(self, request):
        """
        :param name 游戏名字，获取角色
        记录角色签到信息
        :return None
        """
        params = get_parameter_dic(request)

        game_info = GameInfo.objects.get(user_id=int(request.user.id),
                                         game_id=int(get_app_config(params.get('name')).id))
        today = datetime.datetime.now().date()
        sign_info = Sign.objects.filter(game_info=game_info)
        today_sign = sign_info.filter(date__gt=today)
        if len(today_sign) < 1 and len(sign_info) < 7:
            Sign.objects.create(game_info=game_info)
            sign_info = Sign.objects.filter(game_info=game_info.id)
            # logger.info(request.user.id + '用户签到成功')
            return Response({
                'status': 1,
                'mes': 'ok,今日签到成功！',
                'time': [{'date': str(
                    datetime.datetime.strptime(str(sign.date), "%Y-%m-%d %H:%M:%S.%f") + datetime.timedelta(
                        hours=8)).replace('T', " ")} for sign in sign_info]
            }, status=HTTP_200_OK)
        elif len(sign_info) == 7:
            # logger.info(request.user + '七日签到完成')
            return Response({'status': 0, 'mes': 'error, 七日签到完成', 'time': [{'date': str(
                datetime.datetime.strptime(str(sign.date), "%Y-%m-%d %H:%M:%S.%f") + datetime.timedelta(
                    hours=8)).replace('T', " ")} for sign in sign_info]}, status=HTTP_204_NO_CONTENT)
        else:
            return Response({
                'status': 0,
                'mes': '今日签到已完成！',
                'time': [{'date': str(
                    datetime.datetime.strptime(str(sign.date), "%Y-%m-%d %H:%M:%S.%f") + datetime.timedelta(
                        hours=8)).replace('T', " ")} for sign in sign_info]
            }, status=HTTP_200_OK)


class KnowView(APIView):
    def get(self, request):
        """
            @api {GET} /api/knowlage/ 知识学习状态
            @apiVersion 0.0.1
            @apiDescription  调用此接口会提示用户已经学习此知识，可以去获取新的
            @apiName 知识学习状态
            @apiGroup 萌游知知
            @apiHeader {string} Authorization jwt验证秘钥必须添加次内容请求

            @apiParam {String} name 游戏名字，参数必须
            @apiParam {String} id 知识唯一标识id

            @apiSuccess {String} status 请求状态
            @apiSuccess {String} mes 提示信息
            @apiSuccessExample Success-Response:
            HTTP/1.1 200 OK
            # 确定开始学习
            {
                'status': 1,
                'mes': '用户已经学习此知识'
             }
            #  已经开始学习了，等待学习完才能开始新的
            # {
            #     "status": 0,
            #     "mes": "知识学习开始学习"
            # }
        """
        params = get_parameter_dic(request)
        user = request.user.id
        game_info = GameInfo.objects.get(user_id=int(user),
                                         game_id=int(get_app_config(params.get('name')).id))
        recoding = MengYou_recoding(
            game_info=game_info, knowlage_id=params.get('id'))
        recoding.is_over = True
        recoding.save()
        # if len(recoding) == 0:
        #     recoding = MengYou_recoding.objects.create(game_info=game_info, knowlage_id=params.get('id'))
        # 用户接受订阅
        # if game_info.is_subscription is True:
        # pass
        # to do : add job send_mes
        # data = {
        #     'touser': game_info.user_id.openid,
        #     'template_id': 'xi8fGRkUN5SldKRNzfvfay9GJwuDEvE8q6yFqH53fgw',
        #     'data': {
        #         "character_string1": {"value": '20'},
        #         "thing2": {"value": '很抱歉'},
        #         "thing4": {'value': 'ok'},
        #         "character_string5": {"value": '100'},
        #         "thing3": {"value": '体力回满了'}
        #     }
        # }
        # scheduler.add_job(send_mes, 'date',
        #                   id='MY' + str(recoding.id),
        #                   run_date=recoding.send_time,
        #                   args=[game_info.game_id.app_id, game_info.game_id.secret, data])
        # scheduler.start()
        # time.strftime("%Y-%b-%d %H:%M:%S", recoding.send_time))
        # scheduler.resume_job('MY'+str(recoding.id))
        # 一次订阅
        # game_info.is_subscription = False
        # game_info.save()
        # scheduler.add_job(change_status, 'date', id='MYCH' + str(recoding.id), run_date=recoding.send_time,
        #                   args=[recoding])
        return Response({'status': 1, 'mes': '用户已经学习此知识'}, status=HTTP_200_OK)
        # else:
        #     return Response({'status': 0, 'mes': '已经开始学习'}, status=HTTP_200_OK)

    def post(self, request):
        """"
        :return 随机返回未学习过的知识
        @api {POST} /api/knowlage/ 获取知识-更新版
        @apiVersion 0.0.1
        @apiDescription 获取学习知识，随机返回一条,获取已学习知识,分页,20条为一页
        @apiName 获取知识-或者获取已经学习的知识
        @apiGroup 萌游知知

        @apiHeader {string} Authorization jwt验证秘钥必须添加次内容请求

        @apiParam {String} name 游戏名字，参数必须
        @apiParam {String} over 已经学习过的数据，参数可选，不携带就是随机获取一条数据，携带就是获取学习过数据
        @apiParam {String} page 获取已经学习过的数据页数，参数可选，不携带默认第一页


        @apiSuccess {String} status 请求状态
        @apiSuccess {String} mes 提示信息
        @apiSuccess {json} knowlage 返回的知识数据
        @apiSuccess {json} knowlage 学习过的知识

        @apiSuccessExample Success-Response:
        HTTP/1.1 200 OK
        未携带over 随机返回，但数据库已经没有
        {
        "status": 0,
        "mes": "没有知识",
        "knowlage": null
        }
        携带over， 返回已经学习过的
        {
            "status": 1,
            "mes": "已经学习的知识",
            "page":"1",
            "knowlage": [
                {
                    "id": 12,
                    "title": "第2课",
                    "voice": "/static/voice/第2课.mp3",
                    "text": "说话内容",
                    "level": "1",
                    "status": false
                }
            ]


        }
        """
        params = get_parameter_dic(request)
        user = request.user.id
        game_info = GameInfo.objects.get(user_id=int(user),
                                         game_id=int(get_app_config(params.get('name')).id))
        # knowlage_ing = None
        if params.get('over', None) is None:
            knowlage = MengYou_knowlage.objects.exclude(
                id__in=[i.knowlage.id for i in MengYou_recoding.objects.filter(game_info=game_info)]).filter(
                is_check=True, status=True).order_by(
                '?').first()
            if knowlage:
                status = 1
                mes = '随机返回的学习知识'
                knowlage = model_to_dict(knowlage,
                                         fields=['id', 'title', 'voice', 'text', 'img.url', 'level', 'status', 'need'])
            else:
                status = 0
                mes = '没有知识'
                knowlage = None
            return Response({
                'status': status,
                'mes': mes,
                'knowlage': knowlage,
            }, status=HTTP_200_OK)
        else:
            knowlage = MengYou_knowlage.objects.filter(
                id__in=[i.knowlage.id for i in MengYou_recoding.objects.filter(
                    game_info=game_info, is_over=True)],
                status=True)
            status = 1
            mes = '已经学习过知识'
            knowlage = [model_to_dict(know, fields=['id', 'title', 'voice', 'text', 'img.url', 'level', 'status']) for
                        know in
                        knowlage]
            # knowlage_ing = MengYou_knowlage.objects.filter(
            #     id__in=[i.knowlage.id for i in MengYou_recoding.objects.filter(game_info=game_info, is_over=False)],
            #     status=True)
            # knowlage_ing = [
            #     {**(model_to_dict(know, fields=['id', 'title', 'voice', 'text', 'img.url', 'level', 'status'])),
            #      **(model_to_dict(know.knowlage_recod, fields=['send_time']))}
            #     for
            #     know in
            #     knowlage_ing]
            if params.get('page', None) is None:
                if len(knowlage) > 20:
                    knowlage = knowlage[:20]
                page = 1
            else:
                page = params.get('page')
                if int(len(knowlage) / 20) - params.get('page') > 1:
                    knowlage = knowlage[20 *
                                        params.get('page'):20 + 20 * params.get('page')]
                else:
                    knowlage = knowlage[20 * params.get('page'):]
            return Response({
                'status': status,
                'mes': mes,
                'page': page,
                'knowlage': knowlage,
                # 'knowlage_ing': knowlage_ing,
            }, status=HTTP_200_OK)

    def put(self, request):
        # to do 修改学习完成的时间
        """
            @api {PUT} /api/knowlage/ 更新知识状态 弃用
            @api {PUT} /api/knowlage/ 更新知识状态 弃用
            @apiVersion 0.0.1
            @apiDescription 更新知识学习完成时间，根据知识所需时间添加定时任务，在过程中，用户观看广告减少时间
            @apiName 更新知识学习完成时间
            @apiGroup Delete
            @apiHeader {string} Authorization jwt验证秘钥必须添加次内容请求

            @apiParam {String} name 游戏名字，参数必须
            @apiParam {string} time 所减少的时间，以分钟为单位来计算
            @apiSuccess {String} status 请求状态
            @apiSuccess {String} mes 提示信息
        """
        params = get_parameter_dic(request)
        user = request.user.id
        game_info = GameInfo.objects.get(user_id=int(user),
                                         game_id=int(get_app_config(params.get('name')).id))
        recoding = MengYou_recoding.objects.filter(
            game_info=game_info, knowlage_id=params.get('id'))
        # 分钟为单位
        shorten_time = params.get('time')
        recoding.send_time = recoding.send_time - \
            datetime.timedelta(minutes=float(shorten_time))
        recoding.save()
        if game_info.is_subscription is True:
            pass
        # to do : add job


class Ranking(APIView):
    """
        @api {POST} /api/rank/ 获取排行
        @apiVersion 0.0.1
        @apiName 获取排行
        @apiGroup GAME

        @apiHeader {string} Authorization jwt验证秘钥必须添加次内容请求

        @apiParam {String} name 游戏名字，参数必须
        @apiParam {String} cod 排序字段，参数必须
        @apiParam {String} As_ds 正序或反序 参数可选默认正序 as 为正序，ds反序
        @apiParam {int} num 获取数据条数,参数可选，默认100

        @apiSuccess {String} status 请求状态
        @apiSuccess {String}  mes 信息提示
        @apiSuccess {string} info list 返回排序数据 角色信息和用户头像、昵称等

        @apiSuccessExample Success-Response:
        HTTP/1.1 200 OK
        {
            "status": 1,
            "mes": "排序数据",
            "info": [
                {
                    "grade": "1",
                    "score": "0",
                    "level": "1",
                    "property": "0",
                    "avatar_url": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eq4O1ybHBEFxs6IOq3gpDBUJIs6CCh3Dzdticd7Gg6vciafribkhDuria8sP7ytjwBX62IZbIyNxZfHgg/132",
                    "nick_name": "small ant"
                }
            ]
        }

        @apiError {String} status 请求状态
        @apiError {String} mes 信息提示

        @apiErrorExample Error-Response:
        {
            "status": 0,
            "mes": "不能依据此字段排序",
            "info": null
        }

        '需要携带token否则就是post的错误提示'
    """

    def post(self, request):
        params = get_parameter_dic(request)
        name = params.get('name', None)
        app = get_app_config(name).id
        cod = params.get('cod', None)
        As_ds = params.get('As_ds', None)
        num = params.get('num', 100)

        try:
            if As_ds is None or As_ds == 'as':
                game_info = GameInfo.objects.filter(
                    game_id=app).order_by('-' + cod)[:num]
            else:
                game_info = GameInfo.objects.filter(
                    game_id=app).order_by(cod)[:num]
            status = 1
            mes = '排序数据'
            info = [{**(model_to_dict(info, fields=['level', 'grade', 'score', 'property'])),
                     **(model_to_dict(info.user_id, fields=['nick_name', 'avatar_url']))}
                    for info in game_info]
        except:
            status = 0
            mes = '不能依据此字段排序'
            info = None
        return Response({'status': status, 'mes': mes, 'info': info}, status=HTTP_200_OK)


class KnowViewSet(viewsets.ModelViewSet):
    """
        @api {POST} /data/know/ 知识上传
        @apiVersion 0.0.1
        @apiDescription 知识上传，提交至后台审核,也可通过GET请求+知识id获取知识
        @apiName 知识上传
        @apiGroup 萌游知知

        @apiHeader {file} img 图片 必须
        @apiHeader {string} text 文本内容 必须
        @apiHeader {string} level 等级，非必须，可选
        @apiHeader {string} title 标题，必须
        @apiHeader {String} Authorization 用户授权token
        @apiHeaderExample {json} Header-Example:
        {
            "Authorization": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTk2Nzg5NjIwLCJqdGkiOiIxOWNlZWU1YTYwMmI0MzViYTQwMmViNmI1ODIwNjA1YSIsInVzZXJfaWQiOjJ9.XqQLLDItehwz49_KQ9-QXznu0JuqN4HcB_42c6B9SCs",
            "type":"BearerToken"
        }
        @apiHeaderExample {json} Header-Example:
        {
            "img":"文件",
            "title":"标题",
            "text":"说话内容"
        }
        @apiSuccessExample Success-Response:
        HTTP/1.1 200 OK
        {
            "id": 11,
            "img": "http://127.0.0.1:8000/media/MengYou/Cache_-7d70353304914e67._NHRv8OI.jpg",
            "title": "第2课",
            "voice": "/static/voice/第2课.mp3",
            "text": "说话内容",
            "level": "1",
            "is_check": false,
            "status": false
        }

    """
    queryset = MengYou_knowlage.objects.all().filter(
        is_check=True, status=True).order_by('id')
    serializer_class = KnowlageSerializer


class AdersingViewSet(viewsets.ModelViewSet):
    """
        @api {GET} /data/advertising/ 广告获取
        @apiVersion 0.0.1
        @apiDescription 获取广告接口
        @apiName 广告获取
        @apiGroup DATA

    """
    queryset = Advertising.objects.all().filter(status=True)
    serializer_class = AdversingSerializer


class GameInfoView(APIView):
    def post(self, request):
        """
            @api {POST} /api/gameInfo/ 获取游戏内容接口
            @apiVersion 0.0.1
            @apiName 获取游戏配置信息
            @apiGroup GAME

            @apiHeader {string} Authorization jwt验证秘钥必须添加次内容请求

            @apiParam {String} name 小游戏名字,区分该用户玩过多款小游戏

            @apiSuccess {String} gameInfo-grade 等级
            @apiSuccess {String} gameInfo-score 得分
            @apiSuccess {String} gameInfo-level 解锁关卡，玩到第几关
            @apiSuccess {String} gameInfo-property 金币,钻石等资源
            @apiSuccess {String} gameInfo-ortherInfo 其它信息，json转字符串存储，获取后可转回json


            @apiSuccessExample Success-Response:
            HTTP/1.1 200 OK
            {
                'status': 1,
                "gameInfo": {
                    "grade": "1",
                    "score": "0",
                    "level": "1",
                    "property": "0",
                    "ortherInfo":""
                }
            }

            @apiError {String} message token 错误,或者没有携带

            @apiErrorExample Error-Response:
            {
                "detail": "Given token not valid for any token type",
                "code": "token_not_valid",
                "messages": [
                    {
                        "token_class": "AccessToken",
                        "token_type": "access",
                        "message": "Token is invalid or expired"
                    }
                ]
            }
            '请求需要携带token '

        """
        params = get_parameter_dic(request)
        user = request.user.id
        game_info = GameInfo.objects.get(user_id=int(user),
                                         game_id=int(get_app_config(params.get('name')).id))
        logger.info(game_info.id, '用户获取游戏信息')
        return Response(
            {
                'status': 1,
                'gameInfo': model_to_dict(
                    game_info,
                    fields=[
                        'grade', 'score', 'level', 'property', 'is_subscription', 'ortherInfo'
                    ]
                )
            },
            status=HTTP_200_OK)

    def put(self, request):
        """
            @api {PUT} /api/gameInfo/ 更新游戏内容接口
            @apiVersion 0.0.1
            @apiName 更新用户游戏信息
            @apiGroup GAME

            @apiHeader {string} Authorization jwt验证秘钥必须添加此内容请求

            @apiParam {String} name 小游戏名字,区分该用户玩过多款小游戏
            @apiParam {String} gameInfo_value 更新哪个内容就传递什么参数和值,可以传递一个或多个
            @apiExample {json} Example usage:
                {
                    "name":"ml",
                    "ortherInfo":"bbbbb",
                }

            @apiSuccess {String} gameInfo-grade 等级
            @apiSuccess {String} gameInfo-score 得分
            @apiSuccess {String} gameInfo-level 解锁关卡，玩到第几关
            @apiSuccess {String} gameInfo-property 金币,钻石等资源
            @apiSuccess {String} is_subscription 是否订阅
            @apiSuccess {String} gameInfo-ortherInfo 其它信息，json转字符串存储，获取后可转回json


            @apiSuccessExample Success-Response:
            HTTP/1.1 200 OK
            {
                'status': 1,
                "gameInfo": {
                    "grade": "1",
                    "score": "0",
                    "level": "1",
                    "property": "0",
                    "ortherInfo":""
                }
            }
            '更新后的内容'

            @apiError {String} mes 错误提示
            @apiError {String} status 请求状态1,成功,0失败

            @apiErrorExample Error-Response:
            {
                'status': 0,
                "mes": "没有更改信息"
            }
            '没有传递要修改的参数，也需要携带token否则就是post的错误提示'


        """
        # 更新游戏信息
        params = get_parameter_dic(request)
        user = request.user.id
        game_info = GameInfo.objects.get(user_id=int(user),
                                         game_id=int(get_app_config(params.get('name')).id))
        dic = {k: v for k, v in dict(params).items()}
        del dic['name']
        logger.info(dic)
        if len(dic) == 0:
            return Response({
                'status': 0,
                'mes': '没有更改信息'
            }, status=HTTP_200_OK)
        else:
            palyer = MyUser.objects.get(id=user)
            if dic.get('avatar_url', '') != "":
                palyer.avatar_url = dic['avatar_url']
            if dic.get('nick_name', '') != '':
                palyer.nick_name = dic['nick_name']
            palyer.save()
            game_info.__dict__.update(dic)
            game_info.save()
            return Response(
                {
                    'status': 1,
                    'gameInfo': model_to_dict(
                        game_info,
                        fields=[
                            'grade', 'score', 'level', 'unlock_level', 'property', 'is_subscription', 'ortherInfo'
                        ]
                    )
                },
                status=HTTP_200_OK)


class DirayView(APIView):
    def get(self, request):
        """
              @api {GET} /api/diray/ 获取个人日记内容接口
              @apiVersion 0.0.1
              @apiName 获取日记信息
              @apiGroup 萌上日记

              @apiHeader {string} Authorization jwt验证秘钥必须添加次内容请求
              @apiParam {String} name 游戏名字
              @apiError {String} message token 错误,或者没有携带
              @apiSuccessExample Success-Response:
              HTTP/1.1 200 OK
              {
                "status": 1,
                "mes": "用户日记信息",
                "info": [
                        {
                            "id": 1,
                            "text": "dkfglfkldlkklgflk",
                            "title": "dlflgkkglkkl",
                            "weather": null,
                            "mood": null,
                            "public": false,
                            "status": false,
                            "img": null
                        },
                        {
                            "id": 2,
                            "text": "这样很好111",
                            "title": "这样不好2222",
                            "weather": null,
                            "mood": null,
                            "public": true,
                            "status": false,
                            "img": "/media/MengShang/b0ee657175d1421dc9fd0e03a9191d4b_u5rTjY4.jpg"
                        }
                    ]
              }
              @apiErrorExample Error-Response:
              {
                  "detail": "Given token not valid for any token type",
                  "code": "token_not_valid",
                  "messages": [
                      {
                          "token_class": "AccessToken",
                          "token_type": "access",
                          "message": "Token is invalid or expired"
                      }
                  ]
              }
              '请求需要携带token '

          """
        user = request.user.id
        name = get_parameter_dic(request).get('name')
        game_info = GameInfo.objects.get(
            user_id=int(user), game_id=get_app_config(name))
        diray = Diray.objects.filter(game_info=game_info, status=False)
        if len(diray) > 0:
            status = 1
            mes = '用户日记信息'
            info = []
            for i in diray:
                info.append({**(model_to_dict(i,
                                              fields=('id', 'title', 'text', 'date', 'public', 'status', 'weather',
                                                      'mood'))),
                             **({'img': [j.img.url for j in DirayImage.objects.filter(diray=i)]})})
        else:
            status = 0
            mes = '暂时没有日记'
            info = None
        return Response({'status': status, 'mes': mes, 'info': info}, status=HTTP_200_OK)

    def post(self, request):
        """
              @api {POST} /api/diray/ 上传日记
              @apiVersion 0.0.1
              @apiName 上传日记
              @apiGroup 萌上日记

              @apiHeader {string} Authorization jwt验证秘钥必须添加次内容请求
              @apiParam {String} name 游戏名字
              @apiParam {String} title 日记标题
              @apiParam {String} content 日记内容
               @apiParam  {String} weather 天气 ,可以为空
               @apiParam  {String} mood 心情,可以为空
               @apiParam  {boolean} public 是否公开
               @apiParam  {boolean} status 日记状态


              @apiError {String} message token 错误,或者没有携带
              @apiSuccessExample Success-Response:
              HTTP/1.1 200 OK
              {
                "status": 1,
                "mes": "日记新建成功"
              }
              @apiErrorExample Error-Response:
              {
                  "detail": "Given token not valid for any token type",
                  "code": "token_not_valid",
                  "messages": [
                      {
                          "token_class": "AccessToken",
                          "token_type": "access",
                          "message": "Token is invalid or expired"
                      }
                  ]
              }
              '请求需要携带token '

        """
        user = request.user.id
        params = get_parameter_dic(request)
        app = get_app_config(params.get('name'))
        game_info = GameInfo.objects.get(user_id=int(user), game_id=app)
        diray = Diray.objects.create(game_info=game_info, title=params.get(
            'title'), text=params.get('content'))
        if params.get('status'):
            diray.status = params.get('status')
        if params.get('public'):
            diray.public = params.get('public')
        try:
            diray.weather = int(params.get('weather'))
            diray.mood = int(params.get('mood'))
            diray.save()
        except:
            diray.save()
        status = 1
        mes = '日记新建成功'
        info = {'id': diray.id}
        return Response({'status': status, 'mes': mes, 'info': info}, status=HTTP_200_OK)

    def put(self, request):
        """
              @api {PUT} /api/diray/ 修改日记
              @apiVersion 0.0.1
              @apiName 修改日记
              @apiGroup 萌上日记

              @apiHeader {string} Authorization jwt验证秘钥必须添加次内容请求

              @apiParam {String} id 日记id
               @apiParam {String} weather 天气 ,可以为空
              @apiParam {String} mood 心情,可以为空
               @apiParam  {boolean} public 是否公开
               @apiParam {boolean} status 日记状态


              @apiError {String} message token 错误,或者没有携带
              @apiSuccessExample Success-Response:
              HTTP/1.1 200 OK
              {
                "status": 1,
                "mes": "日记修改完成"
              }
              @apiErrorExample Error-Response:
              {
                  "detail": "Given token not valid for any token type",
                  "code": "token_not_valid",
                  "messages": [
                      {
                          "token_class": "AccessToken",
                          "token_type": "access",
                          "message": "Token is invalid or expired"
                      }
                  ]
              }
              '请求需要携带token '

        """

        params = get_parameter_dic(request)
        diray = Diray.objects.get(id=int(params.get('id')))
        if params.get('status'):
            diray.status = params.get('status')
        if params.get('public'):
            diray.public = params.get('public')
        try:
            diray.weather = int(params.get('weather'))
            diray.mood = int(params.get('mood'))
            diray.save()
        except:
            diray.save()

        status = 1
        mes = '日记修改完成'
        return Response({'status': status, 'mes': mes}, status=HTTP_200_OK)


class MailboxView(APIView):
    def get(self, request):
        """
              @api {GET} /api/mailbox/ 获取信箱
              @apiVersion 0.0.1
              @apiName 获取信箱
              @apiGroup 萌上日记

              @apiHeader {string} Authorization jwt验证秘钥必须添加次内容请求
              @apiParam {String} name 游戏名字
              @apiError {String} message token 错误,或者没有携带
              @apiSuccessExample Success-Response:
              HTTP/1.1 200 OK
              {
                "status": 1,
                "mes": "信箱信息",
                "info": [
                    {
                        "id": 1,
                        "status": false,
                        "favor": false,
                        "text": "dkfglfkldlkklgflk",
                        "title": "dlflgkkglkkl",
                        "weather": null,
                        "mood": null,
                        "img": null
                    }
                ]
              }
              @apiErrorExample Error-Response:
              {
                  "detail": "Given token not valid for any token type",
                  "code": "token_not_valid",
                  "messages": [
                      {
                          "token_class": "AccessToken",
                          "token_type": "access",
                          "message": "Token is invalid or expired"
                      }
                  ]
              }
              '请求需要携带token '

        """
        user = request.user.id
        params = get_parameter_dic(request)
        game_info = GameInfo.objects.get(user_id=int(
            user), game_id=get_app_config(params.get('name')))
        mailbox = Mailbox.objects.filter(game_info=game_info, status=False)
        if len(mailbox) > 0:
            status = 1
            mes = '信箱信息'
            info = []
            for i in mailbox:
                info.append({
                    **(model_to_dict(i, fields=['id', 'favor', 'status'])),
                    **({**(model_to_dict(i.diray, fields=['title', 'text', 'date', 'weather', 'mood'])),
                        **({'img': [j.img.url for j in DirayImage.objects.filter(diray=i.diray)]})})})
        else:
            status = 0
            mes = '信箱暂无信息'
            info = None
        return Response({'status': status, 'mes': mes, 'info': info}, status=HTTP_200_OK)

    def post(self, request):
        """
              @api {POST} /api/mailbox/ 获取一条信箱
              @apiVersion 0.0.1
              @apiName 获取一条到信箱
              @apiGroup 萌上日记

              @apiHeader {string} Authorization jwt验证秘钥必须添加次内容请求
              @apiParam {String} name 游戏名字
              @apiError {String} message token 错误,或者没有携带
              @apiSuccessExample Success-Response:
              HTTP/1.1 200 OK
              {
                "status": 1,
                "mes": "新增一条信箱"
              }
              @apiErrorExample Error-Response:
              {
                  "detail": "Given token not valid for any token type",
                  "code": "token_not_valid",
                  "messages": [
                      {
                          "token_class": "AccessToken",
                          "token_type": "access",
                          "message": "Token is invalid or expired"
                      }
                  ]
              }
              '请求需要携带token '

        """
        user = request.user.id
        params = get_parameter_dic(request)
        game_info = GameInfo.objects.get(user_id=int(
            user), game_id=get_app_config(params.get('name')))
        mailbox = [i.diray.id for i in Mailbox.objects.filter(
            game_info=game_info)]
        new_Diray = Diray.objects.filter(public=True, status=False).exclude(
            game_info=game_info, id__in=mailbox).first()
        if new_Diray:
            mail = Mailbox.objects.create(game_info=game_info, diray=new_Diray)
            status = 1
            mes = '新增一条信箱'
        else:
            status = 0
            mes = '没有公开日记了'
        return Response({'status': status, 'mes': mes}, status=HTTP_200_OK)

    def put(self, request):
        """
              @api {PUT} /api/mailbox/ 修改一条信箱
              @apiVersion 0.0.1
              @apiName 修改一条信箱
              @apiGroup 萌上日记

              @apiHeader {string} Authorization jwt验证秘钥必须添加次内容请求
              @apiParam {String} id 信箱信息id
              @apiParam {String} favor 是否收藏
              @apiParam {String} status 是否删除

              @apiError {String} message token 错误,或者没有携带
              @apiSuccessExample Success-Response:
              HTTP/1.1 200 OK
              HTTP/1.1 200 OK
              {
                "status": 1,
                "mes": "修改信箱"
              }
              @apiErrorExample Error-Response:
              {
                  "detail": "Given token not valid for any token type",
                  "code": "token_not_valid",
                  "messages": [
                      {
                          "token_class": "AccessToken",
                          "token_type": "access",
                          "message": "Token is invalid or expired"
                      }
                  ]
              }
              '请求需要携带token '

        """
        params = get_parameter_dic(request)
        mailbox = Mailbox.objects.get(id=params.get('id'))
        if params.get('status'):
            mailbox.status = params.get('status')
        if params.get('favor'):
            mailbox.favor = params.get('favor')
        mailbox.save()
        return Response({'status': 1, 'mes': '修改信箱'}, status=HTTP_200_OK)


class DirayImageView(APIView):
    def post(self, request):
        """
              @api {POST} /api/dirayImage/ 日记加图片
              @apiVersion 0.0.1
              @apiName 日记加图片
              @apiGroup 萌上日记

              @apiHeader {string} Authorization jwt验证秘钥必须添加次内容请求
              @apiParam {String} id 日记id
              @apiParam {String} img 图片内容

              @apiError {String} message token 错误,或者没有携带
              @apiSuccessExample Success-Response:
              HTTP/1.1 200 OK
              HTTP/1.1 200 OK
              {
                "status": 1,
                "mes": "上传图片"
              }
              @apiErrorExample Error-Response:
              {
                  "detail": "Given token not valid for any token type",
                  "code": "token_not_valid",
                  "messages": [
                      {
                          "token_class": "AccessToken",
                          "token_type": "access",
                          "message": "Token is invalid or expired"
                      }
                  ]
              }
              '请求需要携带token '
        """
        params = get_parameter_dic(request)
        diray = Diray.objects.get(id=params.get('id'))
        img = params.get('img')
        diray_image = DirayImage.objects.create(diray=diray, img=img)
        diray_image.save()
        status = 1
        mes = '上传图片成功'
        return Response({'status': status, 'mes': mes}, status=HTTP_200_OK)


class CodeView(APIView):
    def post(self, request):
        params = get_parameter_dic(request)
        user = MyUser.objects.get(id=request.user.id)
        try:
            import string
            codes = "".join([i.lower() if i in string.ascii_letters else i for i in params.get(
                'code')])

            c = ConvertCode.objects.get(code=codes)
            historys = CodeHistory.objects.filter(
                user_id=user, code_id=c.id)
            if len(historys) > 0:
                return Response({'status': 1, 'mes': '已经使用过'}, status=HTTP_200_OK)
            else:
                hs = CodeHistory.objects.create(user_id=user, code_id=c)
                hs.save()
                if c.arrtibute == 2:
                    c.inviald = False
                    c.save()
                return Response({'status': 1, 'mes': "兑换成功", 'info': model_to_dict(c, fields=['code', 'arrtibute', 'value'])}, status=HTTP_200_OK)
        except:
            return Response({'status': 1, 'mes': '兑换码不正确'}, status=HTTP_200_OK)


class InviterView(APIView):
    # 获取邀请信息
    def get(self, request):
        user = MyUser.objects.get(id=request.user.id)

        students = Ship.objects.filter(
            code='', inviald=True, teacher_id=user).all()
        teachers = Ship.objects.filter(
            code='', inviald=True, student_id=user).all()
        messages = Ship.objects.filter(
            inviald=False, inviter_id=user).exclude(code='').all()
        # return Response({'l':len(students),'b':len(teachers)})
        ship = []
        for m in messages:
            data = {}
            data['inviter'] = model_to_dict(m.inviter_id,
                                            fields=['nick_name', 'last_login', 'avatar_url', 'gender',
                                                    'city', 'province', 'country', 'login', 'unionId'])
            if m.teacher_id == user:
                data['ship'] = "邀请你成为他的师傅"
            else:
                data['ship'] = '邀请你成为他的徒弟'
            data['ship_id'] = m.id
            if m.code[:2] == "0x":
                ship.append(data)

        info = {
            'teachers': [model_to_dict(MyUser.objects.get(id=i.student_id.id),
                                       fields=['nick_name', 'last_login', 'avatar_url', 'gender',
                                               'city', 'province', 'country', 'login', 'unionId', ]) for i in teachers],
            'students': [model_to_dict(MyUser.objects.get(id=i.teacher_id.id),
                                       fields=['nick_name', 'last_login', 'avatar_url', 'gender',
                                               'city', 'province', 'country', 'login', 'unionId']) for i in students],
            'messages': ship,
        }
        return Response({'status': 1, 'mes': '师徒邀请信息', 'info': info}, HTTP_200_OK)

    # 获取邀请码，和发送邀请
    def post(self, request):
        user = MyUser.objects.get(id=request.user.id)
        param = get_parameter_dic(request)
        if param.get('code', '') == '':
            # ship = Ship.objects.create(inviter_id=user)
            # ship.save()
            return Response({'status': 1, 'mes': '我的邀请码', 'info': "000"+str(user.id)}, HTTP_200_OK)

        else:
            try:
                ship = Ship.objects.create(code="0x"+param.get(
                    'code'), inviter_id=MyUser.objects.get(id=param.get('code')[3:]))

                if param.get('ship', '') == '1':
                    ship.student_id = user  # 拜师
                else:
                    ship.teacher_id = user  # 收徒
                ship.save()
                return Response({'status': 1, 'mes': '发送申请成功'}, HTTP_200_OK)
            except:
                return Response({'status': 0, 'mes': '邀请码无效'}, HTTP_200_OK)
    # 同意

    def put(self, request):
        param = get_parameter_dic(request)
        if param.get('ship_id', '') == '' or param.get('res', '') == '':
            return Response({'status': 1, 'mes': '参数不足'}, HTTP_200_OK)
        else:
            ship = Ship.objects.get(id=param.get('ship_id'))
            if param.get('res') == '1':
                ship.inviald = True  # 同意
                ship.code = ""
            else:
                ship.code = ""
            ship.save()
            return Response({'status': 1, 'mes': '处理完成'}, HTTP_200_OK)


class InviterNewView(APIView):
    def get(self, request):
        user = MyUser.objects.get(id=request.user.id)
        frends = Ship.objects.filter(
            code="000"+str(user.id), inviter_id=user).all()
        inby = Ship.objects.filter(student_id=user).exclude(code="")
        inviter = [model_to_dict(i.student_id,
                                 fields=['nick_name', 'last_login', 'avatar_url', 'gender',
                                         'city', 'province', 'country', 'login', 'openid', ]) for i in frends]
        inviterby = {}

        if len(inby) > 0:
            inviterby = model_to_dict(inby[0].inviter_id, fields=['nick_name', 'last_login', 'avatar_url', 'gender',
                                                       'city', 'province', 'country', 'login', 'openid', ])
        return Response({'status': 1, 'mes': "inviter,我的邀请,inviterby,我的邀请人", 'data': {'inviter': inviter, 'inviterby': inviterby}}, HTTP_200_OK)

    def post(self, request):
        param = get_parameter_dic(request)
        user = MyUser.objects.get(id=request.user.id)
        if param.get('code', '') == '':
        # ship = Ship.objects.create(inviter_id=user)
        # ship.save()
            return Response({'status': 0, 'mes': '没有填写邀请码' }, HTTP_200_OK)

        else:
            friends = Ship.objects.filter(student_id=user.id).exclude(code="")
            if len(friends) > 0:
                return Response({'status': 0, 'mes': '已经绑定了邀请关系'}, HTTP_200_OK)
            else:
                if param.get('code')[:3] == "000" and MyUser.objects.get(id=param.get('code')[3:]):
                    ship = Ship.objects.create(code=param.get(
                        'code'), inviter_id=MyUser.objects.get(id=param.get('code')[3:]))

                    ship.student_id = user  # 拜师
                    ship.save()
                    return Response({'status': 1, 'mes': '绑定邀请关系成功'}, HTTP_200_OK)
                else:
                    return Response({'status': 0, 'mes': '邀请码无效'}, HTTP_200_OK)
