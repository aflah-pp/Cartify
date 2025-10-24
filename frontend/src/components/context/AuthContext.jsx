import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../utils/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [username, setUsername] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [token, setToken] = useState(null); // <-- add this

  const handleAuth = () => {
    const accessToken = localStorage.getItem("access");
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        const expiry = decoded.exp;
        const time_now = Date.now() / 1000;

        if (expiry > time_now) {
          setIsAuthorized(true);
          setToken(accessToken); // <-- set token here
        } else {
          setIsAuthorized(false);
          setToken(null);
        }
      } catch (err) {
        console.error("Token decode error:", err.message);
        setIsAuthorized(false);
        setToken(null);
      }
    } else {
      setIsAuthorized(false);
      setToken(null);
    }
  };

  const getUserInfo = () => {
    api
      .get("get_username") // Or your user profile endpoint
      .then((res) => {
        setUsername(res.data.username);
        setIsSeller(res.data.is_seller);
      })
      .catch((err) => {
        console.log("Error fetching user info:", err.message);
        setUsername("");
        setIsSeller(false);
      });
  };

  useEffect(() => {
    handleAuth();
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      getUserInfo();
    }
  }, [isAuthorized]);

  const AuthValue = {
    isAuthorized,
    setIsAuthorized,
    username,
    isSeller,
    token,
  }; // expose token

  return (
    <AuthContext.Provider value={AuthValue}>{children}</AuthContext.Provider>
  );
}
