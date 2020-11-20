from django.db import models
from django.utils.translation import gettext_lazy as _
from Mypro import settings
from .utils import Tab, product_sail, user_today, user_local, weak_user, weak_app
import datetime

TYPE_CHOICE = (
    ('0', '每日分析'),
    ('1', '每周分析'),
    ('2', '月度分析')
)


# Create your models here.


class Analysis(models.Model):
    creat_date = models.DateField(verbose_name=_('分析日期'), help_text=_('分析日期'), auto_now_add=True)
    title = models.CharField(verbose_name=_('名字'), help_text=_('名字'), max_length=200)
    table_type = models.CharField(verbose_name=_('类型'), help_text=_('类型'), max_length=200, default='0',
                                  choices=TYPE_CHOICE)
    # url = models.URLField(verbose_name=_('分析结果可视化'), help_text=_('可视化结果地址'), blank=True)
    url = models.FileField(verbose_name=_('地址'), help_text=_('分析结果'), upload_to='analy')

    def on_save(self):
        # self.url = settings.MEDIA_URL + 'analy/' + self.title + self.table_type + '.html'
        tab = Tab()
        if self.table_type == '0':
            tab.add(user_today(str(datetime.datetime.now().date()) + '今日游戏用户注册/活跃/留存分析'), '每日用户注册/活跃/留存人数')
            tab.add(user_local(str(datetime.datetime.now().date()) + '用户地理位置分布'), '地理分布')

        if self.table_type == '1':
            tab.add(weak_user('上周用户活跃/增长'), '增长/活跃分析')
            tab.add(weak_app('上周游戏活跃人数'), '游戏活跃人数')
        if self.table_type == '2':
            pass
        tab.render(
            settings.MEDIA_ROOT + '/analy/' + self.title + str(datetime.date.today()) + '_' + self.table_type + '.html')
        self.url.name = 'analy/' + self.title + str(datetime.date.today()) + '_' + self.table_type + '.html'

    def save(self, *args, **kwargs):
        self.on_save()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _('数据分析')
        verbose_name_plural = verbose_name
#
# @receiver(signals.post_save, sender=Analysis)
# def post_save(sender, instance, created, *args, **kwargs):
#
