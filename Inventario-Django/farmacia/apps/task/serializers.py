from rest_framework import serializers
from .models import (Categoria,Producto,Proveedor,
    Cliente,Empleado,FacturaVenta,
    DetalleVenta,Movimiento
)

        
class CategoriaSerializer(serializers.ModelSerializer):
    """Serializador para categorías, exponiendo todos los campos para operaciones CRUD vía API."""
    class Meta:
        model = Categoria
        fields = '__all__'


class ProductoSerializer(serializers.ModelSerializer):
    """Serializa Producto, incluyendo relaciones foráneas como categoria y proveedor."""
    class Meta:
        model = Producto
        fields = '__all__'

class ProveedorSerializer(serializers.ModelSerializer):
    """Serializa Proveedor, manejando enlace a usuario con todos los campos."""
    class Meta:
        model= Proveedor
        fields= '__all__'

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class EmpleadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empleado
        fields = '__all__'

class FacturaVentaSerializer(serializers.ModelSerializer):
    """Serializa FacturaVenta, capturando fecha automática y relaciones con cliente/empleado."""
    class Meta:
        model = FacturaVenta
        fields = '__all__'

class DetalleVentaSerializer(serializers.ModelSerializer):
    """Serializa el DetalleVenta para representar las líneas de factura."""
    class Meta:
        model = DetalleVenta
        fields = '__all__'

class MovimientoSerializer(serializers.ModelSerializer):
    """Serializa Movimiento, manejando choices para tipo y relaciones con producto/cliente."""
    class Meta:
        model = Movimiento
        fields = '__all__'