
from rest_framework import viewsets  # es un modulo de django que te permite crear vistas para Apis de manera rapida y reduciendo codigo

from .models import*
from .serializers import*

from drf_yasg.utils import swagger_auto_schema

# - Importamos los permisos personalizados desde la nueva carpeta 'permissions'.
# - Mantenemos IsAuthenticated para asegurar JWT.
from rest_framework.permissions import IsAuthenticated
from .permissions import * # Nuevos imports de permisos personalizados


from django.http import HttpResponse
from .pdf import *
from rest_framework.decorators import action

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    @swagger_auto_schema(
        operation_description="Listar todas las categorias disponibles en el sistema ",  # descripcion de la operacion
        responses={200: CategoriaSerializer(many=True)} # many = True: va iterar  sobre una lista de objetos de categoriaSerialzer
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
     
    @swagger_auto_schema(
        operation_description="Crea una nueva categoría en el sistema.",  # Descripción de la operación
        request_body=CategoriaSerializer,  # Cuerpo de la solicitud
        responses={201: CategoriaSerializer()}  # 201 Respuesta esperada
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

class ProductoViewset(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    
    " permission_classes: Permisos requeridos para acceder a las vistas."
    permission_classes = [IsAuthenticated, IsAdmin |IsEmployee ]  # Empleados o admins pueden manejar productos.
    
    @action(detail=True, methods=['get'])
    def pdf(self, request, pk=None):
        producto = self.get_object()
        pdf_file = build_producto_id_pdf(producto)
        """
         Genera un PDF para un producto específico.
        Args:
            request: Objeto de solicitud HTTP.
            pk: Clave primaria del producto.
            Returns:
            HttpResponse: Respuesta HTTP con el PDF adjunto.
        """
        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="producto_{producto.nombre}.pdf"'
        return response
    
    @action(detail=False, methods=['get'])
    def all_pdf(self, request):
        productos = self.get_queryset()
        pdf_file = build_todos_productos_pdf(productos)

        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="todos_productos.pdf"'
        return response


    
class ProveedorViewset(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    permission_classes = [IsAuthenticated, IsAdmin | IsProvider]  # Admins o proveedores (para sus propios datos, si se extiende).

class ClienteViewset(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated, IsClient | IsEmployee | IsAdmin]  # Clientes ven sus datos, empleados/admins gestionan.

class EmpleadoViewset(viewsets.ModelViewSet):
    queryset = Empleado.objects.all()
    serializer_class = EmpleadoSerializer
    permission_classes = [IsAuthenticated, IsAdmin]  # Solo admins manejan empleados.

class FacturaVentaViewset(viewsets.ModelViewSet):
    queryset = FacturaVenta.objects.all()
    serializer_class = FacturaVentaSerializer
    permission_classes = [IsAuthenticated, IsEmployee | IsAdmin]  # Empleados crean facturas.

class DetalleVentaViewset(viewsets.ModelViewSet):
    queryset = DetalleVenta.objects.all()
    serializer_class = DetalleVentaSerializer
    permission_classes = [IsAuthenticated,  IsAdmin |IsEmployee ]
    
    @action(detail=True, methods=['get'])
    def pdf(self, request, pk=None):
        detalle_venta = self.get_object()
        pdf_file = build_detalle_venta_id_pdf(detalle_venta)
        
        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="detalle_venta_{detalle_venta.id}.pdf"'
        return response
    
    @action(detail=False, methods=['get'])
    def all_pdf(self, request):
        detalles_venta = self.get_queryset()
        pdf_file = build_todos_detalles_venta_pdf(detalles_venta)

        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="todos_detalles_venta.pdf"'
        return response

class MovimientoViewset(viewsets.ModelViewSet):

    queryset = Movimiento.objects.all()
    serializer_class = MovimientoSerializer
    permission_classes = [IsAuthenticated,   IsAdmin |IsEmployee  ]
    
    @action(detail=True, methods=['get'])
    def pdf(self, request, pk=None):
        movimiento = self.get_object()
        pdf_file = build_movimiento_id_pdf(movimiento)
        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="movimiento_{movimiento.id}.pdf"'
        return response
    
       
    @action(detail=False, methods=['get'])
    def all_pdf(self, request):
        movimientos = self.get_queryset()
        pdf_file = build_todos_movimientos_pdf(movimientos)

        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="todos_movimientos.pdf"'
        return response
