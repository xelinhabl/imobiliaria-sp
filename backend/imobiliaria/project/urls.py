from django.urls import path
from .views import ImovelView, LogoView, AboutView, HomeView, ContactView, NewsletterView, CallRequestView

urlpatterns = [
    path('imoveis/', ImovelView.as_view(), name='imoveis'),
    path('logo/', LogoView.as_view(), name='logo'),
    path('abouts/', AboutView.as_view(), name='abouts'),
    path('home/', HomeView.as_view(), name='home'),
    path('contact/', ContactView.as_view(), name='contact'),
    path('newsletter/', NewsletterView.as_view(), name='newsletter'),
    path('call-request/', CallRequestView.as_view(), name='call-request'),
]