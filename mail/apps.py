from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

__all__ = ['MailConfig']


class MailConfig(AppConfig):
    name = 'mail'
    verbose_name = _('邮件系统')
