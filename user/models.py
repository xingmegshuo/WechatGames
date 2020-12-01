from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
# Create your models here.
from django.utils import timezone
import hashlib
from django.conf import settings
from django.utils.html import format_html

USER_CHOICE = ((False, '未授权'), (True, '授权'))
ON_LINE_CHOICE = (('0', '不启用'), ('1', '启用'))
DELETE_CHOICE = ((False, '未删除'), (True, '删除'))


# 项目
class APP(models.Model):
    img = models.FileField(verbose_name=_('图片'), upload_to='game', null=True, default='img-slide-5.jpg',
                           help_text=_('分享页面的图片'))
    name = models.CharField(verbose_name=_('游戏名字'), max_length=100, help_text=_('游戏名称,尽量不用中文, 每次请求携带'))
    app_id = models.CharField(verbose_name=_('APP_ID'), max_length=100, help_text=_('小游戏发布微信平台配置，获取用户信息必须'))
    secret = models.CharField(verbose_name=_('密钥'), max_length=200, help_text=_('小游戏发布微信平台配置，获取用户信息必须'))
    on_line = models.CharField(max_length=20, default='0', verbose_name=_('是否启动'), choices=ON_LINE_CHOICE)

    def __str__(self):
        try:
            return App_config.objects.filter(app_id=self.id, name='name')[0].value
        except:
            return self.name

    class Meta:
        verbose_name = _('项目')
        verbose_name_plural = verbose_name


# 微信用户扩展
class MyUser(AbstractUser):
    openid = models.CharField(
        verbose_name=_('微信OpenID'), help_text=_('微信OpenID'), max_length=100, null=True, blank=True)
    unionId = models.CharField(
        verbose_name=_('唯一标识'), help_text=_('不同app之间区分用户'), max_length=100, null=True, blank=True)
    avatar_url = models.URLField(
        verbose_name=_('头像'), help_text=_('头像'), null=True, blank=True)
    nick_name = models.CharField(
        verbose_name=_('昵称'), help_text=_('昵称'), max_length=100, null=True, blank=True, default='未知玩家')
    gender = models.SmallIntegerField(
        verbose_name=_('性别'), help_text=_('性别'), choices=((1, '男'), (2, '女'), (0, '未知')), null=True, blank=True)
    language = models.CharField(
        verbose_name=_('语言'), help_text=_('语言'), max_length=100, null=True, blank=True)
    city = models.CharField(
        verbose_name=_('城市'), help_text=_('城市'), max_length=200, null=True, blank=True)
    province = models.CharField(
        verbose_name=_('省份'), help_text=_('省份'), max_length=200, null=True, blank=True)
    country = models.CharField(
        verbose_name=_('国家'), help_text=_('国家'), max_length=200, null=True, blank=True)
    create_time = models.DateTimeField(verbose_name=_("创建时间"), help_text=_('创建时间'), default=timezone.now)
    login = models.DateTimeField(verbose_name=_('登录时间'), default=timezone.now)
    last_login = models.DateTimeField(verbose_name=_('上次登录时间'), null=True)
    date_of_birth = models.DateField(verbose_name=_('出生日期'), help_text=_('出生日期'), null=True, blank=True)
    desc = models.TextField(verbose_name=_('描述'), help_text=_('描述'), max_length=2000, null=True, blank=True)
    is_auth = models.BooleanField(verbose_name=_('是否被授权'), help_text=_('是否被授权'), default=False, choices=USER_CHOICE)

    def create_username_password(self):
        if not self.username and not self.password and self.openid:
            key = settings.SECRET_KEY
            self.username = hashlib.pbkdf2_hmac(
                "sha256", getattr(self, 'openid').encode(encoding='utf-8'), key.encode(encoding='utf-8'), 10).hex()
            self.password = hashlib.pbkdf2_hmac(
                "sha256", self.username.encode(), getattr(self, 'openid').encode(encoding='utf-8'), 10).hex()

    def save(self, *args, **kwargs):
        self.create_username_password()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nick_name

    class Meta(AbstractUser.Meta):
        ordering = ('-login',)
        swappable = 'AUTH_USER_MODEL'
        verbose_name = _('用户')
        verbose_name_plural = verbose_name


# 自定义配置参数表
class App_config(models.Model):
    name = models.CharField(max_length=200, verbose_name=_('变量名'), help_text=_('增加配置变量名'), null=True, blank=True)
    type = models.CharField(max_length=200, verbose_name=_('类型'), help_text=_('启动参数类型'), null=True, blank=True)
    value = models.CharField(max_length=200, verbose_name=_('值'), help_text=_('启动参数的值'), null=True, blank=True)
    description = models.CharField(max_length=200, verbose_name=_('参数说明'), help_text=_('启动参数描述，说明'), null=True,
                                   blank=True)
    orther = models.CharField(max_length=100, verbose_name=_('其他'), help_text=_('其他'), null=True, blank=True)
    on_line = models.CharField(max_length=20, default='0', verbose_name=_('是否启动'), choices=ON_LINE_CHOICE)
    app_id = models.ForeignKey(APP, on_delete=models.CASCADE, verbose_name=_('所属app'), related_name='app_config')

    def __str__(self):
        return self.value

    def pass_audit_str(self):
        parameter_str = 'id={}&status={}'.format(str(self.pk), str(self.on_line))
        status = '×'
        title = '停止'
        if self.on_line == '0':
            status = '√'
            title = '启动'

        btn_str = '<a class="btn " href="{}" rel="external nofollow" >' \
                  '<input ' \
                  'type="button" id="passButton" ' \
                  'title="' + title + '" value="' + status + '" >' \
                                                             '</a>'
        return format_html(btn_str, '/startConfig/?{}'.format(parameter_str))

    pass_audit_str.short_description = _('启动操作')

    class Meta:
        verbose_name = _('项目配置')
        verbose_name_plural = verbose_name


# 访问网站的ip地址和次数
class Userip(models.Model):
    ip = models.CharField(verbose_name='IP地址', max_length=30)  # ip地址
    name = models.CharField(verbose_name=_('用户'), help_text=_('name'), max_length=200, default='unknow')
    count = models.IntegerField(verbose_name='访问次数', default=1)  # 该ip访问次数
    area = models.CharField(verbose_name=_('地区'), help_text=_('地区'), max_length=200)
    country = models.CharField(verbose_name=_('国家'), help_text=_('国家'), max_length=200)
    province = models.CharField(verbose_name=_('省份'), help_text=_('省份'), max_length=200)
    city = models.CharField(verbose_name=_('城市'), help_text=_('城市'), max_length=200)
    LaL = models.CharField(verbose_name=_('经纬度'), help_text=_('经纬度'), max_length=200)
    Tl = models.CharField(verbose_name=_('时区'), help_text=_('时区'), max_length=200)

    class Meta:
        verbose_name = '游戏访问用户ip'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.ip


# 用户登录记录
class RecordLogin(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, verbose_name=_('用户'), help_text=_('用户'))
    game = models.ForeignKey(APP, on_delete=models.CASCADE, verbose_name='游戏', help_text=_('游戏'), null=True, blank=True)
    login_time = models.DateTimeField(verbose_name=_('登录时间'), help_text=_('登录时间'), auto_now_add=True)

    def __str__(self):
        return self.user.nick_name

    class Meta:
        verbose_name = '用户登录记录表'
        verbose_name_plural = verbose_name


# 用户收货地址  用户敏感信息 建议加密
class Address(models.Model):
    unionId = models.CharField(max_length=200, help_text=_('用户唯一标识'), verbose_name=_('用户标识'))
    human = models.CharField(max_length=200, verbose_name=_('收货人'), help_text=_('收货人'))
    phone = models.CharField(max_length=20, verbose_name=_('电话号码'), help_text=_('电话号码'))
    address = models.CharField(max_length=200, verbose_name=_('收货地址'), help_text=_('收货地址'))
    is_show = models.BooleanField(verbose_name=_('是否删除'), help_text=_('用户删除不做物理删除'), default=False,
                                  choices=DELETE_CHOICE)
    is_default = models.BooleanField(verbose_name=_('是否为默认地址'), help_text=_('设置默认地址'), default=False)

    class Meta:
        verbose_name = '收货地址'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.human
