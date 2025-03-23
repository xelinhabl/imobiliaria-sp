from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Imovel, Configuracao, About
from .serializers import ImovelSerializer, NewsletterSubscriberSerializer, CallRequestSerializer, AboutSerializer, ContactSerializer
from django.http import JsonResponse
from django.conf import settings
from django.templatetags.static import static
from django.views import View

class ImovelView(APIView):
    def post(self, request):
        serializer = ImovelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        disponivel = request.query_params.get('disponivel')
        if disponivel is not None:
            imoveis = Imovel.objects.filter(disponivel=disponivel.lower() == 'true')
        else:
            imoveis = Imovel.objects.all()
        serializer = ImovelSerializer(imoveis, many=True)
        return Response(serializer.data)

class LogoView(APIView):
    def get(self, request):
        configuracao = Configuracao.objects.first()
        if configuracao and configuracao.get_logo_url():
            logo_url = configuracao.get_logo_url()
        else:
            # Use the default file name from the model or fallback to a static file
            default_logo_name = configuracao.logo.name if configuracao and configuracao.logo else 'logos/banner_1.png'
            logo_url = request.build_absolute_uri(static(default_logo_name))
        return Response({"logoUrl": logo_url}, status=status.HTTP_200_OK)

def logo_view(request):
    return JsonResponse({"message": "Logo endpoint response"})

class AboutView(APIView):
    def get(self, request):
        about = About.objects.first()  # Retorna o primeiro registro (ou ajuste conforme necessário)
        serializer = AboutSerializer(about)
        return Response(serializer.data)

class HomeView(View):
    def get(self, request):
        return JsonResponse({'message': 'This is the Home page'})

class ContactView(View):
    def get(self, request):
        return JsonResponse({'message': 'This is the Contact page'})
    
class NewsletterView(APIView):
    def post(self, request):
        serializer = NewsletterSubscriberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CallRequestView(APIView):
    def post(self, request):
        serializer = CallRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ContactView(APIView):
    def post(self, request):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)