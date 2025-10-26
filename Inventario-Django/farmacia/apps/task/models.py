from django.db import models
from model_utils.models import TimeStampedModel
from ..usuario.models import Usuario

class Categoria(TimeStampedModel):  #models.Model
    """Categoría de productos, con nombre único para clasificación."""
    nombre = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.nombre

class Proveedor(TimeStampedModel):
    """Proveedor asociado a un usuario, con contacto único para facilitar el control y registro de acciones."""

    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="proveedores")
    nombre = models.CharField(max_length=150)
    contacto = models.CharField(max_length=100,unique=True )

    def __str__(self):
        return self.nombre

class Producto(TimeStampedModel):
    """Producto con stock gestionado, ligado a categoría y proveedor."""
   
    nombre = models.CharField(max_length=150) 
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    id_categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name="productos")
    id_proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE, related_name="productos_proveedor")
    
    @property
    def valor_total_stock(self):
        total  = self.stock * self.precio
        return total

    def __str__(self):
        return f"{self.nombre} ({self.id_categoria})"

class Cliente(TimeStampedModel):
    """Cliente ligado a usuario, con correo y teléfono únicos para identificación."""
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="cliente")
    nombre = models.CharField(max_length=150)
    correo = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.nombre

class Empleado(TimeStampedModel):
    """Empleado ligado a usuario, con teléfono único """
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name= "empleados")
    nombre = models.CharField(max_length=150)
    telefono = models.CharField(max_length=20,unique=True)

    def __str__(self):
        return self.nombre

class FacturaVenta(TimeStampedModel):
    """Factura de venta, auto-fechada y ligada a cliente/empleado para registro."""
    fecha = models.DateField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    id_cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name="facturas")
    id_empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE, related_name="facturas")
    
    def save(self, *args, **kwargs):
        #guardar la instancia(iD) y calcular  la suma total de todos los subtotales ventas
        super().save(*args, **kwargs)
        self.total = sum(detalle.subtotal for detalle in self.detalles.all())
        super().save(update_fields=["total"])
        
    def __str__(self):
        return f"Factura {self.id}"


class DetalleVenta(TimeStampedModel):
    """Detalle de venta en factura, con precio unitario para cálculo de subtotales."""
    cantidad = models.IntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    id_factura = models.ForeignKey(FacturaVenta, on_delete=models.CASCADE, related_name="detalles")
    id_producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name="detalles")
    
        #calcular subtotal de cada objeto
    def save(self, *args, **kwargs):
        self.subtotal = self.cantidad * self.precio_unitario
        super().save(*args, **kwargs)
    def __str__(self):
        return f"Detalle {self.id} (Factura {self.id_factura})"

class Movimiento(TimeStampedModel):
    """Movimiento de inventario (entrada/salida), auto-fechado y ligado a producto/cliente."""
    TIPOS_MOVIMIENTO = [
        ('entrada', 'Entrada'),
        ('salida', 'Salida'),
    ]

  
    tipo = models.CharField(max_length=10, choices=TIPOS_MOVIMIENTO)
    cantidad = models.IntegerField(default=1)
    fecha = models.DateField(auto_now_add=True)
    id_producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name="movimiento")
    id_cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name="movimiento")

    def __str__(self):
        return f"Movimiento {self.id} ({self.tipo})"