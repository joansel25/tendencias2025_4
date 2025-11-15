// src/pages/empleado/ConsultarProductos.jsx - VERSIÓN CORREGIDA
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  ArrowLeft,
  Download,
  Search,
  AlertTriangle,
} from "lucide-react";
import api from "../services/api";

export default function ConsultarProductos() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterStock, setFilterStock] = useState("");

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await api.get("/farmacia/productos/");
        setProductos(response.data);
      } catch (error) {
        console.error("Error cargando productos:", error);
        alert("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };
    cargarProductos();
  }, []);
  const descargarPDF = async () => {
    try {
      const response = await api.get("/farmacia/productos/all_pdf/", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "inventario_productos.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      alert("Error al descargar el PDF");
    }
  };

  const productosFiltrados = productos.filter((producto) => {
    // CORRECCIÓN: Manejar valores undefined/nulos
    const nombreProducto = producto.nombre?.toLowerCase() || "";
    const nombreCategoria = producto.id_categoria?.nombre?.toLowerCase() || "";
    const terminoBusqueda = searchTerm.toLowerCase();

    const matchesSearch =
      nombreProducto.includes(terminoBusqueda) ||
      nombreCategoria.includes(terminoBusqueda);

    const matchesCategoria =
      !filterCategoria || producto.id_categoria?.nombre === filterCategoria;

    const matchesStock =
      !filterStock ||
      (filterStock === "bajo"
        ? (producto.stock || 0) < 10
        : filterStock === "sin"
        ? (producto.stock || 0) === 0
        : filterStock === "disponible"
        ? (producto.stock || 0) >= 10
        : true);

    return matchesSearch && matchesCategoria && matchesStock;
  });

  const categoriasUnicas = [
    ...new Set(productos.map((p) => p.id_categoria?.nombre).filter(Boolean)),
  ];

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
      className="min-vh-100"
      style={{ background: "linear-gradient(135deg, #d0f0c0, #b2dfdb)" }}
    >
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button
            onClick={() => navigate("/empleado")}
            className="btn btn-outline-success"
          >
            <ArrowLeft size={18} /> Volver al Dashboard
          </button>
          <h1 className="text-success d-flex align-items-center">
            <Package className="me-2" /> Inventario de Productos
          </h1>
          <button onClick={descargarPDF} className="btn btn-outline-success">
            <Download size={18} /> Descargar PDF
          </button>
        </div>

        {/* Filtros Mejorados */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar productos o categorías..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filterCategoria}
                  onChange={(e) => setFilterCategoria(e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  {categoriasUnicas.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filterStock}
                  onChange={(e) => setFilterStock(e.target.value)}
                >
                  <option value="">Todo el stock</option>
                  <option value="disponible">Stock Disponible</option>
                  <option value="bajo">Stock Bajo</option>
                  <option value="sin">Sin Stock</option>
                </select>
              </div>
              <div className="col-md-2 text-center">
                <span className="badge bg-success fs-6">
                  {productosFiltrados.length} productos
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Productos */}
        <div className="card shadow-lg border-0">
          <div className="card-header bg-success text-white py-3">
            <h4 className="mb-0 d-flex align-items-center">
              <Package className="me-2" /> Lista de Productos
            </h4>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-success">
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Proveedor</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map((producto) => (
                    <tr
                      key={producto.id}
                      className={
                        producto.stock === 0
                          ? "table-danger"
                          : producto.stock < 10
                          ? "table-warning"
                          : ""
                      }
                    >
                      <td>
                        <div className="d-flex align-items-center">
                          <Package size={20} className="text-success me-2" />
                          <strong>{producto.nombre}</strong>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-secondary">
                          {producto.id_categoria?.nombre || "N/A"}
                        </span>
                      </td>
                      <td className="fw-bold text-success">
                        ${parseFloat(producto.precio).toFixed(2)}
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span
                            className={
                              producto.stock < 10
                                ? "text-danger fw-bold"
                                : "text-success fw-bold"
                            }
                          >
                            {producto.stock} unidades
                          </span>
                          {producto.stock < 10 && producto.stock > 0 && (
                            <AlertTriangle
                              size={16}
                              className="text-warning ms-2"
                            />
                          )}
                        </div>
                      </td>
                      <td>{producto.id_proveedor?.nombre || "N/A"}</td>
                      <td>
                        {producto.stock === 0 ? (
                          <span className="badge bg-danger">Sin Stock</span>
                        ) : producto.stock < 10 ? (
                          <span className="badge bg-warning">Stock Bajo</span>
                        ) : (
                          <span className="badge bg-success">Disponible</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {productosFiltrados.length === 0 && (
              <div className="text-center py-5">
                <Package size={64} className="text-muted mb-3" />
                <h5 className="text-muted">No se encontraron productos</h5>
                <p className="text-muted">
                  Intenta con otros términos de búsqueda
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
