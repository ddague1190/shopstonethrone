from django.contrib import admin
from .models import Manufacturer, Model, Product, Picture
from django.utils.html import format_html
from django.contrib.admin.widgets import AdminFileWidget
from django.utils.safestring import mark_safe
from django.db import models


class AdminImageWidget(AdminFileWidget):
    def render(self, name, value, attrs=None, renderer=None):
        output = []
        if value and getattr(value, "url", None):
            image_url = value.url
            file_name = str(value)
            output.append(u' <a href="%s" target="_blank"><img src="%s" alt="%s" width="100" height="100"  style="object-fit: cover;"/></a>' %
                          (image_url, image_url, file_name))
        output.append(super(AdminFileWidget, self).render(name, value, attrs))
        return mark_safe(u''.join(output))


class PictureInline(admin.TabularInline):
    model = Picture
    extra = 0
    formfield_overrides = {models.ImageField: {'widget': AdminImageWidget}}
    list_display = ['product', 'image_tag', 'isMainPicture']


class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'subtype', 'model',
                    'sizesAvailable', 'description', 'price')

    empty_value_display = '-empty-'

    fields = [('type', 'subtype'), ('model', 'manufacturer'),
              ('title', 'description'), 'sizesAvailable', 'price', ('smallMediumQuantity', 'largeExtraLargeQuantity', 'universalQuantity', 'youthQuantity')]

    def view_model(self, obj):
        return obj.model

    inlines = [PictureInline]

    view_model.emptty_value_display = '? No modelo'


class PictureAdmin(admin.ModelAdmin):
    def image_tag(self, obj):
        return format_html("<img src='{}' width='100' height='100' style='object-fit: cover;'/>".format(obj.image.url))


# u' <a href="%s" target="_blank"><img src="%s" alt="%s" width="150" height="150"  style="object-fit: cover;"/></a>' %
#                           (image_url, image_url, file_name, _('')))

    image_tag.short_description = 'Image'

    list_display = ('product', 'image_tag', 'isMainPicture')

    fields = ['product', 'image', 'isMainPicture']


admin.site.register(Manufacturer)
admin.site.register(Model)
admin.site.register(Product, ProductAdmin)
admin.site.register(Picture, PictureAdmin)
