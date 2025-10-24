import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { setIsAuthorized } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    city: "",
    state: "",
    address: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    // Frontend validation: passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      // Prepare data for registration (exclude confirmPassword)
      const dataToSend = { ...formData };
      delete dataToSend.confirmPassword;
      setLoading(true);

      // 1. Register the user
      await api.post("user/register/", dataToSend);
      setLoading(false);
      // 2. After successful registration, log them in immediately
      const loginRes = await api.post("api/token/", {
        username: formData.username,
        password: formData.password,
      });

      // 3. Save JWT tokens to localStorage
      localStorage.setItem("access", loginRes.data.access);
      localStorage.setItem("refresh", loginRes.data.refresh);

      // 4. Update auth context state
      setIsAuthorized(true);

      // 5. Navigate to shop or homepage
      navigate("/shop");
    } catch (err) {
      const detail = err.response?.data;
      setLoading(false);
      if (detail && typeof detail === "object") {
        const serverErrors = {};
        for (const key in detail) {
          serverErrors[key] = Array.isArray(detail[key])
            ? detail[key][0]
            : detail[key];
        }
        setErrors(serverErrors);
      } else {
        setGeneralError(detail?.detail || "Registration failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-3xl w-full bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Register
        </h2>
        {generalError && (
          <p className="text-red-600 text-sm mb-4 text-center">
            {generalError}
          </p>
        )}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {[
            {
              name: "username",
              label: "Username",
              type: "text",
              required: true,
            },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "first_name", label: "First Name", type: "text" },
            { name: "last_name", label: "Last Name", type: "text" },
            { name: "city", label: "City", type: "text" },
            { name: "state", label: "State", type: "text" },
            { name: "phone", label: "Phone", type: "text" },
            {
              name: "password",
              label: "Password",
              type: "password",
              required: true,
            },
            {
              name: "confirmPassword",
              label: "Confirm Password",
              type: "password",
              required: true,
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              {errors[field.name] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          {/* Address textarea (full width) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
              rows="2"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          {/* Register button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>

          {/* Login link */}
          <p className="md:col-span-2 mt-4 text-sm font-bold text-center text-gray-600">
            Already have an account?{" "}
            <Link to={"/login"}>
              <span className="text-blue-600 hover:underline cursor-pointer">
                Login here
              </span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
