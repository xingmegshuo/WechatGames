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
        'username', 'openid', 'email', 'nick_name', 'unionId'
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
    def name_show(self, obj):
        try:
            name = App_config.objects.filter(app_id=obj.id, name='name')[0].value
        except:
            name = '暂无配置'
        return name

    list_display = ('name', 'app_id', 'name_show', 'on_line')
    list_per_page = 100
    search_fields = ['name']
    fieldsets = (
        (_('配置信息'), {'fields': ('name', 'app_id', 'secret', 'img')}),
    )


@admin.register(App_config)
class AppConfigAdmin(admin.ModelAdmin):
    list_display = ('name', 'value', 'app_id', 'description', 'on_line', 'pass_audit_str')
    list_filter = ('on_line', 'app_id')
    list_per_page = 100
    search_fields = ['app_id__name']


@admin.register(Userip)
class IpAdmin(admin.ModelAdmin):
    def user_show(self, obj):
        try:
            name = MyUser.objects.filter(id=obj.name)[0].nick_name
        except:
            name = '暂无授权'
        return name

    list_display = ('ip', 'user_show', 'count', 'area', 'city', 'country', 'LaL', 'Tl')
    search_fields = ['city', 'ip', 'user_show']
    readonly_fields = ('ip', 'count', 'area', 'country', 'province', 'city', 'LaL', 'Tl')
    list_filter = ('city', 'province', 'name')


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    def user_show(self, obj):
        return MyUser.objects.filter(unionId=obj.unionId)[0].nick_name

    list_display = ('user_show', 'human', 'phone', 'address', 'is_show', 'is_default')
    search_fields = ['phone', 'human', 'unionId', 'address', 'is_default', 'is_show']
    readonly_fields = ('unionId', 'human', 'phone', 'is_show', 'address')
    list_filter = ('is_show', 'human')


@admin.register(RecordLogin)
class LoginAdmin(admin.ModelAdmin):
    list_display = ('user', 'game', 'login_time')
    list_filter = ('user__nick_name', 'game')


admin.site.site_title = "萌果果后台管理"
admin.site.site_header = "萌果果"
