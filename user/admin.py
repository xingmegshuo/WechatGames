from django.contrib import admin

# Register your models here.
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from user.models import *


@admin.register(MyUser)
class MyUserAdmin(UserAdmin):
    list_display = ('nick_name', 'unionId', 'login', 'last_login', 'is_auth')
    readonly_fields = (
        'last_login', 'date_joined', 'nick_name', 'city', 'province', 'country', 'gender', 'openid',
        'unionId', 'login'
    )
    list_filter = ('is_auth', 'login')
    search_fields = [
        'username', 'openid', 'email', 'nick_name'
    ]
    fieldsets = (
        (_('基础信息'), {'fields': ('username', 'password', 'openid', 'unionId')}),
        (_('个人信息'), {'fields': (
            'nick_name', 'first_name', 'last_name', 'avatar_url', 'gender', 'date_of_birth', 'desc')}),
        (_('联络信息'), {'fields': ('email',)}),
        (_('地址信息'), {'fields': ('city', 'province', 'country')}),
        (_('登录信息'), {'fields': ('last_login', 'login', 'date_joined')}),
    )


# 注册模型到admin管理
@admin.register(APP)
class AppAdmin(admin.ModelAdmin):
    list_display = ('name', 'app_id')
    list_per_page = 100
    search_fields = ['name']
    fieldsets = (
        (_('配置信息'), {'fields': ('name', 'app_id', 'secret', 'img')}),
    )


@admin.register(App_config)
class AppConfigAdmin(admin.ModelAdmin):
    list_display = ('name', 'value', 'app_id', 'description', 'on_line', 'pass_audit_str')
    list_filter = ('on_line', 'app_id__name')
    list_per_page = 100
    search_fields = ['app_id__name']


@admin.register(Userip)
class IpAdmin(admin.ModelAdmin):
    list_display = ('ip', 'count', 'area', 'city', 'country', 'LaL', 'Tl')
    search_fields = ['city', 'ip']
    readonly_fields = ('ip', 'count', 'area', 'country', 'province', 'city', 'LaL', 'Tl')
    list_filter = ('city', 'province')


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('unionId', 'human', 'phone','address','is_show')
    search_fields = ['phone', 'human', 'unionId', 'address']
    readonly_fields = ('unionId', 'human', 'phone', 'is_show', 'address')
    list_filter = ('is_show', 'human')