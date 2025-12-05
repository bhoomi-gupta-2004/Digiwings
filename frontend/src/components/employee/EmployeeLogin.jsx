import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import digilogo from "../../assets/images/digilogo.svg";
import employeelogo from "../../assets/images/employeelogo.svg";
import bg from "../../assets/images/bg.jpg";
import { useAuth } from "../../context/AuthContext.jsx"; // Import the useAuth hook

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // Use the login function from AuthContext

    const [employeeId, setEmployeeId] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // This should point to your backend login endpoint
    const BACKEND_URL = "https://digiwings.onrender.com/api/auth/login"

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(BACKEND_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ employeeId, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Login failed. Please check your credentials."
                );
            }

            console.log("Login successful:", data);

            // ✅ Save token depending on "Remember me"
            if (rememberMe) {
                localStorage.setItem("token", data.token);
            } else {
                sessionStorage.setItem("token", data.token);
            }

            // Call the login function from context to set the user globally
            login(data);

            // Role-based redirection logic based on the data received
            if (data.role === "admin") {
                navigate("/employee-dashboard/admin"); // Admin dashboard route
            } else {
                navigate("/employee-dashboard/attendance"); // Default user route
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gray-900"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-xl shadow-lg overflow-hidden bg-white/15 backdrop-blur-md border border-white/40">
                {/* Left section */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div>
                        <img src={digilogo} alt="Company Logo" className="h-40 w-40" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mt-4">Welcome back</h2>

                    <form onSubmit={handleLogin} className="space-y-4 mt-6">
                        {/* Employee ID */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-white">
                                ID
                            </label>
                            <input
                                type="text"
                                placeholder="Employee ID"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                required
                                className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-white">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <p className="text-sm text-center text-red-400">{error}</p>
                        )}

                        {/* Remember me + Forgot password */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-white">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 rounded-full accent-blue-500"
                                />
                                Remember me
                            </label>
                            <Link to="/forgot-password" className="text-blue-500 hover:underline">
                                Forgot password?
                            </Link>

                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                </div>

                {/* Right section */}
                <div className="hidden md:flex items-center justify-center p-8">
                    <img src={employeelogo} alt="Employee Illustration" className="max-w-md" />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
