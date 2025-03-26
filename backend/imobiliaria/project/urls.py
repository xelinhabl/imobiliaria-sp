from django.urls import path
from .views import ImovelView, LogoView, AboutView, ContactView, NewsletterView, CallRequestView, AgendamentoView, BannerCarrosselView

urlpatterns = [
    path('imoveis/', ImovelView.as_view(), name='imoveis'),
    path('logo/', LogoView.as_view(), name='logo'),
    path('abouts/', AboutView.as_view(), name='abouts'),
    path('contact/', ContactView.as_view(), name='contact'),
    path('newsletter/', NewsletterView.as_view(), name='newsletter'),
    path('call-request/', CallRequestView.as_view(), name='call-request'),
    path('agendamentos/', AgendamentoView.as_view(), name='agendamentos'),
    path('banners/', BannerCarrosselView.as_view(), name='banners'),
]