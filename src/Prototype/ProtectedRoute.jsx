import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  // If the user is not logged in, send them to /login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the protected page
  return children;
}