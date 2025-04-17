import React from "react";
import { Navigate } from "react-router-dom";

export default function Signup() {
  // Redirect legacy signup route to landing page
  return <Navigate to="/" replace />;
}
