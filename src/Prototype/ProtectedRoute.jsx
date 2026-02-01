import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  // If the user is not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, allow access
  return children;
}
