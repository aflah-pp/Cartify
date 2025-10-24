import React, { useEffect, useState } from "react";
import MainLayout from "./components/layout/MainLayout";
import { BrowserRouter, Routes, Route } from "react-router";
import Page404 from "./components/ui/Page404";
import Product from "./components/product/Product";
import api from "./components/utils/axios";
import CartPage from "./components/cart/CartPage";
import CheckOutPage from "./components/checkout/CheckOutPage";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import { AuthProvider } from "./components/context/AuthContext";
import UserProfile from "./components/profile/UserProfile";
import PaymentInitiating from "./components/payment/PaymentInitiating";
import PaymentStatus from "./components/payment/PaymentStatus";
import Main from "./components/home/MainPage";
import AboutPage from "./components/home/About";
import SellerDashboard from "./components/seller/SellerDashboard";
import SellerPage from "./components/seller/SellerPage";
import SellerRegister from "./components/seller/SellerRegister";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HelpPage from "./components/Help/HelpPage";

function App() {
  const [numCartItems, setNumCartItems] = useState(0);
  const cart_code = localStorage.getItem("cart_code");

  useEffect(
    function () {
      if (cart_code) {
        api
          .get(`get_cart_stat?cart_code=${cart_code}`)
          .then((res) => {
            setNumCartItems(res.data.total_items || 0); // Update state here
          })
          .catch((err) => {
            console.log("Cart stat fetch error:", err.message);
          });
      }
    },
    [cart_code]
  );

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main numCartItems={numCartItems} />} />
          <Route
            path="/about"
            element={<AboutPage numCartItems={numCartItems} />}
          />
          <Route index element={<Main />} />
          <Route
            path="/shop"
            element={<MainLayout numCartItems={numCartItems} />}
          />
          <Route
            path="product/:slug"
            element={
              <Product
                numCartItems={numCartItems}
                setNumCartItems={setNumCartItems}
              />
            }
          />
          <Route
            path="cart"
            element={
              <CartPage
                numCartItems={numCartItems}
                setNumCartItems={setNumCartItems}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckOutPage numCartItems={numCartItems} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={<UserProfile numCartItems={numCartItems} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<PaymentInitiating />} />
          <Route path="/payment-status" element={<PaymentStatus />} />
          <Route path="/seller" element={<SellerPage />} />
          <Route path="/upgrade-to-seller" element={<SellerRegister />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />

          <Route path="/help" element={<HelpPage />} />
          <Route path="*" element={<Page404 />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
