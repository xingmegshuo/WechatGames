from django.contrib import admin
from .models import *


# Register your models here.

@admin.register(Jobs)
class JobAdmin(admin.ModelAdmin):
    list_display = ('name', 'jobType', 'create_date', 'on_line', 'is_over', 'pass_audit_str')
    list_filter = ('create_date', 'name', 'jobType', 'on_line', 'is_over')
    search_fields = ('name',)


@admin.register(Job)
class JAdmin(admin.ModelAdmin):
    list_display = ('job', 'next_run', 'on_line', 'is_over')
    list_filter = ('job__name', 'next_run', 'is_over')
    search_fields = ('job__name',)
