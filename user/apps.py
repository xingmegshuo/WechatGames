from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

__all__ = ['UserConfig']


# 用户管理，各种配置信息
class UserConfig(AppConfig):
    name = 'user'
    verbose_name = _('用户管理')
