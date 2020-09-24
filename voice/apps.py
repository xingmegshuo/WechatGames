from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

__all__ = ['VoiceConfig']


class VoiceConfig(AppConfig):
    name = 'voice'
    verbose_name = _('音频信息')
