from django.urls import re_path
from rest_framework.urlpatterns import format_suffix_patterns
from .views import SignView, KnowView, Ranking, GameInfoView, DirayView, MailboxView, DirayImageView
from user.views import WxAuthView, WxLoginView, RegisterView, LoginView, ChangePwdView
from web.views import api_doc, subscribe, pay
# from voice.views import GetVoiceView
from mini.views import *
from mail.views import MyMail

urlpatterns = format_suffix_patterns([
    re_path(r'^wx_login/$', WxLoginView.as_view(), name='wx_login'),
    re_path(r'^wx_auth/$', WxAuthView.as_view(), name='wx_auth'),
    re_path(r'^gameInfo/$', GameInfoView.as_view(), name='gameInfo'),
    # re_path(r'^get_voice/$', GetVoiceView.as_view(), name='get_voice'),
    re_path(r'^sign/$', SignView.as_view(), name='sign'),
    re_path(r'^knowlage/$', KnowView.as_view(), name='knowlage'),
    re_path(r'^rank/$', Ranking.as_view(), name='rank'),
    re_path(r'^games/$', Games.as_view(), name='games'),
    re_path(r'^product/$', ProductApi.as_view(), name='product'),
    re_path(r'^cat/$', CatApi.as_view(), name='cat'),
    re_path(r'^order/$', OrderApi.as_view(), name='order'),
    re_path(r'^address/$', AddressApi.as_view(), name='address'),
    re_path(r'^diray/$', DirayView.as_view()),
    re_path(r'^mailbox/$', MailboxView.as_view()),
    re_path(r'^dirayImage/$', DirayImageView.as_view()),
    re_path(r'^register', RegisterView.as_view(), name='register'),
    re_path(r'^login', LoginView.as_view()),
    re_path(r'^changepwd', ChangePwdView.as_view()),
    re_path(r'^pay/$', PayApi.as_view()),
    re_path(r'^doc/(?P<path>.*)', api_doc),
    re_path(r'^mail/$', MyMail.as_view()),
    re_path(r'^subscribe', subscribe),
    re_path(r'^paymoney', pay),
    # re_path(r'^start/$', GameStartView.as_view()),
])
