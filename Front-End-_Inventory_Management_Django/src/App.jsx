import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import EmpleadoDashboard from "./EmpleadoDashboard";
import ClienteDashboard from "./ClienteDashboard"; // AÑADE ESTO
import Register from "./Register"; 
import PrivateRoute from "./PrivateRoute";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas por rol */}
        <Route
          path="/admin"
          element={
            <PrivateRoute rolPermitido="administrador">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/empleado"
          element={
            <PrivateRoute rolPermitido="empleado">
              <EmpleadoDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/cliente"
          element={
            <PrivateRoute rolPermitido="cliente">
              <ClienteDashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;