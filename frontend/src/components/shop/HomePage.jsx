import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiHelpCircle } from "react-icons/fi"; // Feather icon, you can swap icons
import api from "../utils/axios";
import Header from "./Header";
import CardContainer from "./CardContainer";
import PlaceHolderContainer from "../ui/PlaceHolderContainer";
import Error from "../ui/Error";
import { getOrCreateCartCode } from "../utils/codeGenerator";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.message);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("cart_code")) {
      localStorage.setItem("cart_code", getOrCreateCartCode());
    }
  }, []);

  return (
    <>
      <Header />
      {error && <Error error={error} />}
      {loading && <PlaceHolderContainer />}
      {!loading && !error && <CardContainer products={products} />}

      {/* Floating Help Button */}
      <Link
        to="/help"
        className="fixed bottom-8 right-8 flex items-center space-x-2 bg-white shadow-lg rounded-full px-4 py-2 cursor-pointer hover:bg-blue-50 transition"
        aria-label="Go to Help Page"
      >
        <FiHelpCircle className="text-blue-500 w-6 h-6" />
        <span className="text-blue-600 font-semibold select-none">Help</span>
      </Link>
    </>
  );
}

export default HomePage;
