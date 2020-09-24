from django.contrib import admin
from games.models import *


# Register your models here.

@admin.register(GameInfo)
class GameAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'game_id', 'grade', 'level', 'score', 'is_subscription')
    search_fields = ['user_id__nick_name', 'game_id__name']
    list_filter = ('game_id__name', 'user_id__nick_name', 'is_subscription')
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
    search_fields = ('game_info__name', 'knowlage')
    readonly_fields = ('send_time', 'game_info', 'knowlage')
