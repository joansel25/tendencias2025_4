import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/token/",
        {
          username,
          password,
        }
      );

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      const rol = response.data.user?.rol?.trim().toLowerCase();
      localStorage.setItem("rol", rol);

      alert("✅ Inicio de sesión exitoso");

      if (rol === "administrador") {
        navigate("/admin");
      } else if (rol === "empleado") {
        navigate("/empleado");
      } else if (rol === "cliente") {
        navigate("/cliente");
      } else {
        alert("Rol no reconocido");
      }
    } catch (error) {
      console.error("Error de login:", error.response?.data);

      if (error.response?.status === 401) {
        alert("❌ Credenciales incorrectas. Verifica tu usuario y contraseña.");
      } else if (
        error.code === "NETWORK_ERROR" ||
        error.message?.includes("Network Error")
      ) {
        alert(
          "❌ Error de conexión. Verifica que el servidor esté en ejecución."
        );
      } else {
        alert("❌ Error del servidor. Intenta nuevamente más tarde.");
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #d0f0c0, #b2dfdb)",
      }}
    >
      <div className="card shadow-lg p-4 rounded-4" style={{ width: "380px" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-success">💊 Farmacia Salud+</h2>
          <p className="text-muted">Sistema de Gestión de Inventario</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-success">
              Usuario
            </label>
            <input
              type="text"
              className="form-control shadow-sm"
              placeholder="Ingrese su usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-success">
              Contraseña
            </label>
            <input
              type="password"
              className="form-control shadow-sm"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 fw-bold shadow-sm mt-2"
          >
            Ingresar
          </button>
        </form>

        {/* Enlace de registro */}
        <div className="text-center mt-3">
          <p className="text-muted mb-1">¿No tienes cuenta?</p>
          <Link
            to="/register"
            className="fw-bold text-success text-decoration-none"
          >
            Regístrate aquí
          </Link>
        </div>

        <div className="text-center mt-4">
          <small className="text-muted">© 2025 Farmacia Salud+</small>
        </div>
      </div>
    </div>
  );
}

export default Login;
