
from rest_framework.permissions import BasePermission
"""Este archivo contiene clases personalizadas de permisos para controlar el acceso a las vistas."""

class IsAdmin(BasePermission):
    """
    Útil para vistas que manejan operaciones sensibles como crear/eliminar categorías o proveedores.
    Si el rol no existe o no coincide, deniega el acceso con un mensaje claro.
    """
    message = 'Acceso denegado: Requiere rol de administrador.'

    def has_permission(self, request, view):
        # request.user es proporcionado por JWT (asumiendo que ya está implementado).
        return bool(request.user and request.user.is_authenticated and request.user.rol and request.user.rol.name == 'administrador')

class IsEmployee(BasePermission):
    """

    - Ideal para vistas relacionadas con facturas o movimientos, donde empleados gestionan operaciones.
    - Deniega acceso si el rol no coincide.
    """
    message = 'Acceso denegado: Requiere rol de empleado.'

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.rol and request.user.rol.name == 'empleado')

class IsClient(BasePermission):
    """
    - Útil para vistas donde clientes solo pueden ver sus propias facturas o movimientos.
    """
    message = 'Acceso denegado: Requiere rol de cliente.'

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.rol and request.user.rol.name == 'cliente')

class IsProvider(BasePermission):
    """
    - Adecuado para vistas donde proveedores gestionan productos o stocks relacionados con ellos.
    """
    message = 'Acceso denegado: Requiere rol de proveedor.'

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.rol and request.user.rol.name == 'proveedor')