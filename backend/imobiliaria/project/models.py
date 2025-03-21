from django.db import models
from django.conf import settings
from django.utils.safestring import mark_safe

class Imovel(models.Model):
    titulo = models.CharField(max_length=255)
    descricao = models.TextField()
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    data_criacao = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.titulo

class Configuracao(models.Model):
    logo = models.ImageField(upload_to='logos/', null=True, blank=True)  # Campo para upload de imagem

    def __str__(self):
        return self.get_absolute_logo_url() or "No Logo"  # Retorna o caminho absoluto do logo ou uma mensagem padrão

    def get_logo_url(self):
        return self.logo.url if self.logo else None  # Retorna a URL do arquivo de imagem carregado ou None

    def get_absolute_logo_url(self):
        if self.logo:
            return f"{settings.MEDIA_URL}{self.logo}"
        return None  # Retorna None se não houver logo

    def logo_tag(self):
        if self.logo:
            return mark_safe(f'<img src="{self.get_absolute_logo_url()}" width="150" height="150" />')
        return "No Logo Available"  # Retorna uma mensagem padrão se não houver logo

class Pagina(models.Model):
    titulo = models.CharField(max_length=255)  # Título da página
    conteudo = models.TextField()  # Conteúdo da página
    data_criacao = models.DateTimeField(auto_now_add=True)  # Data de criação

    def __str__(self):
        return self.titulo