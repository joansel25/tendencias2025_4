import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft, ShoppingCart, User, FileText, LogOut, DollarSign, Package } from "lucide-react";

export default function ClienteDashboard() {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatosCliente = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          navigate("/login");
          return;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.user_id;

        // Obtener datos del cliente
        const clienteRes = await api.get(`/farmacia/clientes/?usuario=${userId}`);
        const clienteData = clienteRes.data[0];
        
        if (!clienteData) {
          alert("No se encontró tu perfil de cliente. Contacta al administrador.");
          navigate("/login");
          return;
        }
        
        setCliente(clienteData);

        // ✅ CAMBIO: Usar el endpoint específico para clientes
        const facturasRes = await api.get("/farmacia/facturasventa/mis_facturas/");
        setFacturas(facturasRes.data);
        
      } catch (error) {
        console.error("Error cargando datos:", error);
        if (error.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else if (error.response?.status === 403) {
          alert("Tu cuenta no está registrada como cliente. Contacta al administrador.");
        } else {
          alert("Error al cargar los datos del dashboard.");
        }
      } finally {
        setLoading(false);
      }
    };

    cargarDatosCliente();
  }, [navigate]);



  const totalGastado = facturas.reduce((sum, f) => sum + parseFloat(f.total), 0).toFixed(2);
  const ultimaCompra = facturas.length > 0
    ? new Date(Math.max(...facturas.map(f => new Date(f.fecha)))).toLocaleDateString()
    : "Nunca";

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ background: "linear-gradient(135deg, #d0f0c0, #b2dfdb)" }}
      >
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ background: "linear-gradient(135deg, #d0f0c0, #b2dfdb)" }}
      >
        <div className="text-center">
          <p className="text-danger fw-bold">No se encontró tu perfil.</p>
          <button
            onClick={() => navigate("/login")}
            className="btn btn-success mt-3"
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100 py-5"
      style={{
        background: "linear-gradient(135deg, #d0f0c0, #b2dfdb)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div className="container" style={{ maxWidth: "900px" }}>
        <div className="mb-3">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline-success d-flex align-items-center gap-2 shadow-sm"
          >
            <ArrowLeft size={18} />
            Volver
          </button>
        </div>

        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
          <div className="bg-success text-white p-4 text-center">
            <h2 className="fw-bold d-flex align-items-center justify-content-center gap-3">
              <Package size={32} />
              Bienvenido, {cliente.nombre}
            </h2>
            <p className="mb-0 opacity-90">{cliente.correo} • {cliente.telefono}</p>
          </div>

          <div className="card-body p-5">
            <div className="row g-4 mb-5">
              <div className="col-md-4">
                <div className="bg-light border border-success rounded-3 p-4 text-center shadow-sm">
                  <DollarSign size={36} className="text-success mb-2" />
                  <h5 className="fw-bold text-success">${totalGastado}</h5>
                  <small className="text-muted">Total Gastado</small>
                </div>
              </div>
              <div className="col-md-4">
                <div className="bg-light border border-primary rounded-3 p-4 text-center shadow-sm">
                  <ShoppingCart size={36} className="text-primary mb-2" />
                  <h5 className="fw-bold text-primary">{facturas.length}</h5>
                  <small className="text-muted">Compras</small>
                </div>
              </div>
              <div className="col-md-4">
                <div className="bg-light border border-warning rounded-3 p-4 text-center shadow-sm">
                  <FileText size={36} className="text-warning mb-2" />
                  <h5 className="fw-bold text-warning">{ultimaCompra}</h5>
                  <small className="text-muted">Última Compra</small>
                </div>
              </div>
            </div>

            <div className="row g-4 mb-5">
              <div className="col-md-6">
                <Link
                  to="/cliente/mis-compras"
                  className="btn btn-outline-success btn-lg w-100 d-flex align-items-center justify-content-center gap-3 p-4 shadow-sm hover-shadow-lg transition-all"
                >
                  <ShoppingCart size={28} />
                  <div className="text-start">
                    <div className="fw-bold">Mis Compras</div>
                    <small>Historial y facturas</small>
                  </div>
                </Link>
              </div>
              <div className="col-md-6">
                <Link
                  to="/cliente/perfil"
                  className="btn btn-outline-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-3 p-4 shadow-sm hover-shadow-lg transition-all"
                >
                  <User size={28} />
                  <div className="text-start">
                    <div className="fw-bold">Mi Perfil</div>
                    <small>Editar mis datos</small>
                  </div>
                </Link>
              </div>
            </div>

            {facturas.length > 0 && (
              <div className="mt-5">
                <h4 className="fw-bold text-success mb-3 d-flex align-items-center gap-2">
                  <FileText size={24} />
                  Últimas Compras
                </h4>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-success">
                      <tr>
                        <th>Fecha</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {facturas.slice(0, 4).map((f) => (
                        <tr key={f.id}>
                          <td>{new Date(f.fecha).toLocaleDateString()}</td>
                          <td className="fw-bold text-success">${f.total}</td>
                          <td>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {facturas.length > 4 && (
                  <div className="text-center">
                    <Link to="/cliente/mis-compras" className="text-success fw-bold">
                      Ver todas →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="card-footer bg-light text-center p-3">
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
              className="btn btn-danger d-flex align-items-center gap-2 mx-auto"
            >
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <small className="text-muted">© 2025 Farmacia Salud+ • Sistema de Gestión</small>
        </div>
      </div>
    </div>
  );
}