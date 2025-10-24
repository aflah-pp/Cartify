import { motion } from "framer-motion";
import { UserPlus, ShoppingCart, DollarSign, ShieldCheck, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const perks = [
  {
    icon: ShoppingCart,
    title: "Access to Millions of Customers",
    desc: "Boost your sales by showcasing your products to a wide audience on Cartify’s platform.",
  },
  {
    icon: DollarSign,
    title: "Competitive Seller Fees",
    desc: "Enjoy low fees so you can keep more of your earnings and grow your business faster.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments & Support",
    desc: "We prioritize your safety with secure payment processing and dedicated seller support.",
  },
  {
    icon: Clock,
    title: "Easy Inventory Management",
    desc: "Manage your products, orders, and sales efficiently with our intuitive dashboard.",
  },
];

const SellerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12 mt-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">
          Become a Cartify Seller & Grow Your Business
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Join thousands of sellers who trust Cartify to connect with customers, manage sales, and scale up smoothly.
        </p>
        <button
          onClick={() => navigate("/upgrade-to-seller")}
          className="mt-8 inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-lg shadow-lg transition"
        >
          <UserPlus className="w-6 h-6" />
          Get Started as a Seller
        </button>
      </motion.div>

      {/* Perks Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Why Sell on Cartify?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {perks.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              className="flex gap-4 bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-default"
            >
              <Icon className="w-10 h-10 text-yellow-400 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-1">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Terms & Conditions Section */}
      <section className="bg-gray-50 p-6 rounded-lg shadow-inner">
        <h2 className="text-2xl font-bold mb-4 text-center">Terms & Conditions</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2 max-w-3xl mx-auto text-sm">
          <li>All sellers must comply with Cartify’s policies and legal regulations.</li>
          <li>Seller fees and commissions are subject to change with prior notice.</li>
          <li>Product listings must be accurate, legal, and respectful of intellectual property.</li>
          <li>Payments will be processed securely, with payouts scheduled monthly.</li>
          <li>Cartify reserves the right to suspend or terminate seller accounts violating terms.</li>
        </ul>
      </section>
    </div>
  );
};

export default SellerPage;
