from django.shortcuts import render
from user.views import APIView, get_parameter_dic, Response, logger
from rest_framework.status import *
from .models import *


# Create your views here.

class GetVoiceView(APIView):
    """
            @api {POST} /api/get_voice/ 生成音频数据接口
            @apiVersion 0.0.1
            @apiName 文字转音频
            @apiGroup GAME

            @apiHeader {string} Authorization jwt验证秘钥必须添加次内容请求

            @apiParam {String} name 文件名字 参数可选
            @apiParam {String} text 文本内容 参数必须
            @apiParam {string} human 说话人 参数可选

            @apiError {String} status 请求状态1,成功,0失败
            @apiError {String} mes 信息提示
            @apiSuccess {String} voice_url 音频文件url


            @apiSuccessExample Success-Response:
            HTTP/1.1 200 OK
            {
                'status': 1,
                "voice_url":"static/voice/talk.mp3"
            }
            '更新后的内容'

            @apiError {String} mes 错误提示

            @apiErrorExample Error-Response:
            {
                'status': 0,
                "mes": "没有必须参数text"
            }
            '没有传递要修改的参数，也需要携带token否则就是post的错误提示'
    """

    def post(self, request):
        """
        音频请求，传递文字，通过科大讯飞接口转换为音频，返回音频链接
        :param request: name 文件名,text 文本内容, human 说话人
        :return: voice url
        """
        params = get_parameter_dic(request)
        name = params.get('name', 'demo')
        text = params.get('text', None)
        human = params.get('human', 'xiaoyan')
        if text is None:
            return Response({
                'status': 0,
                'error': '没有必须参数，text'
            }, status=HTTP_204_NO_CONTENT)
        else:
            try:
                voice = Voice.objects.get(content=text, name=name, human=human)
            except:
                voice = Voice(content=text, human=human, name=name)
                voice.save()
            logger.info('文字转语音')
            return Response({
                'status': 1,
                'voice_url': voice.url
            }, status=HTTP_200_OK)
