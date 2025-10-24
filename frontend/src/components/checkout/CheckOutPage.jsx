import React from "react";
import OrderSummary from "./OrderSummary";
import PaymentSection from "./PaymentSection";
import useCardData from "../hook/useCardData";
import Spinner from "../ui/Spinner";
import Error from "../ui/Error";
import Navbar from "../ui/NavBar";

function CheckOutPage({numCartItems}) {
  const { cartItems, sumTotal, taxRate, loading, error } = useCardData();

  if (loading) return <Spinner />;
  if (error) return <Error error={error} />;

  return (
    <>
      <Navbar numCartItems={numCartItems}/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <OrderSummary
                cartItems={cartItems}
                sumTotal={sumTotal}
                taxRate={taxRate}
              />
            </div>

            <div className="lg:col-span-1">
              <PaymentSection />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CheckOutPage;
