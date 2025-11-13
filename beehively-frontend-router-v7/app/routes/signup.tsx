import React, { useState } from "react";
import { useNavigate } from "react-router";
import { signup as signupRequest } from "../services/authApi";
import hideIcon from "../../public/assets/hide.png";
import showIcon from "../../public/assets/show.png";
import { removeCookie, setCookie } from "~/utils/storage";

type FormValues = {
    name: string;
    email: string;
    password: string;
    confirm: string;
};

type FieldErrors = Record<keyof FormValues, string>;

const initialValues: FormValues = {
    name: "",
    email: "",
    password: "",
    confirm: "",
};

const initialFieldErrors: FieldErrors = {
    name: "",
    email: "",
    password: "",
    confirm: "",
};

const validateField = (name: keyof FormValues, value: string) => {
    if (!value) {
        if (name === "confirm") {
            return "Confirm password is required";
        }
        return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    return "";
};

const validatePasswordsMatch = (password: string, confirm: string) => {
    if (!password || !confirm) {
        return "";
    }
    return password === confirm ? "" : "Passwords do not match";
};

export default function Signup() {
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState<FormValues>(initialValues);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] =
        useState<FieldErrors>(initialFieldErrors);

    const signupData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const key = name as keyof FormValues;

        setFormValues((prev) => {
            const nextValues: FormValues = { ...prev, [key]: value };

            setFieldErrors((prevErrors) => {
                const nextErrors: FieldErrors = { ...prevErrors };
                nextErrors[key] = validateField(key, value);

                if (key === "password" || key === "confirm") {
                    const mismatchError = validatePasswordsMatch(
                        nextValues.password,
                        nextValues.confirm
                    );

                    if (mismatchError) {
                        nextErrors.password = mismatchError;
                        nextErrors.confirm = mismatchError;
                    } else {
                        nextErrors.password = validateField(
                            "password",
                            nextValues.password
                        );
                        nextErrors.confirm = validateField("confirm", nextValues.confirm);
                    }
                }

                return nextErrors;
            });

            return nextValues;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const nextErrors: FieldErrors = {
            name: validateField("name", formValues.name),
            email: validateField("email", formValues.email),
            password: validateField("password", formValues.password),
            confirm: validateField("confirm", formValues.confirm),
        };

        const mismatchError = validatePasswordsMatch(
            formValues.password,
            formValues.confirm
        );

        if (mismatchError) {
            nextErrors.password = mismatchError;
            nextErrors.confirm = mismatchError;
        }

        setFieldErrors(nextErrors);

        const hasErrors = Object.values(nextErrors).some(Boolean);

        if (hasErrors) {
            return;
        }

        setLoading(true);

        try {
            const data = await signupRequest({
                name: formValues.name,
                email: formValues.email,
                password: formValues.password,
            });

            removeCookie("token");
            removeCookie("user");

            setCookie("token", data.token, { expires: 7 });
            if (data.user) {
                setCookie("user", JSON.stringify(data.user), { expires: 7 });
            }
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:from-pink-600 hover:via-purple-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:opacity-50 font-semibold text-white shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            aria-label="Create account"
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </button>

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
}
