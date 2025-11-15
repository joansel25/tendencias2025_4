import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Plus, Edit, Trash2, ArrowLeft, Download } from "lucide-react";
import api from "../services/api";

export default function Productos() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    stock: "",
    id_categoria: "",
    id_proveedor: ""
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [prodRes, catRes, provRes] = await Promise.all([
        api.get("/farmacia/productos/"),
        api.get("/farmacia/categorias/"),
        api.get("/farmacia/proveedores/")
      ]);
      
      setProductos(prodRes.data);
      setCategorias(catRes.data);
      setProveedores(provRes.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
      alert("Error al cargar los datos");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (productoEdit) {
        await api.patch(`/farmacia/productos/${productoEdit.id}/`, formData);
        alert("✅ Producto actualizado");
      } else {
        await api.post("/farmacia/productos/", formData);
        alert("✅ Producto creado");
      }
      setShowModal(false);
      setProductoEdit(null);
      setFormData({ nombre: "", precio: "", stock: "", id_categoria: "", id_proveedor: "" });
      cargarDatos();
    } catch (error) {
      console.error(" ❌ Error al guardar producto:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await api.delete(`/farmacia/productos/${id}/`);
        alert("✅ Producto eliminado");
        cargarDatos();
      } catch (error) {
        console.error(" ❌ Error al eliminar producto:", error);
      }
    }
  };

  const descargarPDF = async () => {
    try {
      const response = await api.get("/farmacia/productos/all_pdf/", {
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "productos.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button onClick={() => navigate(-1)} className="btn btn-outline-success">
          <ArrowLeft size={18} /> Volver
        </button>
        <div className="d-flex gap-2">
          <button onClick={descargarPDF} className="btn btn-outline-success">
            <Download size={18} /> PDF
          </button>
          <button onClick={() => setShowModal(true)} className="btn btn-success">
            <Plus size={18} /> Nuevo Producto
          </button>
        </div>
      </div>

      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-header bg-success text-white py-3">
          <h4 className="mb-0 d-flex align-items-center">
            <Package className="me-2" /> Gestión de Productos
          </h4>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-success">
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Valor Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id}>
                    <td className="fw-bold">{p.nombre}</td>
                    <td>{p.id_categoria?.nombre}</td>
                    <td>${parseFloat(p.precio).toFixed(2)}</td>
                    <td>
                      <span className={p.stock < 10 ? "text-danger fw-bold" : ""}>
                        {p.stock}
                      </span>
                    </td>
                    <td>${(p.precio * p.stock).toFixed(2)}</td>
                    <td>
                      {p.low_stock ? (
                        <span className="badge bg-danger">Stock Bajo</span>
                      ) : (
                        <span className="badge bg-success">Normal</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button 
                          onClick={() => {
                            setProductoEdit(p);
                            setFormData({
                              nombre: p.nombre,
                              precio: p.precio,
                              stock: p.stock,
                              id_categoria: p.id_categoria?.id,
                              id_proveedor: p.id_proveedor?.id
                            });
                            setShowModal(true);
                          }}
                          className="btn btn-outline-primary btn-sm"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="btn btn-outline-danger btn-sm"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal para crear/editar producto */}
      {showModal && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  {productoEdit ? 'Editar Producto' : 'Nuevo Producto'}
                </h5>
                <button type="button" className="btn-close btn-close-white" 
                  onClick={() => {
                    setShowModal(false);
                    setProductoEdit(null);
                    setFormData({ nombre: "", precio: "", stock: "", id_categoria: "", id_proveedor: "" });
                  }}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Nombre del Producto</label>
                    <input type="text" className="form-control" 
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      required />
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Precio</label>
                        <input type="number" step="0.01" className="form-control"
                          value={formData.precio}
                          onChange={(e) => setFormData({...formData, precio: e.target.value})}
                          required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Stock</label>
                        <input type="number" className="form-control"
                          value={formData.stock}
                          onChange={(e) => setFormData({...formData, stock: e.target.value})}
                          required />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Categoría</label>
                    <select className="form-select"
                      value={formData.id_categoria}
                      onChange={(e) => setFormData({...formData, id_categoria: e.target.value})}
                      required>
                      <option value="">Seleccionar categoría</option>
                      {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Proveedor</label>
                    <select className="form-select"
                      value={formData.id_proveedor}
                      onChange={(e) => setFormData({...formData, id_proveedor: e.target.value})}
                      required>
                      <option value="">Seleccionar proveedor</option>
                      {proveedores.map(prov => (
                        <option key={prov.id} value={prov.id}>{prov.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" 
                      onClick={() => {
                        setShowModal(false);
                        setProductoEdit(null);
                        setFormData({ nombre: "", precio: "", stock: "", id_categoria: "", id_proveedor: "" });
                      }}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-success">
                      {productoEdit ? 'Actualizar' : 'Crear'} Producto
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}