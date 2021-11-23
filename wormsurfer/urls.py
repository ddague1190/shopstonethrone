from django_otp.admin import OTPAdminSite
from django.contrib import admin
from django.urls import include, path
from django_otp.plugins.otp_totp.models import TOTPDevice
from django_otp.plugins.otp_totp.admin import TOTPDeviceAdmin
from store.models import *


# otp_admin_site = OTPAdminSite(OTPAdminSite.name)
# for model_cls, model_admin in admin.site._registry.iteritems():
#     otp_admin_site.register(model_cls, model_admin.__class__)


# from django_otp.admin import OTPAdminSite

# admin.site.__class__ = OTPAdminSite


urlpatterns = [
    path('', include('store.urls')),
    path('porfavorsumerce/', admin.site.urls),
]
