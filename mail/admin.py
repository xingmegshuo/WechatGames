from django.contrib import admin

# Register your models here.
from .models import *


@admin.register(Mail)
class MailAdmin(admin.ModelAdmin):
    list_display = ['title', 'date']


@admin.register(SysMail)
class SysMainAdmin(admin.ModelAdmin):
    list_display = ['title', 'date']
