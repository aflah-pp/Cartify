import { Link } from "react-router";
import {
  Twitter,
  Instagram,
  Home,
  ShoppingCart,
  NotebookIcon,
  Github
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-50 text-gray-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
        {/* Column 1 */}
        <div>
          <h3 className="font-bold text-2xl mb-3">Cartify</h3>
          <p className="text-gray-600 text-sm">
            Your one-stop shop for everything awesome. Quality products,
            seamless shopping, and fast delivery – all in one place.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-800 hover:text-blue-600 hover:scale-105 transition-transform duration-300"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="flex items-center gap-2 text-gray-800 hover:text-blue-600 hover:scale-105 transition-transform duration-300"
              >
                <ShoppingCart className="w-4 h-4" />
                Cart
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="flex items-center gap-2 text-gray-800 hover:text-blue-600 hover:scale-105 transition-transform duration-300"
              >
                <NotebookIcon className="w-4 h-4" />
                About
              </Link>
            </li>
            
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
          <div className="flex space-x-5">
            <a
              href="https://github.com/aflah-pp"
              className="text-gray-800 hover:text-grey-500 hover:scale-110 transition-transform duration-300"
              aria-label="Github"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="text-gray-800 hover:text-sky-500 hover:scale-110 transition-transform duration-300"
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="https://www.instagram.com/afl_4h/"
              className="text-gray-800 hover:text-pink-500 hover:scale-110 transition-transform duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-200 text-center text-xs py-4 text-gray-500">
        &copy; {new Date().getFullYear()} <strong>Cartify</strong>. All rights reserved.
      </div>
    </footer>
  );
}
