from django.contrib import admin
from games.models import *


# Register your models here.

@admin.register(GameInfo)
class GameAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'game_id', 'grade', 'level', 'score', 'is_subscription')
    search_fields = ['user_id', 'game_id']
    list_filter = ('game_id', 'user_id', 'is_subscription')
    readonly_fields = ('user_id', 'game_id')


@admin.register(Sign)
class SignAdmin(admin.ModelAdmin):
    list_display = ('game_info', 'date')
    search_fields = ['date', 'game_info__game_id__name']
    readonly_fields = ('game_info', 'date')
    list_filter = ('date', 'game_info__game_id__name')


@admin.register(MengYou_knowlage)
class MY_KAdmin(admin.ModelAdmin):
    list_display = ('title', 'text', 'need', 'level', 'voice', 'is_check', 'status', 'pass_audit_str')
    search_fields = ('title', 'text')
    list_filter = ('level', 'is_check', 'status')
    # readonly_fields = ('title', 'text', 'voice')


@admin.register(MengYou_recoding)
class MY_RAdmin(admin.ModelAdmin):
    list_display = ('game_info', 'knowlage', 'send_time', 'is_over')
    list_filter = ('game_info__user_id__nick_name', 'is_over', 'send_time')
    search_fields = ('game_info__user_id__nick_name', 'knowlage')
    readonly_fields = ('send_time', 'game_info', 'knowlage')


@admin.register(Diray)
class DirayAdmin(admin.ModelAdmin):
    def user_show(self, obj):
        return obj.game_info.user_id.nick_name

    list_display = ('user_show', 'title', 'date', 'public', 'status')
    list_filter = ('game_info__user_id__nick_name', 'public', 'status')
    search_fields = ('title', 'game_info__user_id__nick_name')


@admin.register(Mailbox)
class MailboxAdmin(admin.ModelAdmin):
    def user_show(self, obj):
        return obj.game_info.user_id.nick_name

    list_display = ('user_show', 'diray', 'date', 'status', 'favor')
    list_filter = ('game_info__user_id__nick_name', 'diray', 'status', 'favor')
    search_fields = ('diray__title', 'game_info__user_id__nick_name', 'diray__game_info__user_id__nick_name')


@admin.register(DirayImage)
class DirayImageAdmin(admin.ModelAdmin):
    list_display = ('diray', 'img')


@admin.register(Advertising)
class AdvertisingAdmin(admin.ModelAdmin):
    def id(self, obj):
        return obj.pk

    list_display = ('id', 'title', 'appid', 'logo', 'status')
    list_filter = ('status',)
    search_fields = ('title', 'appid')
