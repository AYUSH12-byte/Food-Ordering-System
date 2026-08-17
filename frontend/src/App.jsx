import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./routes/ProtectedRoute";

import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Home from "./pages/customer/Home";

import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ================================= */}
          {/* PUBLIC */}
          {/* ================================= */}

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          {/* ================================= */}
          {/* CUSTOMER */}
          {/* ================================= */}

          <Route element={<CustomerLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          {/* ================================= */}
          {/* ADMIN */}
          {/* ================================= */}

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />

              <Route path="/admin/categories" element={<Categories />} />
            </Route>
          </Route>

          {/* ================================= */}
          {/* FALLBACK */}
          {/* ================================= */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
