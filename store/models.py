from django.db import models
import logging
from django.utils.html import mark_safe

# Create your models here.


class Manufacturer(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name


class Model(models.Model):
    model = models.CharField(max_length=30)

    def __str__(self):
        return self.model


class Product(models.Model):

    TYPES = (
        ('Caps', 'Caps'),
        ('Hats', 'Hats'),
        ('Backpacks', 'Backpacks'),
        ('T-shirts', 'T-shirts'),
        ('Uniforms', 'Uniforms')
    )

    SUBTYPES = (
        ('Low', 'Low Crown'),
        ('Med', 'Med Crown'),
        ('High', 'High Crown'),
    )

    type = models.CharField('Product type', max_length=20, choices=TYPES)
    subtype = models.CharField(
        'Sub type', max_length=20, choices=SUBTYPES, blank=True)
    manufacturer = models.ForeignKey(
        Manufacturer, on_delete=models.CASCADE, blank=True)
    model = models.ForeignKey(Model, on_delete=models.CASCADE, blank=True)
    sizesAvailable = models.CharField(max_length=30, blank=True)
    smallMediumQuantity = models.IntegerField(default=0)
    largeExtraLargeQuantity = models.IntegerField(default=0)
    universalQuantity = models.IntegerField(default=0)
    youthQuantity = models.IntegerField(default=0)
    title = models.CharField('Title', max_length=100)
    description = models.CharField('Description', max_length=300)
    price = models.IntegerField()

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        sizeArr = []
        if(self.smallMediumQuantity):
            sizeArr.append('S-M')
        if(self.largeExtraLargeQuantity):
            sizeArr.append('L-XL')
        if(self.universalQuantity):
            sizeArr.append('Univ')
        if(self.youthQuantity):
            sizeArr.append('Youth')

        self.sizesAvailable = ' / '.join(sizeArr)
        # logger = logging.getLogger('django')
        # logger.info('messageinfohere')
        super(Product, self).save(*args, **kwargs)

    def sizesAvailable_as_list(self):
        return self.sizesAvailable.split('/')


class Picture(models.Model):
    product = models.ForeignKey(
        Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField('Image')
    isMainPicture = models.BooleanField()
