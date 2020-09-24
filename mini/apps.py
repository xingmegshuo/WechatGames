from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

__all__ = ['MiniConfig']


class MiniConfig(AppConfig):
    name = 'mini'
    verbose_name = _('小程序')
