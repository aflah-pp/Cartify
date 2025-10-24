import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  ShoppingCart,
  ShoppingBag,
  LogIn,
  UserPlus,
  Home,
  LogOut,
  UserCircle,
  Menu,
  X,
} from "lucide-react";
import NavLink from "./NavLink";

function Navbar({ numCartItems }) {
  const { isAuthorized, setIsAuthorized, username, isSeller } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsAuthorized(!!token);
    // Pro tip: You want to also fetch isSeller on login or app load, so this state is legit
  }, [setIsAuthorized]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthorized(false);
    window.location.reload();
  };

  // Shared button style for seller/upgrade btns - professional & clean
  const sellerBtnClasses =
    "flex items-center gap-1 px-4 py-1 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold shadow-md transition";

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center relative">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-blue-600 tracking-tight hover:opacity-90 transition-opacity z-20"
        >
          Cartify
        </Link>

        {/* Hamburger Button (Mobile) */}
        <button
          className="md:hidden z-20"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Center Nav Links (Desktop) */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-6 items-center">
          <NavLink to="/" label="Home" icon={Home} />
          <NavLink to="/shop" label="Shop" icon={ShoppingBag} />
          <div className="relative">
            <NavLink to="/cart" label="Cart" icon={ShoppingCart} />
            {numCartItems > 0 && (
              <span className="absolute -bottom-2 left-3 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white shadow">
                {numCartItems}
              </span>
            )}
          </div>
        </div>

        {/* Right-side Auth/Profile (Desktop) */}
        <div className="hidden md:flex items-center gap-4 z-20">
          {!isAuthorized ? (
            <>
              <NavLink to="/login" label="Login" icon={LogIn} />
              <NavLink to="/register" label="Register" icon={UserPlus} />
            </>
          ) : (
            <>
              {/* Conditionally show Seller Dashboard or Upgrade button */}
              {isSeller ? (
                <Link
                  to="/seller/dashboard"
                  className={sellerBtnClasses}
                  title="Seller Dashboard"
                >
                  <UserCircle className="w-5 h-5" />
                  <span>Seller Dashboard</span>
                </Link>
              ) : (
                <Link
                  to="/seller"
                  className={sellerBtnClasses}
                  title="Upgrade to Seller"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Upgrade to Seller</span>
                </Link>
              )}

              {/* Profile */}
              <Link to="/profile">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-300 shadow-sm">
                  <UserCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">{username}</span>
                </div>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 transition"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md py-4 flex flex-col gap-4 items-center md:hidden z-10">
            <NavLink to="/" label="Home" icon={Home} onClick={() => setMenuOpen(false)} />
            <NavLink to="/shop" label="Shop" icon={ShoppingBag} onClick={() => setMenuOpen(false)} />
            <NavLink to="/cart" label="Cart" icon={ShoppingCart} onClick={() => setMenuOpen(false)} />
            {numCartItems > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white shadow">
                {numCartItems}
              </span>
            )}

            {!isAuthorized ? (
              <>
                <NavLink to="/login" label="Login" icon={LogIn} onClick={() => setMenuOpen(false)} />
                <NavLink to="/register" label="Register" icon={UserPlus} onClick={() => setMenuOpen(false)} />
              </>
            ) : (
              <>
                {/* Seller Dashboard or Upgrade button mobile */}
                {isSeller ? (
                  <Link
                    to="/seller/dashboard"
                    className={sellerBtnClasses}
                    title="Seller Dashboard"
                    onClick={() => setMenuOpen(false)}
                  >
                    <UserCircle className="w-5 h-5" />
                    <span>Seller Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    to="/seller"
                    className={sellerBtnClasses}
                    title="seller"
                    onClick={() => setMenuOpen(false)}
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Upgrade to Seller</span>
                  </Link>
                )}

                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-300 shadow-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">{username}</span>
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-red-500 hover:text-red-700 transition"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
