from rest_framework import viewsets
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import (
    Categoria, Producto, Proveedor,
    Cliente, Empleado, FacturaVenta,
    DetalleVenta, Movimiento
)
from .serializers import (
    CategoriaSerializer, ProductoSerializer, ProveedorSerializer,
    ClienteSerializer, EmpleadoSerializer, FacturaVentaSerializer,
    DetalleVentaSerializer, MovimientoSerializer
)

class CategoriaViewset(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('nombre', openapi.IN_QUERY, description="Filtra categorías por nombre", type=openapi.TYPE_STRING),
        ]
    )
    def list(self, request, *args, **kwargs):
        queryset = self.queryset
        nombre = request.query_params.get('nombre')
        if nombre:
            queryset = queryset.filter(nombre__icontains=nombre)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ProductoViewset(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('nombre', openapi.IN_QUERY, description="Filtra productos por nombre", type=openapi.TYPE_STRING),
            openapi.Parameter('id_categoria', openapi.IN_QUERY, description="Filtra productos por categoría", type=openapi.TYPE_INTEGER),
            openapi.Parameter('id_proveedor', openapi.IN_QUERY, description="Filtra productos por proveedor", type=openapi.TYPE_INTEGER),
        ]
    )
    def list(self, request, *args, **kwargs):
        queryset = self.queryset
        nombre = request.query_params.get('nombre')
        id_categoria = request.query_params.get('id_categoria')
        id_proveedor = request.query_params.get('id_proveedor')
        if nombre:
            queryset = queryset.filter(nombre__icontains=nombre)
        if id_categoria:
            queryset = queryset.filter(id_categoria=id_categoria)
        if id_proveedor:
            queryset = queryset.filter(id_proveedor=id_proveedor)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ProveedorViewset(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('nombre', openapi.IN_QUERY, description="Filtra proveedores por nombre", type=openapi.TYPE_STRING),
            openapi.Parameter('contacto', openapi.IN_QUERY, description="Filtra proveedores por contacto", type=openapi.TYPE_STRING),
        ]
    )
    def list(self, request, *args, **kwargs):
        queryset = self.queryset
        nombre = request.query_params.get('nombre')
        contacto = request.query_params.get('contacto')
        if nombre:
            queryset = queryset.filter(nombre__icontains=nombre)
        if contacto:
            queryset = queryset.filter(contacto__icontains=contacto)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ClienteViewset(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('nombre', openapi.IN_QUERY, description="Filtra clientes por nombre", type=openapi.TYPE_STRING),
            openapi.Parameter('correo', openapi.IN_QUERY, description="Filtra clientes por correo", type=openapi.TYPE_STRING),
        ]
    )
    def list(self, request, *args, **kwargs):
        queryset = self.queryset
        nombre = request.query_params.get('nombre')
        correo = request.query_params.get('correo')
        if nombre:
            queryset = queryset.filter(nombre__icontains=nombre)
        if correo:
            queryset = queryset.filter(correo__icontains=correo)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class EmpleadoViewset(viewsets.ModelViewSet):
    queryset = Empleado.objects.all()
    serializer_class = EmpleadoSerializer

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('nombre', openapi.IN_QUERY, description="Filtra empleados por nombre", type=openapi.TYPE_STRING),
            openapi.Parameter('cargo', openapi.IN_QUERY, description="Filtra empleados por cargo", type=openapi.TYPE_STRING),
        ]
    )
    def list(self, request, *args, **kwargs):
        queryset = self.queryset
        nombre = request.query_params.get('nombre')
        cargo = request.query_params.get('cargo')
        if nombre:
            queryset = queryset.filter(nombre__icontains=nombre)
        if cargo:
            queryset = queryset.filter(cargo__icontains=cargo)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class FacturaVentaViewset(viewsets.ModelViewSet):
    queryset = FacturaVenta.objects.all()
    serializer_class = FacturaVentaSerializer

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('id_cliente', openapi.IN_QUERY, description="Filtra facturas por cliente", type=openapi.TYPE_INTEGER),
            openapi.Parameter('id_empleado', openapi.IN_QUERY, description="Filtra facturas por empleado", type=openapi.TYPE_INTEGER),
        ]
    )
    def list(self, request, *args, **kwargs):
        queryset = self.queryset
        id_cliente = request.query_params.get('id_cliente')
        id_empleado = request.query_params.get('id_empleado')
        if id_cliente:
            queryset = queryset.filter(id_cliente=id_cliente)
        if id_empleado:
            queryset = queryset.filter(id_empleado=id_empleado)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class DetalleVentaViewset(viewsets.ModelViewSet):
    queryset = DetalleVenta.objects.all()
    serializer_class = DetalleVentaSerializer

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('id_factura', openapi.IN_QUERY, description="Filtra detalles por factura", type=openapi.TYPE_INTEGER),
            openapi.Parameter('id_producto', openapi.IN_QUERY, description="Filtra detalles por producto", type=openapi.TYPE_INTEGER),
        ]
    )
    def list(self, request, *args, **kwargs):
        queryset = self.queryset
        id_factura = request.query_params.get('id_factura')
        id_producto = request.query_params.get('id_producto')
        if id_factura:
            queryset = queryset.filter(id_factura=id_factura)
        if id_producto:
            queryset = queryset.filter(id_producto=id_producto)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class MovimientoViewset(viewsets.ModelViewSet):
    queryset = Movimiento.objects.all()
    serializer_class = MovimientoSerializer

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('tipo', openapi.IN_QUERY, description="Filtra movimientos por tipo", type=openapi.TYPE_STRING),
            openapi.Parameter('id_producto', openapi.IN_QUERY, description="Filtra movimientos por producto", type=openapi.TYPE_INTEGER),
            openapi.Parameter('id_cliente', openapi.IN_QUERY, description="Filtra movimientos por cliente", type=openapi.TYPE_INTEGER),
        ]
    )
    def list(self, request, *args, **kwargs):
        queryset = self.queryset
        tipo = request.query_params.get('tipo')
        id_producto = request.query_params.get('id_producto')
        id_cliente = request.query_params.get('id_cliente')
        if tipo:
            queryset = queryset.filter(tipo__icontains=tipo)
        if id_producto:
            queryset = queryset.filter(id_producto=id_producto)
        if id_cliente:
            queryset = queryset.filter(id_cliente=id_cliente)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)