from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views import generic
from .models import Product
from .utils import to_dict
from django.http import JsonResponse
import logging
from .filters import ProductFilter
from django_filters.views import FilterView
from django.core.mail import send_mail, BadHeaderError
from .forms import ContactForm
from django.contrib import messages
from django.db.models import Q


class ProductDetailView(generic.DetailView):
    model = Product
    template_name = 'store/detailproduct.html'

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        # product = Product.objects.get(title=self.object)
        data = to_dict(self.object)
        # Add array of image paths
        images = self.object.images.all().order_by('-isMainPicture')
        pictures = []
        for image in images:
            pictures.append(image.image.url)
        data['pictures'] = pictures
        logger = logging.getLogger('django')
        logger.info(data)
        return JsonResponse(data)


class CapsList(FilterView):
    model = Product
    context_object_name = 'caps_list'
    filterset_class = ProductFilter
    template_name = 'store/caps.html'
    paginate_by = 10

    def get_queryset(self):
        qs = super(CapsList, self).get_queryset()
        return qs.filter(type='Caps')


class BackpacksList(FilterView):
    model = Product
    context_object_name = 'backpacks_list'
    filterset_class = ProductFilter
    template_name = 'store/backpacks.html'
    paginate_by = 10

    def get_queryset(self):
        qs = super(BackpacksList, self).get_queryset()
        return qs.filter(type='Backpacks')


class OtherHatsList(FilterView):
    model = Product
    context_object_name = 'otherhats_list'
    filterset_class = ProductFilter
    template_name = 'store/otherhats.html'
    paginate_by = 10

    def get_queryset(self):
        qs = super(OtherHatsList, self).get_queryset()
        criterion1 = Q(type='Uniforms')
        criterion2 = Q(type='T-Shirts')
        criterion3 = Q(type='Hats')
        return qs.filter(criterion1 | criterion2 | criterion3)


def index(request):
    return render(request, 'base.html')


def custom(request):
    return render(request, 'store/custom.html')


def aboutus(request):
    return render(request, 'store/aboutus.html')


def cart(request):
    return render(request, 'store/cart.html')


def contact(request):
    if request.method == 'GET':
        form = ContactForm()
    else:
        form = ContactForm(request.POST)
        if form.is_valid():
            subject = form.cleaned_data['Título']
            body = {
                'name': form.cleaned_data['Nombre'],
                'email': form.cleaned_data['Tu_corre_electronico'],
                'message': form.cleaned_data['Texto']
            }

            message = '\n'.join(body.values())

            try:
                send_mail(subject, message, 'support@shopstonethrone.com',
                          ['support@shopstonethrone.com'])
            except BadHeaderError:
                return HttpResponse('Invalid header found.')
            messages.info(
                request, 'Su correo electrónico fue enviado, muchas gracias.')
            return redirect('index')
    return render(request, 'store/contact.html', {'form': form})
