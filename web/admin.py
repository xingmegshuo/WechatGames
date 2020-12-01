from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(VisitNumber)


@admin.register(Userip)
class IpAdmin(admin.ModelAdmin):
    list_display = ('ip', 'count')
    list_filter = ('count',)


@admin.register(DayNumber)
class AllAdmin(admin.ModelAdmin):
    list_display = ('day', 'count')
    list_filter = ('day',)


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('img',)
