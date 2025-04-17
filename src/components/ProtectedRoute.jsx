import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <div className="text-text-secondary text-lg">Loading...</div>
      </div>
    );
  }

if (!user) {
    return <Navigate to="/" replace />;
}

  return children;
}
