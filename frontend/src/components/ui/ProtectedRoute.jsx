import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom"; 
import { jwtDecode } from 'jwt-decode';
import api from "../utils/axios";
import Spinner from "../ui/Spinner";

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null); // Use null to show Spinner while loading
  const location = useLocation();

  const refreshAuth = async () => {
    const refreshToken = localStorage.getItem("refresh");
    try {
      const res = await api.post("/token/refresh/", { refresh: refreshToken });
      if (res.status === 200) {
        localStorage.setItem("access", res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Refresh token error:", error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const expiry = decoded.exp;
      const timeNow = Date.now() / 1000;

      if (expiry < timeNow) {
        await refreshAuth(); // Token expired, try refreshing
      } else {
        setIsAuthorized(true); // Token valid
      }
    } catch (err) {
      console.error("Token decode error:", err);
      setIsAuthorized(false);
    }
  };

  useEffect(() => {
    auth();
  }, []);

  if (isAuthorized === null) return <Spinner />;

  return isAuthorized ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default ProtectedRoute;
