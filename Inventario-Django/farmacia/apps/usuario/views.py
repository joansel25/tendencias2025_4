from rest_framework import viewsets
from .models import Usuario
from .serializers import UsuarioSerializer
from rest_framework.permissions import IsAuthenticated

# Create your views here.


class UsuarioViewset(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]
