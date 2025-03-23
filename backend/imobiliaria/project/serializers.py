from rest_framework import serializers
from .models import Configuracao, NewsletterSubscriber, Imovel, CallRequest, About, Contact

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['email', 'subscribed_at']

class ImovelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Imovel
        fields = '__all__'
        # Inclui os campos adicionais automaticamente

class ConfiguracaoSerializer(serializers.ModelSerializer):
    logo = serializers.ImageField()  # Retorna a URL da imagem

    class Meta:
        model = Configuracao
        fields = ['logo']  # Inclui apenas o campo de imagem

class CallRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CallRequest
        fields = ['name', 'email', 'phone', 'requested_at']

class AboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = About
        fields = ['foto', 'descricao']

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['nome', 'email', 'telefone', 'mensagem']