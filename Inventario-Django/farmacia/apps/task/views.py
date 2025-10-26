
"""Este archivo define ViewSets para manejar operaciones CRUD en modelos relacionados con una farmacia,
integrando autenticación JWT, permisos personalizados y generación de PDFs"""

from rest_framework import viewsets  
from .models import*
from .serializers import*
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated
from .permissions import * 
from django.http import HttpResponse
from .pdf import *
from rest_framework.decorators import action

class CategoriaViewSet(viewsets.ModelViewSet):
    """Gestiona categorías con permisos de admin y documentación Swagger para list/create."""
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    @swagger_auto_schema(
        operation_description="Listar todas las categorias disponibles en el sistema ",  
        responses={200: CategoriaSerializer(many=True)}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
     
    @swagger_auto_schema(
        operation_description="Crea una nueva categoría en el sistema.", 
        responses={201: CategoriaSerializer()} 
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


class ProductoViewset(viewsets.ModelViewSet):
    """Maneja productos con permisos combinados (admin/empleado) y acciones para PDFs individuales/todos."""
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [IsAuthenticated, IsAdmin |IsEmployee ]  
    
    @action(detail=True, methods=['get'])
    def pdf(self, request, pk=None):
        producto = self.get_object()
        pdf_file = build_producto_id_pdf(producto)
    
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
    """Gestiona proveedores con permisos para admin/proveedor."""
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    permission_classes = [IsAuthenticated, IsAdmin | IsProvider]  
    
class ClienteViewset(viewsets.ModelViewSet):
    """Maneja clientes con permisos amplios (cliente/empleado/admin)."""
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated, IsClient | IsEmployee | IsAdmin]  

class EmpleadoViewset(viewsets.ModelViewSet):
    """Gestiona empleados restringido a admin."""
    queryset = Empleado.objects.all()
    serializer_class = EmpleadoSerializer
    permission_classes = [IsAuthenticated, IsAdmin]  

class FacturaVentaViewset(viewsets.ModelViewSet):
    """Maneja facturas de venta con permisos para empleado/admin."""
    queryset = FacturaVenta.objects.all()
    serializer_class = FacturaVentaSerializer
    permission_classes = [IsAuthenticated, IsEmployee | IsAdmin] 

class DetalleVentaViewset(viewsets.ModelViewSet):
    """Gestiona detalles de venta con permisos admin/empleado y acciones para PDFs."""
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
    """Maneja movimientos de inventario con permisos admin/empleado y acciones para PDFs."""
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
