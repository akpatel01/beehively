import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup as signupRequest } from "../services/authApi";
import hideIcon from "../assets/hide.png";
import showIcon from "../assets/show.png";

const validateField = (name: string, value: string) => {
  let error = "";
  switch (name) {
    case "name":
      if (!value) {
        error = "Name is required";
      }
      break;
    case "email":
      if (!value) {
        error = "Email is required";
      }
      break;
    case "password":
      if (!value) {
        error = "Password is required";
      }
      break;
    case "confirm":
      if (!value) {
        error = "Confirm password is required";
      }
      break;
    default:
      break;
  }
  return error;
};

const Signup = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const signupData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({
      name: "",
      email: "",
      password: "",
      confirm: "",
    });

    Object.keys(formValues).forEach((key) => {
      const error = validateField(
        key,
        formValues[key as keyof typeof formValues]
      );
      setFieldErrors((prev) => ({
        ...prev,
        [key]: error,
      }));
    });

    if (Object.values(fieldErrors).some(Boolean)) {
      return;
    }

    setLoading(true);

    try {
      const data = await signupRequest({
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
      });
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white/90 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-2xl border border-gray-200">
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
              Create account
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Join the hive and start creating amazing content
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name field */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                value={formValues.name}
                onChange={signupData}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                placeholder="enter your name"
                aria-label="Full name"
              />
              {fieldErrors.name && (
                <p className="text-xs text-red-500">{fieldErrors.name}</p>
              )}
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={formValues.email}
                name="email"
                onChange={signupData}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                placeholder="enter your email"
                aria-label="Email"
              />
              {fieldErrors.email && (
                <p className="text-xs text-red-500">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formValues.password}
                  name="password"
                  onChange={signupData}
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  placeholder="At least 8 characters"
                  aria-label="Password"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <img
                    src={showPassword ? hideIcon : showIcon}
                    alt={showPassword ? "Hide password" : "Show password"}
                    className="h-5 w-5 object-contain"
                  />
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-red-500">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm password field */}
            <div className="space-y-2">
              <label
                htmlFor="confirm"
                className="block text-sm font-semibold text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm"
                  name="confirm"
                  type={showConfirm ? "text" : "password"}
                  value={formValues.confirm}
                  onChange={signupData}
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  placeholder="Repeat your password"
                  aria-label="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  <img
                    src={showConfirm ? hideIcon : showIcon}
                    alt={showConfirm ? "Hide password" : "Show password"}
                    className="h-5 w-5 object-contain"
                  />
                </button>
              </div>
              {fieldErrors.confirm && (
                <p className="text-xs text-red-500">{fieldErrors.confirm}</p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:from-pink-600 hover:via-purple-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:opacity-50 font-semibold text-white shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              aria-label="Create account"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-gray-500 bg-white/90">
                  or sign up with
                </span>
              </div>
            </div>

            {/* Sign in link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-pink-600 hover:text-pink-700 font-semibold transition-colors"
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
