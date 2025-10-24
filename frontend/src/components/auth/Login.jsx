import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../utils/axios";
import Error from "../ui/Error";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { isAuthorized, getUsername, setIsAuthorized } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("api/token/", { username, password });
      const { access, refresh } = res.data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      setIsAuthorized(true);
      getUsername
      setUsername("");
      setPassword("");
      const from = location?.state?.from?.pathname || "/shop";
      navigate(from, { replace: true });
    } catch (err) {
      const errMsg = err.response?.data?.detail || err.message || "Login failed";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error ? (
        <Error error={error} />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Login
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <p className="mt-6 text-sm text-center text-gray-600">
              Don't have an account?{" "}
              <Link to="/register">
                <span className="text-blue-600 hover:underline cursor-pointer">
                  Register here
                </span>
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
