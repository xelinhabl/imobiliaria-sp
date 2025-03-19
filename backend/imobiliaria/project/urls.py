from django.urls import path
from .views import ImovelView, LogoView, AboutsView, HomeView, ContactView  # Importar as novas views

urlpatterns = [
    path('imoveis/', ImovelView.as_view(), name='imoveis'),
    path('logo/', LogoView.as_view(), name='logo'),  # Removido o prefixo 'api/'
    path('abouts/', AboutsView.as_view(), name='abouts'),
    path('home/', HomeView.as_view(), name='home'),
    path('contact/', ContactView.as_view(), name='contact'),
]