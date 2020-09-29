"""Mypro URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import re_path, include, path
from web.views import *
from Mypro import settings
from django.views.static import serve
from rest_framework import routers
from user.views import AppViewSet, UserViewSet, AddressViewSet
from games.views import KnowViewSet
from mini.views import ActivityViewSet, ProductViewSet

router = routers.DefaultRouter()
router.register(r'user', UserViewSet)
router.register(r'app', AppViewSet)
router.register(r'know', KnowViewSet)
router.register(r'activity', ActivityViewSet)
router.register(r'product', ProductViewSet)
# router.register(r'shopping_address', AddressViewSet)

urlpatterns = [
    re_path(r'^startConfig', start_config),
    re_path(r'^passNo', review),
    path('admin/', admin.site.urls),
    path('', index, name='首页'),
    re_path(r'^data/', include(router.urls)),
    re_path(r'^api/', include(('games.urls', 'game'), namespace='api')),
    re_path(r'^media/(?P<path>.*)$', serve, {"document_root": settings.MEDIA_ROOT}),
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT})
]

handler400 = bad_request
handler403 = permission_denied
handler404 = page_not_found
handler500 = server_error
