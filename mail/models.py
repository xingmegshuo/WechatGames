from django.db import models
# Create your models here.
# 游戏邮件管理
from games.models import GameInfo
from user.models import APP
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

MAILCHOICE = (
    (0, "在线奖励"),
    (1, "所有人奖励")
)

ONLINECHOICE = (
    (0, "显示"),
    (1, "不显示")
)


class Mail(models.Model):
    title = models.CharField(max_length=300, verbose_name=_('邮件标题'), help_text=_("邮件标题"))
    date = models.DateTimeField(default=timezone.now(), verbose_name=_('邮件时间'), help_text=_('邮件时间'))
    text = models.TextField(verbose_name=_('邮件内容'), help_text=_('邮件内容'))
    online = models.IntegerField(default=0, choices=ONLINECHOICE, verbose_name=_('个人邮件是否删除'), help_text=_('个人邮件'))
    game_info = models.ForeignKey(GameInfo, on_delete=models.CASCADE, verbose_name=_('邮件用户'),
                                  help_text=_('邮件与游戏角色绑定'))

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _('个人邮件')
        verbose_name_plural = verbose_name


class SysMail(models.Model):
    title = models.CharField(max_length=300, verbose_name=_('邮件标题'), help_text=_("邮件标题"))
    date = models.DateTimeField(default=timezone.now(), verbose_name=_('邮件时间'), help_text=_('邮件时间'))
    until_date = models.DateTimeField(verbose_name=_("过期时间"), help_text=_('邮件过期时间'))
    game = models.ForeignKey(APP, on_delete=models.CASCADE, verbose_name=_('选择游戏'), help_text=_('选择游戏'))
    text = models.TextField(verbose_name=_('邮件内容'), help_text=_('邮件内容'))
    # online = models.IntegerField(default=0, choices=ONLINECHOICE, verbose_name=_('个人邮件是否删除'), help_text=_('个人邮件'))
    game_info = models.ManyToManyField(GameInfo, verbose_name=_('邮件用户'), help_text=_('邮件与游戏角色绑定'))
    type = models.IntegerField(default=0, choices=MAILCHOICE, verbose_name=_('系统邮件类型'), help_text=_('系统邮件类型'))

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _('系统邮件')
        verbose_name_plural = verbose_name
