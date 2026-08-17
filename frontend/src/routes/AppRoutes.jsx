import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Home from "../pages/customer/Home";

import Dashboard from "../pages/admin/Dashboard";
import Categories from "../pages/admin/Categories";
import Foods from "../pages/admin/Foods";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================================= */}
      {/* PUBLIC ROUTES */}
      {/* ================================= */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* ================================= */}
      {/* CUSTOMER ROUTES */}
      {/* ================================= */}

      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />

        {/* Future customer routes */}
        {/* 
        <Route path="/foods" element={<Foods />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        */}
      </Route>

      {/* ================================= */}
      {/* ADMIN ROUTES */}
      {/* ================================= */}

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />

          <Route path="/admin/categories" element={<Categories />} />

          <Route path="/admin/foods" element={<Foods />} />

          {/* Future admin routes */}
          {/*
          <Route
            path="/admin/orders"
            element={<Orders />}
          />

          <Route
            path="/admin/payments"
            element={<Payments />}
          />

          <Route
            path="/admin/feedback"
            element={<Feedback />}
          />

          <Route
            path="/admin/customers"
            element={<Customers />}
          />
          */}
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
