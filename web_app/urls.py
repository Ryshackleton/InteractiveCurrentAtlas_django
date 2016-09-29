"""web_app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.conf import settings
from . import views

urlpatterns = [
    url(r'^$', views.index),
    url(r'^user\.html$', views.user, name='user'),
    url(r'^maps_google\.html$', views.maps_google),
    url(r'^maps_leaflet\.html$', views.maps_leaflet),
    url(r'^createaccount\.html$', views.create_account, name='create_account'),
    url(r'^logout$', views.logout_request, name='logout_request'),
    # url(r'^createaccount/$', views.create_account, name='create_account'),
    # url(r'^user/(\w+)/$',views.profile,name='profile'),
    # url(r'^login$', views.login_request, name='login_request'),
]
