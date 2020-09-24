from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

__all__ = ['GamesConfig']


class GamesConfig(AppConfig):
    name = 'games'
    verbose_name = _('游戏信息')
