from django import forms


class ContactForm(forms.Form):
    Nombre = forms.CharField(required=True)
    Tu_corre_electronico = forms.EmailField(required=True)
    Título = forms.CharField(required=True)
    Texto = forms.CharField(widget=forms.Textarea, required=True)
