import OrderHistory from "./OrderHistory";
import { Package } from "lucide-react";

function OrderHistoryContainer() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center gap-4 mb-6">
        <Package className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Order History</h2>
      </div>
      <OrderHistory />
    </div>
  );
}

export default OrderHistoryContainer;
