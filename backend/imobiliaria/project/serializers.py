from rest_framework import serializers
from .models import Imovel
from .models import Configuracao

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