from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from django.db.models import signals
from django.dispatch import receiver
from web.models import VisitNumber
import datetime
from django.utils.timezone import utc
import json

# Create your models here.

CONFIG = {
    'send_mes': '发送订阅消息',
    'change_status': '监听状态',
    'test': '测试代码',
    'analyze_data': '分析数据'
}

TYPE_CHOICE = (
    ('date', '一次任务'),
    ('interval', '周期任务'),
    ('cron', 'corn任务')
)
STATUS_CHOICES = (
    (True, '任务已经添加'),
    (False, '任务等待添加')
)

NAME_CHOICES = (
    ('send_mes', CONFIG['send_mes']),
    ('change_status', CONFIG['change_status']),
    ('test', CONFIG['test']),
    ('analyze_data', CONFIG['analyze_data']),
)


class Jobs(models.Model):
    name = models.CharField(max_length=200, verbose_name=_('任务名称'), help_text=_('任务名称，描述任务做什么的'), default='send_mes',
                            choices=NAME_CHOICES, unique=True)
    jobType = models.CharField(max_length=10, verbose_name=_('任务类型'), help_text=_('任务类型'), default='date',
                               choices=TYPE_CHOICE)
    on_line = models.BooleanField(verbose_name=_('是否添加'), help_text=_('是否添加'), default=False, choices=STATUS_CHOICES)
    create_date = models.DateTimeField(verbose_name=_('任务创建时间'), help_text=_('任务创建时间'), auto_now_add=True)
    is_over = models.BooleanField(verbose_name=_('是否全部完成'), help_text=_('是否全部完成'), default=False)
    status = models.BooleanField(verbose_name=_('是否启动'), help_text=_('是否启动'), default=False)

    def pass_audit_str(self):
        parameter = 'id={}&status={}'.format(str(self.pk), str(self.on_line))
        status = '×'
        title = '暂停'
        if self.status is True:
            status = '√'
            title = '继续'
        if self.jobType == 'date':
            status = '-'
            title = '不允许操作'

        btn_str = '<a class="btn " href="{}" rel="external nofollow" >' \
                  '<input ' \
                  'type="button" id="passButton" ' \
                  'title="' + title + '" value="' + status + '" >' \
                                                             '</a>'
        return format_html(btn_str, '/startJob/?{}'.format(parameter))

    pass_audit_str.short_description = _('任务状态')

    def __str__(self):
        return CONFIG[self.name]

    # def save(self, *args, **kwargs):
    #     self.on_save()
    #     super().save(*args, **kwargs)

    class Meta:
        ordering = ['-create_date', ]
        verbose_name = _('任务列表')
        verbose_name_plural = verbose_name


class Job(models.Model):
    job = models.ForeignKey(Jobs, verbose_name=_('任务分类'), help_text=_('任务分类'), on_delete=models.CASCADE)
    next_run = models.CharField(max_length=100, verbose_name=_('下次执行时间'), help_text=_('下次执行时间'), null=True)
    parameters = models.CharField(max_length=500, verbose_name=_('参数'), help_text=_('参数'), blank=True, null=True)
    # group = models.CharField(max_length=20, verbose_name=_('分组'), help_text=_('分组'), blank=True)
    on_line = models.BooleanField(verbose_name=_('是否添加'), help_text=_('是否添加'), default=False, choices=STATUS_CHOICES)
    is_over = models.BooleanField(verbose_name=_('是否完成'), help_text=_('是否完成'), default=False)

    def on_save(self):
        self.job.is_over = False
        self.job.on_line = False
        self.job.save()

    def save(self, *args, **kwargs):
        self.on_save()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-next_run']
        verbose_name = '子任务'
        verbose_name_plural = verbose_name


@receiver(signals.post_save, sender=Jobs)
def my_model_post_save(sender, instance, created, *args, **kwargs):
    if created:
        try:
            j = Jobs.objects.get(name='change_status')
        except:
            j = Jobs.objects.create(name='change_status', jobType='date')
            j.save()
        if instance.name == 'test':
            for i in range(1, 3):
                job = Job.objects.create(job=instance,
                                         next_run=datetime.datetime.utcnow().replace(tzinfo=utc) + datetime.timedelta(
                                             seconds=i * 10))
                # Job.objects.create(job=j,
                #                    next_run=job.next_run + datetime.timedelta(seconds=3),
                #                    parameters=json.dumps({'job': 'Job', 'id': str(job.id)}))
            # v = Job.objects.filter(job=instance)
            # run_time = max([i.next_run for i in v])
            # Job.objects.create(job=j,
            #                    next_run=run_time + datetime.timedelta(seconds=5),
            #                    parameters=json.dumps({'job': 'Jobs', 'id': str(instance.id)}))


@receiver(signals.post_save, sender=Job, weak=False)
def model_post_save(sender, created, instance, *args, **kwargs):
    if created:
        main_job = Jobs.objects.get(name='change_status')
        instance.job.on_line = False
        instance.job.save()
        if instance.job.name not in ['change_status', 'analyze_data']:
            Job.objects.create(job=main_job, next_run=instance.next_run + datetime.timedelta(seconds=2),
                               parameters=json.dumps({'job': 'Job', 'id': str(instance.id)}))
