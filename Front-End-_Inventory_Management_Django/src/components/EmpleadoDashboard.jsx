// EmpleadoDashboard.jsx - VERSIÓN CORREGIDA
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  TrendingUp,
  LogOut,
  ClipboardList,
  BarChart3,
  ShoppingBag,
} from "lucide-react";
import api from "../services/api";

export default function EmpleadoDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProductos: 0,
    stockBajo: 0,
    ventasHoy: 0,
    movimientosHoy: 0,
  });
  const [userName, setUserName] = useState("Empleado");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatosDashboard = async () => {
      try {
        setLoading(true);

        // Verificar autenticación
        const token = localStorage.getItem("access");
        const rol = localStorage.getItem("rol")?.toLowerCase();

        if (!token || rol !== "empleado") {
          console.log("❌ No autenticado como empleado, redirigiendo...");
          navigate("/login");
          return;
        }

        // Obtener información del usuario
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserName(payload.username || "Empleado");

        // Cargar estadísticas
        const [productosRes, ventasRes, movimientosRes] = await Promise.all([
          api.get("/farmacia/productos/"),
          api.get("/farmacia/facturasventa/"),
          api.get("/farmacia/movimientos/"),
        ]);

        const productos = productosRes.data;
        const ventas = ventasRes.data;
        const movimientos = movimientosRes.data;

        const hoy = new Date().toISOString().split("T")[0];

        // Filtrar ventas del día
        const ventasHoy = ventas.filter((v) => v.fecha === hoy).length;

        // Filtrar movimientos del día
        const movimientosHoy = movimientos.filter(
          (m) => m.fecha === hoy
        ).length;

        // Contar productos con stock bajo
        const stockBajo = productos.filter((p) => p.stock < 10).length;

        setStats({
          totalProductos: productos.length,
          stockBajo,
          ventasHoy,
          movimientosHoy,
        });

      } catch (error) {
        console.error("Error cargando dashboard:", error);
        
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.clear();
          navigate("/login");
        } else {
          alert("Error al cargar el dashboard");
        }
      } finally {
        setLoading(false);
      }
    };

    cargarDatosDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleNavegarRegistrarVenta = () => {
    console.log("🔄 Navegando a /registrar-venta");
    console.log("📊 Estado actual:", {
      token: !!localStorage.getItem("access"),
      rol: localStorage.getItem("rol"),
      path: "/registrar-venta"
    });
    navigate("/registrar-venta");
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ background: "linear-gradient(135deg, #d0f0c0, #b2dfdb)" }}
      >
        <div
          className="spinner-border text-success"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100"
      style={{ background: "linear-gradient(135deg, #d0f0c0, #b2dfdb)" }}
    >
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-success shadow-lg">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold fs-4">
            💊 Farmacia Salud+ | Empleado: {userName}
          </span>
          <button onClick={handleLogout} className="btn btn-outline-light">
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido Principal */}
      <div className="container py-4">
        {/* Estadísticas */}
        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100 bg-white rounded-4">
              <div className="card-body text-center p-4">
                <Package size={40} className="text-primary mb-3" />
                <h3 className="fw-bold text-primary">{stats.totalProductos}</h3>
                <p className="text-muted mb-0">Productos Totales</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100 bg-white rounded-4">
              <div className="card-body text-center p-4">
                <TrendingUp size={40} className="text-warning mb-3" />
                <h3 className="fw-bold text-warning">{stats.stockBajo}</h3>
                <p className="text-muted mb-0">Stock Bajo</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100 bg-white rounded-4">
              <div className="card-body text-center p-4">
                <ShoppingBag size={40} className="text-success mb-3" />
                <h3 className="fw-bold text-success">{stats.ventasHoy}</h3>
                <p className="text-muted mb-0">Ventas Hoy</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100 bg-white rounded-4">
              <div className="card-body text-center p-4">
                <ClipboardList size={40} className="text-info mb-3" />
                <h3 className="fw-bold text-info">{stats.movimientosHoy}</h3>
                <p className="text-muted mb-0">Movimientos Hoy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Módulos del Empleado */}
        <div className="row g-4">
          {/* Registrar Venta */}
          <div className="col-md-6 col-lg-4">
            <div className="card border-0 shadow hover-lift h-100 rounded-4">
              <div className="card-body p-4 text-center">
                <div className="bg-primary text-white rounded-circle p-3 d-inline-flex mb-3">
                  <ShoppingBag size={32} />
                </div>
                <h5 className="fw-bold text-primary">Registrar Venta</h5>
                <p className="text-muted mb-4">
                  Crear nueva venta con múltiples productos
                </p>
                <button
                  onClick={handleNavegarRegistrarVenta}
                  className="btn btn-primary w-100 fw-semibold"
                >
                  Ir a Ventas
                </button>
              </div>
            </div>
          </div>

          {/* Consultar Productos */}
          <div className="col-md-6 col-lg-4">
            <div className="card border-0 shadow hover-lift h-100 rounded-4">
              <div className="card-body p-4 text-center">
                <div className="bg-success text-white rounded-circle p-3 d-inline-flex mb-3">
                  <Package size={32} />
                </div>
                <h5 className="fw-bold text-success">Consultar Productos</h5>
                <p className="text-muted mb-4">
                  Ver stock actual y detalles de productos
                </p>
                <button
                  onClick={() => navigate("/empleado/productos")}
                  className="btn btn-success w-100 fw-semibold"
                >
                  Ver Productos
                </button>
              </div>
            </div>
          </div>

          {/* Registrar Salida */}
          <div className="col-md-6 col-lg-4">
            <div className="card border-0 shadow hover-lift h-100 rounded-4">
              <div className="card-body p-4 text-center">
                <div className="bg-warning text-white rounded-circle p-3 d-inline-flex mb-3">
                  <TrendingUp size={32} />
                </div>
                <h5 className="fw-bold text-warning">Registrar Salida</h5>
                <p className="text-muted mb-4">
                  Registrar salida de productos del inventario
                </p>
                <button
                  onClick={() => navigate("/empleado/registrar-salida")}
                  className="btn btn-warning text-white w-100 fw-semibold"
                >
                  Registrar Salida
                </button>
              </div>
            </div>
          </div>

          {/* Mis Ventas */}
          <div className="col-md-6 col-lg-4">
            <div className="card border-0 shadow hover-lift h-100 rounded-4">
              <div className="card-body p-4 text-center">
                <div className="bg-info text-white rounded-circle p-3 d-inline-flex mb-3">
                  <BarChart3 size={32} />
                </div>
                <h5 className="fw-bold text-info">Mis Ventas</h5>
                <p className="text-muted mb-4">
                  Historial personal de ventas registradas
                </p>
                <button
                  onClick={() => navigate("/mis-ventas")}
                  className="btn btn-info text-white w-100 fw-semibold"
                >
                  Ver Mis Ventas
                </button>
              </div>
            </div>
          </div>

          {/* Movimientos */}
          <div className="col-md-6 col-lg-4">
            <div className="card border-0 shadow hover-lift h-100 rounded-4">
              <div className="card-body p-4 text-center">
                <div className="bg-secondary text-white rounded-circle p-3 d-inline-flex mb-3">
                  <ClipboardList size={32} />
                </div>
                <h5 className="fw-bold text-secondary">Movimientos</h5>
                <p className="text-muted mb-4">
                  Ver entradas y salidas de inventario
                </p>
                <button
                  onClick={() => navigate("/empleado/movimientos")}
                  className="btn btn-secondary text-white w-100 fw-semibold"
                >
                  Ver Movimientos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}