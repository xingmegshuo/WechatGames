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
from web.views import scheduler
from job.views import send_mes, change_status
from .serializers import KnowlageSerializer


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

            @apiError {String} status 请求状态
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
            logger.info(request.user + '用户签到成功')
            return Response({
                'status': 1,
                'mes': 'ok,今日签到成功！',
                'time': [model_to_dict(
                    sign,
                    fields=['date']
                ) for sign in sign_info]
            }, status=HTTP_200_OK)
        elif len(sign_info) == 7:
            logger.info(request.user + '七日签到完成')
            return Response({'status': 0, 'mes': 'error, 七日签到完成', 'time': [model_to_dict(
                sign,
                fields=['date']
            ) for sign in sign_info]}, status=HTTP_204_NO_CONTENT)
        else:
            return Response({
                'status': 1,
                'mes': '今日签到已完成！',
                'time': [model_to_dict(
                    sign,
                    fields=['date']
                ) for sign in sign_info]
            }, status=HTTP_200_OK)


class KnowView(APIView):
    def get(self, request):
        """
            @api {GET} /api/knowlage/ 知识学习状态
            @apiVersion 0.0.1
            @apiDescription 获取用户关于此知识的学习状态
            @apiName 知识学习状态
            @apiGroup 萌游知知
            @apiHeader {string} Authorization jwt验证秘钥必须添加次内容请求

            @apiParam {String} name 游戏名字，参数必须
            @apiParam {String} id 知识唯一标识id

            @apiSuccess {String} status 请求状态
            @apiSuccess {String} mes 提示信息
            @apiSuccessExample Success-Response:
            HTTP/1.1 200 OK
            确定开始学习
            {
                'status': 1,
                'mes': '用户开始学习此知识'
             }
             已经开始学习了，等待学习完才能开始新的
            {
                "status": 0,
                "mes": "知识学习开始学习"
            }
        """
        params = get_parameter_dic(request)
        user = request.user.id
        game_info = GameInfo.objects.get(user_id=int(user),
                                         game_id=int(get_app_config(params.get('name')).id))
        recoding = MengYou_recoding.objects.filter(game_info=game_info, knowlage_id=params.get('id'))
        if len(recoding) == 0:
            recoding = MengYou_recoding.objects.create(game_info=game_info, knowlage_id=params.get('id'))
            # 用户接受订阅
            if game_info.is_subscription is True:
                pass
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
                game_info.is_subscription = False
                game_info.save()
            scheduler.add_job(change_status, 'date', id='MYCH' + str(recoding.id), run_date=recoding.send_time,
                              args=[recoding])
            return Response({'status': 1, 'mes': '用户开始学习此知识'}, status=HTTP_200_OK)
        else:
            return Response({'status': 0, 'mes': '已经开始学习'}, status=HTTP_200_OK)

    def post(self, request):
        """"
        :return 随机返回未学习过的知识
        @api {POST} /api/knowlage/ 获取知识
        @apiVersion 0.0.1
        @apiDescription 获取学习知识，随机返回
        @apiName 获取知识
        @apiGroup 萌游知知

        @apiHeader {string} Authorization jwt验证秘钥必须添加次内容请求

        @apiParam {String} name 游戏名字，参数必须
        @apiParam {String} over 已经学习过的数据，参数可选，不携带就是随机获取一条数据，携带就是获取学习过数据


        @apiSuccess {String} status 请求状态
        @apiSuccess {String} mes 提示信息
        @apiSuccess {json} knowlage 返回的知识数据
        @apiSuccess {json} knowlage 学习过的知识
        @apiSuccess {json} knowlageing 学习中

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

            “knowlage_ing”:[
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
        knowlage_ing = None
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
        else:
            knowlage = MengYou_knowlage.objects.filter(
                id__in=[i.knowlage.id for i in MengYou_recoding.objects.filter(game_info=game_info, is_over=True)],
                status=True)
            status = 1
            mes = '已经学习过知识'
            knowlage = [model_to_dict(know, fields=['id', 'title', 'voice', 'text', 'img.url', 'level', 'status']) for
                        know in
                        knowlage]
            knowlage_ing = MengYou_knowlage.objects.filter(
                id__in=[i.knowlage.id for i in MengYou_recoding.objects.filter(game_info=game_info, is_over=False)],
                status=True)
            knowlage_ing = [
                {**(model_to_dict(know, fields=['id', 'title', 'voice', 'text', 'img.url', 'level', 'status'])),
                 **(model_to_dict(know.knowlage_recod, fields=['send_time']))}
                for
                know in
                knowlage_ing]
        return Response({
            'status': status,
            'mes': mes,
            'knowlage': knowlage,
            'knowlage_ing': knowlage_ing,
        }, status=HTTP_200_OK)

    def put(self, request):
        # to do 修改学习完成的时间
        """
            @api {PUT} /api/knowlage/ 更新知识状态
            @apiVersion 0.0.1
            @apiDescription 更新知识学习完成时间，根据知识所需时间添加定时任务，在过程中，用户观看广告减少时间
            @apiName 更新知识学习完成时间
            @apiGroup 萌游知知
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
        recoding = MengYou_recoding.objects.filter(game_info=game_info, knowlage_id=params.get('id'))
        # 分钟为单位
        shorten_time = params.get('time')
        recoding.send_time = recoding.send_time - datetime.timedelta(minutes=float(shorten_time))
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
        cod = params.get('cod', None)
        As_ds = params.get('As_ds', None)
        num = params.get('num', 100)

        try:
            if As_ds == None or As_ds == 'as':
                game_info = GameInfo.objects.all().order_by('-' + cod)[:num]
            else:
                game_info = GameInfo.objects.all().order_by(cod)[:num]
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
    queryset = MengYou_knowlage.objects.all().filter(is_check=True, status=True).order_by('id')
    serializer_class = KnowlageSerializer


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
        logger.info(game_info.id)
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
            @apiName 更新游戏配置信息
            @apiGroup GAME

            @apiHeader {string} Authorization jwt验证秘钥必须添加此内容请求

            @apiParam {String} name 小游戏名字,区分该用户玩过多款小游戏
            @apiParam {String} gameInfo_value 更新哪个内容就传递什么参数和值,可以传递一个或多个


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