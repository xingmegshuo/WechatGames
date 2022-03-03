from random import choice
from tabnanny import verbose
from django.db import models
from django.db.models.base import Model
from user.models import APP
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from voice.models import Voice
from Mypro import settings
from django.utils.html import format_html

SUBSRAIPTION_CHOICE = ((False, '不接受订阅'), (True, '接受订阅'))
STAATUS_CHOICE = ((False, '未审核'), (True, '已经审核'))
CHECK_CHOICE = ((False, '不通过'), (True, '通过'))
OVER_CHOICE = ((False, '未完成学习'), (True, '完成学习'))
PUBLIC_CHOICE = ((False, '不公开'), (True, '公开'))
DELETE_CHOICE = ((False, '未删除'), (True, '删除'))
FAVOR_CHOICE = ((False, '不收藏'), (True, '收藏'))
CODE_CHOICE = ((1, '通用兑换码'), (2, "一次性兑换码"), (3, '月卡'))
CODETYPE_CHOICE = ((True, '随机生成'), (False, '自定义'))

WEATHER_CHOICE = (
    (0, '晴天'),
    (1, '多云'),
    (2, '雨天')
)
MOOD_CHOICE = (
    (0, '开心'),
    (1, '平静'),
    (2, '生气'),
    (3, '伤心'),
    (4, '委屈')
)

# 兑换码


class ConvertCode(models.Model):
    code = models.CharField(
        verbose_name=_('兑换码'), help_text=_('兑换码'), max_length=8, null=False, blank=True)
    value = models.CharField(
        verbose_name=_("兑换码内容"), help_text=_('兑换码内容'), max_length=5000, null=True, blank=True, default='')
    arrtibute = models.IntegerField(
        verbose_name=_('类型'), help_text=_('兑换码类型,1.通用兑换码,2.一次性兑换码,3.月卡'), choices=CODE_CHOICE)
    codeType = models.BooleanField(
        verbose_name=_('自定义或者生成'), help_text=_('true自动生成'), choices=CODETYPE_CHOICE)

    inviald = models.BooleanField(
        verbose_name=_('是否有效'), help_text=_('true有效'), default=True)

    def __str__(self):
        return self.code

    class Meta:
        verbose_name = _("兑换码信息")
        verbose_name_plural = verbose_name

# 兑换码使用记录


class CodeHistory(models.Model):
    user_id = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, verbose_name=_('用户'))
    code_id = models.ForeignKey(
        ConvertCode, on_delete=models.CASCADE, null=True, verbose_name=_('兑换码'))

    class Meta:
        verbose_name = _('兑换码使用信息')
        verbose_name_plural = verbose_name

# 好友关系


class Ship(models.Model):
    inviter_id = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name='Ship_inviter_id', null=True, verbose_name=_('发起者'))
    teacher_id = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name='Ship_teacher_id', null=True, verbose_name=_('师傅'))
    student_id = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='Ship_student_id',null=True, verbose_name=_('徒弟'))
    inviald = models.BooleanField(verbose_name=_('关系成立'), default=False)
    code = models.CharField(
        max_length=8, null=True, default="abc000"
    )

    class Meta:
        verbose_name = _('师徒关系')
        verbose_name_plural = verbose_name

# Create your models here.
# 游戏信息


class GameInfo(models.Model):
    grade = models.CharField(
        verbose_name=_('等级'), help_text=_('等级'), max_length=20, null=True, blank=True, default='1')
    score = models.CharField(
        verbose_name=_('得分'), help_text=_('得分'), max_length=20, blank=True, null=True, default='0')
    level = models.CharField(
        verbose_name=_('关卡'), help_text=_('关卡'), max_length=50, null=True, blank=True, default='1')
    property = models.CharField(
        verbose_name=_('金币钻石资源'), help_text=_('金币钻石资源'), max_length=100, blank=True, null=True,
        default='0')
    is_subscription = models.BooleanField(verbose_name=_('是否订阅'), help_text=_('是否接受订阅，默认关闭'), default=False,
                                          choices=SUBSRAIPTION_CHOICE)
    ortherInfo = models.TextField(verbose_name=_(
        '其它数据'), help_text=_('其它数据'), default='')
    user_id = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, verbose_name=_('用户'))
    game_id = models.ForeignKey(
        APP, on_delete=models.CASCADE, null=True, verbose_name=_('游戏'))

    def __str__(self):
        return self.user_id.nick_name

    class Meta:
        verbose_name = _('用户游戏信息')
        verbose_name_plural = verbose_name


# 签到记录表
class Sign(models.Model):
    date = models.DateTimeField(verbose_name=_(
        '签到时间'), help_text=_('记录签到时间'), default=timezone.now)
    game_info = models.ForeignKey(GameInfo, on_delete=models.CASCADE, verbose_name=_('签到用户'),
                                  help_text=_('签到状态与游戏角色绑定'))

    def __str__(self):
        return self.game_info.user_id.__str__()

    class Meta:
        verbose_name = _('签到记录')
        verbose_name_plural = verbose_name


# 萌游知知游戏知识库
class MengYou_knowlage(models.Model):
    img = models.ImageField(verbose_name=_('图片'), help_text=_(
        '学习图片'), upload_to='MengYou', null=True)
    title = models.CharField(max_length=500, verbose_name=_(
        '标题'), help_text=_('标题'), null=True)
    voice = models.URLField(verbose_name=_('音频数据'), help_text=_('此知识的语音数据'),
                            blank=True, null=True)
    text = models.TextField(verbose_name=_(
        '文本内容'), help_text=_("文本内容"), null=True)
    level = models.CharField(max_length=50, verbose_name=_(
        '此条知识适合学习的等级'), help_text=_('学习等级'), default='1')
    need = models.CharField(max_length=10, help_text=_(
        '学习所需时间,小时单位，请填写多少小时,默认为1'), verbose_name=_('时间'), default='1')
    is_check = models.BooleanField(verbose_name=_('是否经过审核'), help_text=_('是否审核过,False 未审核，待审核,True 已经审核过'),
                                   default=False, choices=STAATUS_CHOICE)
    status = models.BooleanField(verbose_name=_('审核状态'), help_text=_('审核状态，false未通过，True通过'), default=False,
                                 choices=CHECK_CHOICE)

    def pass_audit_str(self):
        parameter_str = 'id={}&status={}'.format(
            str(self.pk), str(self.status))
        # if self.is_check is False:
        status = '×'
        title = '不通过'
        if self.status is False:
            status = '√'
            title = '通过'

        btn_str = '<a class="btn " href="{}" rel="external nofollow" >' \
                  '<input ' \
                  'type="button" id="passButton" ' \
                  'title="' + title + '" value="' + status + '" >' \
                                                             '</a>'
        return format_html(btn_str, '/passNo/?{}'.format(parameter_str))

    pass_audit_str.short_description = _('审核操作')

    def __str__(self):
        return self.title

    def my_voice(self):
        try:
            voice = Voice.objects.get(name=self.title)
            # voice.save()
        except:
            voice = Voice.objects.create(content=self.text, name=self.title)

        self.voice = "https://www.menguoli.com" + voice.url.url

    def save(self, *args, **kwargs):
        self.my_voice()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _('萌游知知，知识审核')
        verbose_name_plural = verbose_name


# 萌游知知知识学习记录
class MengYou_recoding(models.Model):
    game_info = models.ForeignKey(GameInfo, on_delete=models.CASCADE, verbose_name=_('学习用户'),
                                  help_text=_('学习状态与游戏角色绑定'))
    knowlage = models.ForeignKey(MengYou_knowlage, on_delete=models.CASCADE, verbose_name=_('知识'),
                                 help_text=_('游戏角色与知识id绑定有此条记录说明该角色学习过或正在学习'), related_name='knowlage_recod')
    is_over = models.BooleanField(verbose_name=_('是否学习完毕'), help_text=_(
        '学习状态'), default=False, choices=OVER_CHOICE)
    send_time = models.DateTimeField(verbose_name=_(
        '发送订阅消息时间'), help_text=_('学习完成时间'), null=True)

    def on_save(self):
        import datetime
        if self.game_info.is_subscription is True:
            self.send_time = datetime.datetime.now(
            ) + datetime.timedelta(hours=float(self.knowlage.need))

    def save(self, *args, **kwargs):
        self.on_save()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _('萌游知知，学习记录')
        verbose_name_plural = verbose_name


# 萌上日记 日记表
class Diray(models.Model):
    game_info = models.ForeignKey(GameInfo, on_delete=models.CASCADE, verbose_name=_('日记用户'),
                                  help_text=_('日记与游戏角色绑定'))
    text = models.TextField(verbose_name=_(
        '日记内容'), help_text=_("日记内容"), null=True)
    date = models.DateTimeField(verbose_name=_(
        '日记时间'), help_text=_('日记时间'), auto_now_add=True)
    title = models.CharField(
        max_length=200, verbose_name=_('日记标题'), help_text=_('日记标题'))
    weather = models.IntegerField(verbose_name=_('天气状态'), help_text=_('天气状态'), choices=WEATHER_CHOICE, null=True,
                                  blank=True)
    mood = models.IntegerField(verbose_name=_('心情状态'), help_text=_(
        '心情状态'), choices=MOOD_CHOICE, null=True, blank=True)
    public = models.BooleanField(verbose_name=_('是否公开'), help_text=_(
        '是否公开'), default=True, choices=PUBLIC_CHOICE)
    status = models.BooleanField(verbose_name=_('是否删除'), help_text=_(
        '是否删除'), default=False, choices=DELETE_CHOICE)

    def __str__(self):
        return self.game_info.user_id.__str__() + '-' + self.title

    class Meta:
        ordering = ('-date',)
        verbose_name = _('萌上日记,日记库')
        verbose_name_plural = verbose_name


# 萌上日记 信箱表
class Mailbox(models.Model):
    game_info = models.ForeignKey(GameInfo, on_delete=models.CASCADE, verbose_name=_('日记用户'),
                                  help_text=_('信箱与游戏角色绑定'))
    diray = models.ForeignKey(
        Diray, on_delete=models.CASCADE, verbose_name=_('日记'), help_text=_('日记'))
    status = models.BooleanField(verbose_name=_('是否删除'), help_text=_(
        '是否删除'), default=False, choices=DELETE_CHOICE)
    date = models.DateTimeField(verbose_name=_(
        '日记进入时间'), help_text=_('日记进入时间'), auto_now_add=True)
    favor = models.BooleanField(verbose_name=_('是否收藏'), help_text=_(
        '是否收藏'), default=False, choices=FAVOR_CHOICE)

    def __str__(self):
        return self.game_info.user_id.__str__() + '-' + self.diray.title

    class Meta:
        ordering = ('-date',)
        verbose_name = _('萌上日记,信箱')
        verbose_name_plural = verbose_name


# 萌上日记 图片表
class DirayImage(models.Model):
    diray = models.ForeignKey(
        Diray, on_delete=models.CASCADE, verbose_name=_('日记图片'), help_text=_('日记图片'))
    img = models.ImageField(verbose_name=_('图片'), help_text=_(
        '日记图片'), upload_to='MengShang', null=True, blank=True)

    def __str__(self):
        return self.diray.game_info.user_id.__str__() + '-' + self.diray.title

    class Meta:
        verbose_name = _('萌上日记,图片库')
        verbose_name_plural = verbose_name


# 游戏广告表
class Advertising(models.Model):
    title = models.CharField(
        max_length=200, verbose_name=_('游戏名字'), help_text=_('游戏名字'))
    logo = models.ImageField(verbose_name=_('图片'), help_text=_('游戏图片144*144大小'), upload_to='game', null=True,
                             blank=True)
    appid = models.CharField(
        max_length=200, verbose_name=_('appid'), help_text=_('appid'))
    status = models.BooleanField(verbose_name=_('是否删除'), help_text=_(
        '是否删除'), default=False, choices=DELETE_CHOICE)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _('游戏广告')
        verbose_name_plural = verbose_name
