from django.db.models.fields import PositiveBigIntegerField
import django_filters
from .models import Product
from django.db import models
from django import forms
from django_filters.filters import OrderingFilter
from django.forms.widgets import Input
from django_filters import FilterSet, filters, widgets


class ProductFilter(django_filters.FilterSet):

    # CHOICES = (
    #     ('highToLow', 'De mayor a menor'),
    #     ('lowToHigh', 'De menor a mayor')
    # )

    # SUBTYPES = (
    #     ('Low', 'Low crown'),
    #     ('Medium', 'Medium'),
    #     ('High', 'High')
    # )

    # ordering = django_filters.ChoiceFilter(
    #     label='Precio', choices=CHOICES, method='filter_by_order')

    # subtype = django_filters.ChoiceFilter(label='Subtipo', choices=SUBTYPES)

    # class Meta:
    #     model = Product
    #     fields = ['subtype']

    # def filter_by_order(self, queryset, name, value):
    #     expression = '-price' if value == 'highToLow' else 'price'
    #     return queryset.order_by(expression)

    # def __init__(self, *args, **kwargs):
    #     super().__init__(*args, **kwargs)
    #     # change the widget choices after initialization
    #     self.form.fields['ordering'].widget.choices = [
    #         ("", 'Ordenar por precio'), ] + list(self.form.fields["ordering"].choices)[1:]

    ordering = OrderingFilter(
        label='Ordenar',
        choices=(
            ('price', 'Precio &#8593;'),
            ('-price', 'Precio &#8595;')
        ),
        widget=widgets.LinkWidget
    )

    class Meta:
        model = Product
        fields = []
