from django.apps import AppConfig

from django.utils.translation import gettext_lazy as _

__all__ = ['JobConfig']


class JobConfig(AppConfig):
    name = 'job'
    verbose_name = _('任务管理')
