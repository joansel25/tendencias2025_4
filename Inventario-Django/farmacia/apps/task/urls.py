#Aqui Definimos  las rutas relacionadas con los modelos y vistas de la aplicación task.
#Mantenemos  el código limpio y modular, separando las URLs por aplicación.

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'productos', ProductoViewset, basename='producto')
router.register(r'proveedores', ProveedorViewset, basename='proveedor')
router.register(r'clientes', ClienteViewset, basename='cliente')
router.register(r'empleados', EmpleadoViewset, basename='empleado')
router.register(r'facturasventa', FacturaVentaViewset, basename='facturaventa')
router.register(r'detallesventa', DetalleVentaViewset, basename='detalleventa')
router.register(r'movimientos', MovimientoViewset, basename='movimiento')

urlpatterns = router.urls
