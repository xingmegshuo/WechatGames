from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

__all__ = ['WebConfig']


# web 电脑客户端

class WebConfig(AppConfig):
    name = 'web'
    verbose_name = _('网站信息')
