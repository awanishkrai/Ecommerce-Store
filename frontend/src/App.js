import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CartPage from "./pages/CartPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Navigation from "./components/Navigation";
import CartDrawer from "./components/CartDrawer";
import NotFoundPage from "./pages/NotFoundPage";
import { useAuth } from "./hooks/useAuth";
import UserDashboard from "./pages/userDashboard";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || "pk_test_sample");

// Private route guards
const UserPrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const AdminPrivateRoute = ({ children }) => {
  const { admin } = useAuth();
  return admin ? children : <Navigate to="/admin/login" replace />;
};

const App = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Elements stripe={stripePromise}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.875rem",
            background: "#161412",
            color: "#F7F5F1",
            borderRadius: "2px",
          },
        }}
      />

      {/* Navigation — receives openCart handler to wire the bag icon */}
      <Navigation onOpenCart={() => setIsCartOpen(true)} />

      {/* Cart drawer — rendered outside Routes so it persists across pages */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* User Protected Routes */}
        <Route
          path="/cart"
          element={
            <UserPrivateRoute>
              <CartPage />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/user/dashboard"
          element={
            <UserPrivateRoute>
              <UserDashboard />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <UserPrivateRoute>
              <OrderDetailsPage />
            </UserPrivateRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminPrivateRoute>
              <AdminDashboard />
            </AdminPrivateRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Elements>
  );
};

export default App;
