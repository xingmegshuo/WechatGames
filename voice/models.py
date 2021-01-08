from django.db import models
from django.utils.translation import gettext_lazy as _
# Create your models here.
from .request_util import make_voice
from Mypro import settings

LANGUAGECHOICE = (
    (1, '中文'),
    (2, '英文')
)

SOUNDCHOICE = (
    (0, '默认声音'),
    (5, '中度声音'),
    (9, '大声一点')
)
HUMANCHOICE = (
    (0, '云小宁-女'),
    (1, '云小奇-男'),
    (101015, '智萌-男孩'),
    (101016, '智甜-女孩')

)


# 音频
class Voice(models.Model):
    img = models.FileField(verbose_name=_('图片'), upload_to='game', null=True, default='mp.png')
    name = models.CharField(
        verbose_name=_('文件名'), help_text=_('文件名'), max_length=50, unique=True, blank=True, null=True, default='demo')
    content = models.CharField(
        verbose_name=_('文本内容'), help_text=_('文本内容'), max_length=6000, null=True, blank=True)
    human = models.IntegerField(
        verbose_name=_('说话人'), help_text=_('说话人可选'), null=True, blank=True, choices=HUMANCHOICE,
        default=101016)

    url = models.FileField(
        verbose_name='链接', help_text='音频地址', unique=True, upload_to='voice', null=True, blank=True)
    language = models.IntegerField(verbose_name=_("转换语言"), help_text=_("转换语言"), default=1, choices=LANGUAGECHOICE)
    sound = models.IntegerField(verbose_name=_('说话声音'), help_text=_('说话声音大小'), default=5, choices=SOUNDCHOICE)

    def makeVoice(self, name):
        data = {'text': self.content, 'id': '001', 'language': self.language, 'speed': 0,
                'speaker': self.human, 'sound': self.sound, 'name': settings.MEDIA_ROOT + '/voice/' + name}
        make_voice(data)

    # def on_open(ws):
    #     def run(*args):
    #         d = {"common": wsParam.CommonArgs,
    #              "business": wsParam.BusinessArgs,
    #              "data": wsParam.Data,
    #              }
    #         d = json.dumps(d)
    #         print("------>开始发送文本数据")
    #         ws.send(d)
    #         if os.path.exists(settings.MEDIA_ROOT + '/voice/' + wsParam.name + '.mp3'):
    #             os.remove(settings.MEDIA_ROOT + '/voice/' + wsParam.name + '.mp3')
    #
    #     thread.start_new_thread(run, ())
    #
    # def on_message(ws, message):
    #     try:
    #         message = json.loads(message)
    #         code = message["code"]
    #         sid = message["sid"]
    #         audio = message["data"]["audio"]
    #         audio = base64.b64decode(audio)
    #         status = message["data"]["status"]
    #         # print(message)
    #         if status == 2:
    #             print("ws is closed")
    #             ws.close()
    #         if code != 0:
    #             errMsg = message["message"]
    #             print("sid:%s call error:%s code is:%s" % (sid, errMsg, code))
    #         else:
    #             with open(settings.MEDIA_ROOT + '/voice/' + wsParam.name + '.mp3', 'ab') as f:
    #                 f.write(audio)
    #
    #     except Exception as e:
    #         print("receive msg,but parse exception:", e)
    #
    # wsParam = Ws_Param(Text=self.content, human=self.human, name=self.name)
    # websocket.enableTrace(False)
    # wsUrl = wsParam.create_url()
    # ws = websocket.WebSocketApp(wsUrl, on_message=on_message, on_error=on_error, on_close=on_close)
    # ws.on_open = on_open
    # ws.run_forever(sslopt={"cert_reqs": ssl.CERT_NONE})

    def save(self, *args, **kwargs):
        import datetime
        name = datetime.datetime.now().strftime("%Y-%m-%d-%H:%M:%S")
        self.makeVoice(name)
        self.url.name = 'voice/' + name + '.mp3'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _('音频')
        verbose_name_plural = verbose_name
