// PerfilClienteCRUD.jsx - VERSIÓN MEJORADA CON ESTILOS DINÁMICOS
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft, User, Mail, Phone, Edit, Save, X, Trash2, Shield } from "lucide-react";

export default function PerfilClienteCRUD() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Cargar perfil
  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        navigate("/login");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.user_id;

      const res = await api.get(`/farmacia/clientes/?usuario=${userId}`);
      const clienteData = res.data[0];
      setPerfil(clienteData);
      setFormData({
        nombre: clienteData.nombre,
        correo: clienteData.correo,
        telefono: clienteData.telefono
      });
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  // Guardar cambios con animación
  const guardarCambios = async () => {
    setSaving(true);
    try {
      await api.patch(`/farmacia/clientes/${perfil.id}/`, formData);
      setPerfil({ ...perfil, ...formData });
      setEditMode(false);
      
      // Animación de éxito
      const saveBtn = document.querySelector('.btn-success');
      if (saveBtn) {
        saveBtn.classList.add('btn-pulse');
        setTimeout(() => saveBtn.classList.remove('btn-pulse'), 600);
      }
      
      setTimeout(() => {
        alert("✅ Perfil actualizado exitosamente");
      }, 300);
      
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("❌ Error al actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  // Eliminar cuenta
  const eliminarCuenta = async () => {
    try {
      await api.delete(`/farmacia/clientes/${perfil.id}/`);
      localStorage.clear();
      
      // Animación de despedida
      document.querySelector('.card')?.classList.add('fade-out');
      setTimeout(() => {
        alert("👋 Cuenta eliminada exitosamente");
        navigate("/login");
      }, 500);
      
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("❌ Error al eliminar la cuenta");
    }
  };

  // Cancelar edición con animación
  const cancelarEdicion = () => {
    setFormData({
      nombre: perfil.nombre,
      correo: perfil.correo,
      telefono: perfil.telefono
    });
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(135deg, #d0f0c0, #b2dfdb)" }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 py-5" style={{ background: "linear-gradient(135deg, #d0f0c0, #b2dfdb)" }}>
      <div className="container" style={{ maxWidth: "650px" }}>
        
        {/* Header con botones animados */}
        <div className="d-flex justify-content-between align-items-center mb-4 animate-slide-down">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-outline-success d-flex align-items-center gap-2 shadow-sm hover-lift"
          >
            <ArrowLeft size={18} />
            Volver
          </button>
          
          {!editMode ? (
            <button 
              onClick={() => setEditMode(true)} 
              className="btn btn-success d-flex align-items-center gap-2 shadow-sm hover-lift pulse-on-hover"
            >
              <Edit size={18} />
              Editar Perfil
            </button>
          ) : (
            <div className="d-flex gap-2">
              <button 
                onClick={cancelarEdicion} 
                className="btn btn-outline-secondary d-flex align-items-center gap-2 shadow-sm hover-lift"
              >
                <X size={18} />
                Cancelar
              </button>
              <button 
                onClick={guardarCambios} 
                disabled={saving} 
                className="btn btn-success d-flex align-items-center gap-2 shadow-sm hover-lift"
              >
                {saving ? (
                  <>
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Guardar
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Tarjeta principal con efectos */}
        <div className="card shadow-lg border-0 rounded-4 overflow-hidden hover-lift transition-all">
          <div className="bg-success text-white p-5 text-center position-relative overflow-hidden">
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-white opacity-10 wave-animation"></div>
            <div className="position-relative">
              <div className="bg-white text-success rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center shadow-lg icon-bounce"
                   style={{ width: '80px', height: '80px' }}>
                <User size={36} />
              </div>
              <h3 className="fw-bold fs-4 mb-1">Mi Perfil</h3>
              <p className="opacity-90 mb-0">Gestiona tu información personal</p>
            </div>
          </div>

          <div className="card-body p-5">
            <div className="space-y-4">
              {/* Campo Nombre */}
              <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light hover-glow transition-all">
                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                     style={{ width: '45px', height: '45px' }}>
                  <User size={20} />
                </div>
                <div className="flex-grow-1">
                  <small className="text-muted fw-semibold">Nombre completo</small>
                  {editMode ? (
                    <input
                      type="text"
                      className="form-control mt-1 border-success shadow-sm focus-glow"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    />
                  ) : (
                    <p className="fw-bold text-dark mb-0 fs-5">{perfil.nombre}</p>
                  )}
                </div>
              </div>

              {/* Campo Email */}
              <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light hover-glow transition-all">
                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                     style={{ width: '45px', height: '45px' }}>
                  <Mail size={20} />
                </div>
                <div className="flex-grow-1">
                  <small className="text-muted fw-semibold">Correo electrónico</small>
                  {editMode ? (
                    <input
                      type="email"
                      className="form-control mt-1 border-success shadow-sm focus-glow"
                      value={formData.correo}
                      onChange={(e) => setFormData({...formData, correo: e.target.value})}
                    />
                  ) : (
                    <p className="fw-bold text-dark mb-0 fs-5">{perfil.correo}</p>
                  )}
                </div>
              </div>

              {/* Campo Teléfono */}
              <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light hover-glow transition-all">
                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                     style={{ width: '45px', height: '45px' }}>
                  <Phone size={20} />
                </div>
                <div className="flex-grow-1">
                  <small className="text-muted fw-semibold">Teléfono</small>
                  {editMode ? (
                    <input
                      type="text"
                      className="form-control mt-1 border-success shadow-sm focus-glow"
                      value={formData.telefono}
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    />
                  ) : (
                    <p className="fw-bold text-dark mb-0 fs-5">{perfil.telefono}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sección de acciones peligrosas */}
            {!editMode && (
              <div className="text-center mt-5 pt-4 border-top">
                <button 
                  onClick={() => setShowDeleteConfirm(true)} 
                  className="btn btn-outline-danger d-flex align-items-center gap-2 mx-auto hover-shake"
                >
                  <Trash2 size={16} />
                  Eliminar Mi Cuenta
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal de confirmación para eliminar cuenta */}
        {showDeleteConfirm && (
          <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title d-flex align-items-center gap-2">
                    <Shield size={20} />
                    Confirmar Eliminación
                  </h5>
                </div>
                <div className="modal-body text-center p-4">
                  <div className="text-danger mb-3">
                    <Trash2 size={48} />
                  </div>
                  <h6 className="fw-bold">¿Estás seguro de eliminar tu cuenta?</h6>
                  <p className="text-muted mb-0">
                    Esta acción no se puede deshacer. Se perderán todos tus datos y historial de compras.
                  </p>
                </div>
                <div className="modal-footer justify-content-center border-0">
                  <button 
                    onClick={() => setShowDeleteConfirm(false)} 
                    className="btn btn-outline-secondary px-4"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={eliminarCuenta} 
                    className="btn btn-danger px-4 d-flex align-items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Sí, Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Estilos CSS para animaciones */}
      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
        
        .hover-glow:hover {
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);
        }
        
        .focus-glow:focus {
          box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
          border-color: #28a745;
        }
        
        .pulse-on-hover:hover {
          animation: pulse 1s infinite;
        }
        
        .hover-shake:hover {
          animation: shake 0.5s;
        }
        
        .btn-pulse {
          animation: pulse 0.6s;
        }
        
        .fade-out {
          animation: fadeOut 0.5s forwards;
        }
        
        .wave-animation {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: wave 6s infinite linear;
        }
        
        .icon-bounce {
          animation: bounce 2s infinite;
        }
        
        .animate-slide-down {
           animation: slideDown 2s ease-out ;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes fadeOut {
          to { opacity: 0; transform: scale(0.95); }
        }
        
        @keyframes wave {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}