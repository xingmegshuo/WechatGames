from django.contrib import admin
from .models import Analysis


# Register your models here.


@admin.register(Analysis)
class AnalysisAdmin(admin.ModelAdmin):
    list_display = ('title', 'creat_date', 'table_type', 'url')
    list_filter = ('title', 'table_type', 'creat_date')
    search_fields = ('title', 'table_type')
    readonly_fields = ('url',)
