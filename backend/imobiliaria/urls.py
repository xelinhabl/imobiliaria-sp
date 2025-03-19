from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from project.views import ImovelView, LogoView  

urlpatterns = [
    path('imoveis/', ImovelView.as_view(), name='imoveis'),
    path('logo/', LogoView.as_view(), name='logo'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)