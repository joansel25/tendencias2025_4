// src/components/Register.jsx
import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/farmacia/clientes/", {
        nombre,
        correo,
        telefono,
        usuario: {
          username,
          password,
        },
      });

      alert("Registro exitoso. Inicia sesión.");
      navigate("/");
    } catch (error) {
      const msg =
        error.response?.data?.correo?.[0] ||
        error.response?.data?.telefono?.[0] ||
        error.response?.data?.usuario?.username?.[0] ||
        "Error al registrar. Verifica los datos.";
      alert(msg);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(135deg, #c8e6c9, #e8f5e9)" }}>
      <div className="card shadow-lg p-4 rounded-4" style={{ width: "400px" }}>
        <h3 className="text-center text-success mb-4 fw-bold">Registro de Cliente</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Nombre</label>
            <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Correo</label>
            <input type="email" className="form-control" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Teléfono</label>
            <input type="text" className="form-control" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Usuario</label>
            <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Contraseña</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-success w-100 fw-bold shadow-sm">
            Registrarme
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/" className="text-success text-decoration-none">¿Ya tienes cuenta? Inicia sesión</Link>
        </div>

        <small className="d-block text-center text-muted mt-2">
          Solo clientes pueden registrarse aquí.
        </small>
      </div>
    </div>
  );
}

export default Register;