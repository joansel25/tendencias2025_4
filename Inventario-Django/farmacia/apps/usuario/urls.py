from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewset

router  = DefaultRouter()
router.register(r'usuario', UsuarioViewset, basename= 'usuario')
urlpatterns = router.urls

