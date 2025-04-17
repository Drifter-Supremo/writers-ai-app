import React from "react";
import { Navigate } from "react-router-dom";

export default function Login() {
  // Redirect legacy login route to landing page
  return <Navigate to="/" replace />;
}
