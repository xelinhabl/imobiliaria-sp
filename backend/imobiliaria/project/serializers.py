from rest_framework import serializers
from .models import Configuracao, NewsletterSubscriber, Imovel, CallRequest, About, Contact, Agendamento, BannerCarrossel, ImovelFoto

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

class AgendamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agendamento
        fields = [
            'id',
            'imovel_id',
            'titulo',
            'valor',
            'bairro',
            'cidade',
            'nome',
            'email',
            'telefone',
            'data_visita',
            'hora_visita',
            'criado_em'
        ]
        extra_kwargs = {
            'titulo': {'required': False, 'allow_null': True},
        }

class BannerCarrosselSerializer(serializers.ModelSerializer):
    imagem_url = serializers.SerializerMethodField()

    class Meta:
        model = BannerCarrossel
        fields = ['id', 'titulo', 'descricao', 'imagem_url', 'ordem', 'ativo']

    def get_imagem_url(self, obj):
        return obj.imagem_url
    
class ImovelFotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImovelFoto
        fields = ['foto_url', 'ordem']

class ImovelSerializer(serializers.ModelSerializer):
    fotos = ImovelFotoSerializer(many=True, read_only=True)
    status = serializers.SerializerMethodField()
    
    class Meta:
        model = Imovel
        fields = [
            'id', 'titulo', 'descricao', 'preco', 'tipo',
            'dormitorios', 'banheiros', 'vagas', 'area_total',
            'bairro', 'cidade', 'disponivel', 'fotos', 'status'
        ]
    
    def get_status(self, obj):
        return "Disponível" if obj.disponivel else "Indisponível"