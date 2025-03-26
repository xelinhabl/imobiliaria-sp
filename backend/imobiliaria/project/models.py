from django.db import models
from django.conf import settings
from django.utils.safestring import mark_safe
from django.core.validators import FileExtensionValidator

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
    
class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email
    
class CallRequest(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    requested_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class About(models.Model):
    foto = models.ImageField(upload_to='about/')  # Campo para upload de foto
    descricao = models.TextField()  # Campo para a descrição

    def __str__(self):
        return f"Sobre Nós - {self.id}"

class Contact(models.Model):
    nome = models.CharField(max_length=255)  # Nome do contato
    email = models.EmailField()  # E-mail do contato
    telefone = models.CharField(max_length=20)  # Telefone do contato
    mensagem = models.TextField()  # Mensagem do contato
    data_envio = models.DateTimeField(auto_now_add=True)  # Data de envio

    def __str__(self):
        return f"Contato de {self.nome}"
    

class Agendamento(models.Model):
    imovel_id = models.CharField(max_length=100)
    titulo = models.CharField(max_length=200, default='Sem título')
    valor = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    bairro = models.CharField(max_length=100, blank=True, null=True)
    cidade = models.CharField(max_length=100, blank=True, null=True)
    nome = models.CharField(max_length=100)
    email = models.EmailField()
    telefone = models.CharField(max_length=20)
    data_visita = models.DateField()
    hora_visita = models.CharField(max_length=5)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Agendamento para {self.nome} em {self.data_visita.strftime('%d/%m/%Y')} às {self.hora_visita}"
    
class BannerCarrossel(models.Model):
    titulo = models.CharField(max_length=100, blank=True, null=True)
    descricao = models.TextField(blank=True, null=True)
    imagem = models.ImageField(upload_to='banners/')
    
    @property
    def imagem_url(self):
        if self.imagem and hasattr(self.imagem, 'url'):
            return self.imagem.url
        return None
    
    ordem = models.PositiveIntegerField(default=0)
    ativo = models.BooleanField(default=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['ordem']
        verbose_name = 'Banner do Carrossel'
        verbose_name_plural = 'Banners do Carrossel'

    def __str__(self):
        return self.titulo or f"Banner {self.id}"

    def get_absolute_image_url(self):
        if self.imagem:
            return self.imagem.url
        return None