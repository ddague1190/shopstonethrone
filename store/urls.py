from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.index, name='index'),
    path('aboutus', views.aboutus, name='aboutus'),
    path('custom', views.custom, name='custom'),
    path('caps', views.CapsList.as_view(), name='caps'),
    path('otherhats', views.OtherHatsList.as_view(), name='otherhats'),
    path('backpacks', views.BackpacksList.as_view(), name='backpacks'),
    path('cart', views.cart, name='cart'),
    path('product/<pk>', views.ProductDetailView.as_view(), name='detailproduct'),
    path('contact', views.contact, name='contact')
]


if settings.DEBUG is True:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
