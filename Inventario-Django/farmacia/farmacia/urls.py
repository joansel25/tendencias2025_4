"""
URL configuration for farmacia project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from rest_framework import permissions
from drf_yasg.views import get_schema_view

from drf_yasg import openapi

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

schema_view  = get_schema_view(
    openapi.Info(
        title = "Farmacia API",
        default_version  = 'v1',
        description  = "Documentacion de la API de inventario de farmacia",
        terms_of_service = "https://www.google.com/policies/terms/",
        contact = openapi.Contact(email = "jcardenas63@gmail.com"),
        license = openapi.License(name  = "BSD License"),
    ),
    public = True,# Permite acceso público
    permission_classes =(permissions.AllowAny,),# Permisos para acceder a la documentación
)




urlpatterns = [
    path('admin/', admin.site.urls),
    path('farmacia/', include('apps.task.urls')),#agregar las rutas configuradas en la api
    path('api/auth/', include('apps.usuario.urls')),  # Autenticación
    path('swagger/', schema_view.with_ui('swagger',cache_timeout =0), name = 'schema-swagger-ui'),# Ruta para Swagger UI
    path('redoc/', schema_view.with_ui('redoc',cache_timeout=0), name = 'schema-redoc'), # Ruta para ReDoc
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),# obtener los tokens
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),#obtener codigo de refrescar el token
    
    
]
