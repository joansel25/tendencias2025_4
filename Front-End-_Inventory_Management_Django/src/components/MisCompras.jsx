import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // ✅ Corregido: "../services/api"
import { ArrowLeft, ShoppingCart, Download } from "lucide-react";

export default function MisCompras() {
  const navigate = useNavigate();
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const cargarMisDetalles = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          navigate("/login");
          return;
        }

        const detallesRes = await api.get("/farmacia/detallesventa/mis_detalles/");
        console.log("Datos recibidos:", detallesRes.data); // Debug
        setDetalles(detallesRes.data);

      } catch (error) {
        console.error("Error al cargar compras:", error);
        if (error.response?.status === 403) {
          alert("No tienes permisos para ver esta informaciÃ³n. AsegÃºrate de estar registrado como cliente.");
        } else {
          alert("No se pudieron cargar tus compras.");
        }
      } finally {
        setLoading(false);
      }
    };

    cargarMisDetalles();
  }, [navigate]);

  const descargarPDF = async () => {
    setDownloading(true);
    try {
      const response = await api.get("/farmacia/detallesventa/all_pdf_cliente/", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "mis_compras.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      if (error.response?.status === 403) {
        alert("No tienes permiso para descargar el PDF.");
      } else {
        alert("Error al generar el PDF.");
      }
    } finally {
      setDownloading(false);
    }
  };

  // Calcular el total general de todos los subtotales
  const calcularTotalGeneral = () => {
    return detalles.reduce((acc, d) => acc + Number(d.subtotal || 0), 0);
  };

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

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100 py-5"
      style={{ background: "linear-gradient(135deg, #d0f0c0, #b2dfdb)" }}
    >
      <div className="container" style={{ maxWidth: "900px" }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline-success d-flex align-items-center gap-2 mb-4 shadow-sm"
        >
          <ArrowLeft size={18} />
          Volver
        </button>

        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
          <div className="bg-success text-white p-4 text-center">
            <h3 className="fw-bold d-flex align-items-center justify-content-center gap-2">
              <ShoppingCart size={28} />
              Mis Compras
            </h3>
          </div>

          <div className="card-body p-4">
            {detalles.length === 0 ? (
              <div className="text-center py-5">
                <ShoppingCart size={64} className="text-success opacity-50 mb-3" />
                <p className="text-muted fs-5">AÃºn no has realizado compras.</p>
              </div>
            ) : (
              <>
                <div className="text-end mb-3">
                  <button
                    onClick={descargarPDF}
                    disabled={downloading}
                    className="btn btn-success d-flex align-items-center gap-2 shadow-sm ms-auto"
                  >
                    {downloading ? (
                      <>Generando PDF...</>
                    ) : (
                      <>
                        <Download size={18} />
                        Descargar PDF Completo
                      </>
                    )}
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-success">
                      <tr>
                        <th>Fecha</th>
                        <th>Producto</th>
                        <th>Cant.</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detalles.map((d) => {
                        // Extraer la fecha correctamente
                        // REEMPLAZA las líneas 107-108 con esto:
                        const fecha = d.factura_fecha || d.id_factura?.fecha || null;
                        const producto = d.producto_nombre || d.id_producto?.nombre || 'Producto no disponible';
                        
                        return (
                          <tr key={d.id}>
                            <td>
                              {fecha 
                                ? new Date(fecha).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                  })
                                : 'Fecha no disponible'
                              }
                            </td>
                            <td>{producto}</td>
                            <td>{d.cantidad}</td>
                            <td>${Number(d.precio_unitario || 0).toFixed(2)}</td>
                            <td className="fw-bold">${Number(d.subtotal || 0).toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="table-success">
                        <td colSpan="4" className="text-end fw-bold fs-5">Total General:</td>
                        <td className="fw-bold text-success fs-5">
                          ${calcularTotalGeneral().toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Card con resumen total */}
                <div className="card border-success mt-4">
                  <div className="card-body bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fs-4 fw-bold text-success">
                        Total de todas tus compras:
                      </span>
                      <span className="fs-3 fw-bold text-success">
                        ${calcularTotalGeneral().toFixed(2)}
                      </span>
                    </div>
                    <small className="text-muted">
                      Total de {detalles.length} {detalles.length === 1 ? 'producto' : 'productos'} comprados
                    </small>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}