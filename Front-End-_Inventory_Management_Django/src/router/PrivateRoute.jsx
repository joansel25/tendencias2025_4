// router/PrivateRoute.jsx - VERSIÓN CORREGIDA
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, rolPermitido }) => {
  const token = localStorage.getItem("access");
  const rol = localStorage.getItem("rol")?.toLowerCase();

  console.log("🔐 PrivateRoute - Verificando:", {
    tieneToken: !!token,
    rolUsuario: rol,
    rolRequerido: rolPermitido,
    path: window.location.pathname
  });

  // Si no hay token, redirigir a login
  if (!token) {
    console.log("❌ No hay token, redirigiendo a login");
    return <Navigate to="/login" replace />;
  }

  // Verificar expiración del token
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    
    if (Date.now() >= exp) {
      console.log("❌ Token expirado");
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("Error verificando token:", error);
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // Si no hay rol, redirigir a login
  if (!rol) {
    console.log("❌ No hay rol definido");
    return <Navigate to="/login" replace />;
  }

  // Convertir rolPermitido a array para facilitar la verificación
  const rolesPermitidos = Array.isArray(rolPermitido) 
    ? rolPermitido 
    : [rolPermitido];
  
  // Verificar si el rol del usuario está permitido
  const tienePermiso = rolesPermitidos.some(r => r.toLowerCase() === rol);
  
  console.log("📊 Resultado verificación:", {
    rolesPermitidos,
    rolUsuario: rol,
    tienePermiso
  });

  if (!tienePermiso) {
    console.log("🚫 Acceso denegado - Redirigiendo según rol");
    // Redirigir al dashboard según su rol
    switch(rol) {
      case "administrador":
        return <Navigate to="/admin" replace />;
      case "empleado":
        return <Navigate to="/empleado" replace />;
      case "cliente":
        return <Navigate to="/cliente" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  console.log("✅ Acceso permitido a:", window.location.pathname);
  return children;
};

export default PrivateRoute;