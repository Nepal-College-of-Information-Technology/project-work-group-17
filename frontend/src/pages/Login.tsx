import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { loginUser, LoginData } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
   const [formData, setFormData] = useState<LoginData>({
      username: "",
      password: "",
   });
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const { login } = useAuth();
   const navigate = useNavigate();

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
         const response = await loginUser(formData);

         // Match your actual API response structure
         if (!response.data || !response.data.access_token || !response.data.username) {
            throw new Error("Invalid response from server");
         }

         const { access_token, username, email } = response.data;

         // Create user object from response
         const userData = {
            id: response.data.user_id?.toString() || "", // Adjust based on your actual response
            username,
            email,
         };

         // Store token and user data
         login(access_token, userData);

         // Redirect to home page
         navigate("/", { replace: true });
      } catch (err: any) {
         console.error("Login error:", err);

         // Handle different error types
         if (err.response) {
            // Server responded with error status
            setError(err.response.data?.message || "Login failed. Please check your credentials.");
         } else if (err.request) {
            // Request was made but no response received
            setError("Network error. Please check your connection.");
         } else {
            // Other errors
            setError(err.message || "Login failed. Please try again.");
         }
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
         <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md w-full space-y-8"
         >
            <div className="text-center">
               <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogIn className="h-8 w-8 text-white" />
               </div>
               <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
               <p className="mt-2 text-gray-400">Sign in to your account</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-8">
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                     <label htmlFor="username" className="block text-gray-300 text-sm font-medium mb-2">
                        Username
                     </label>
                     <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter your username"
                        required
                        disabled={loading}
                        autoComplete="username"
                     />
                  </div>

                  <div>
                     <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
                        Password
                     </label>
                     <div className="relative">
                        <input
                           type={showPassword ? "text" : "password"}
                           id="password"
                           name="password"
                           value={formData.password}
                           onChange={handleInputChange}
                           className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                           placeholder="Enter your password"
                           required
                           disabled={loading}
                           autoComplete="current-password"
                        />
                        <button
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                           disabled={loading}
                           aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                           {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                     </div>
                  </div>

                  {error && (
                     <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                        {error}
                     </div>
                  )}

                  <div>
                     <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex justify-center items-center"
                     >
                        {loading ? (
                           <>
                              <svg
                                 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 24 24"
                              >
                                 <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                 ></circle>
                                 <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                 ></path>
                              </svg>
                              Signing In...
                           </>
                        ) : (
                           "Sign In"
                        )}
                     </button>
                  </div>
               </form>

               <div className="mt-6 text-center">
                  <p className="text-gray-400">
                     Don't have an account?{" "}
                     <Link
                        to="/register"
                        className="text-orange-500 hover:text-orange-400 font-medium"
                        onClick={(e) => loading && e.preventDefault()}
                     >
                        Create one
                     </Link>
                  </p>
               </div>
            </div>
         </motion.div>
      </div>
   );
};

export default Login;
