from django.contrib import admin

# Register your models here.
from .models import *


@admin.register(Voice)
class VoiceAdmin(admin.ModelAdmin):
    list_display = ('human', 'name', 'url', 'content')
    search_fields = ('human', 'name', 'content')
    list_filter = ('human',)
