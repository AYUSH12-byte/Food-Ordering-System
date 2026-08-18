import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Home from "../pages/customer/Home";
import Foods from "../pages/customer/Foods";

import Dashboard from "../pages/admin/Dashboard";
import Categories from "../pages/admin/Categories";
import AdminFoods from "../pages/admin/Foods";

const AppRoutes = () => {
  return (
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

        <Route path="/foods" element={<Foods />} />
      </Route>

      {/* ================================= */}
      {/* ADMIN */}
      {/* ================================= */}

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />

          <Route path="/admin/categories" element={<Categories />} />

          <Route path="/admin/foods" element={<AdminFoods />} />
        </Route>
      </Route>

      {/* ================================= */}
      {/* FALLBACK */}
      {/* ================================= */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
