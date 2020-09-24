from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

__all__ = ['AnalyConfig']


class AnalyConfig(AppConfig):
    name = 'analy'
    verbose_name = _('分析模块')
