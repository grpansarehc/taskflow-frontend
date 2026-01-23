import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import type { ApiError } from "../../services/auth.service";
import { useToast } from "../../components/common/ToastProvider";
import ForgotPasswordModal from "../../components/auth/ForgotPasswordModal";

import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/userSlice";
import keycloak from "../../services/keycloak.service";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const dispatch = useDispatch();

  // Redirect if already logged in
  useEffect(() => {
    // Check if user has token from basic auth
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      // User is already logged in, redirect to dashboard
      navigate("/dashboard", { replace: true });
      return;
    }

    // Check if user is authenticated via Keycloak
    if (keycloak.authenticated) {
      // User is authenticated with Keycloak, set token and redirect
      const token = keycloak.token;
      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("keycloakToken", token);

        // Get user info from Keycloak
        const profile = keycloak.profile;
        if (profile) {
          dispatch(
            setUser({
              userId: profile.sub || "",
              email: profile.email || "",
              name: profile.name || profile.given_name || "User",
              token: token,
            }),
          );
        }

        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await authService.login(email, password, rememberMe);
      console.log(data);

      // Dispatch user data to Redux
      dispatch(
        setUser({
          userId: data.id,
          email: data.email,
          name: data.name || "User", // Fallback if name is missing
          token: data.accessToken,
        }),
      );

      addToast({ type: "success", message: "Signed in successfully" });
      // Redirect to dashboard and clear login from history
      setTimeout(() => {
        navigate("/dashboard");

        window.history.replaceState(null, "", "/dashboard");
      }, 200);
    } catch (err) {
      const apiErr = err as ApiError;
      const message = apiErr?.message || "Failed to login. Please try again.";
      setError(message);
      addToast({ type: "error", message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    keycloak.login({ idpHint: "google" });
  };

  const handleGithubLogin = () => {
    keycloak.login({ idpHint: "github" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded"></div>
            </div>
            <span className="text-2xl font-bold text-white">TaskFlow</span>
          </div>

          {/* Hero Content */}
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
              Manage Your Projects with Ease
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              Streamline your workflow, collaborate with your team, and deliver
              projects on time.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {[
                "Track tasks and sprints efficiently",
                "Real-time collaboration with team",
                "Customizable workflows and boards",
                "Advanced reporting and analytics",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-blue-200" />
                  <span className="text-blue-50">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-blue-100 text-sm">
          © 2026 TaskFlow. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600">
              Sign in to continue to your workspace
            </p>
          </div>

          {/* Form */}
          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 p-3 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder:text-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-slate-50 to-blue-50 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-lg border-2 border-gray-300 hover:border-red-500 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  style={{ color: "#4285F4" }}
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  style={{ color: "#34A853" }}
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  style={{ color: "#FBBC05" }}
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  style={{ color: "#EA4335" }}
                />
              </svg>
              <span className="text-sm">Google</span>
            </button>

            {/* GitHub Login */}
            <button
              type="button"
              onClick={handleGithubLogin}
              className="bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-lg border-2 border-gray-300 hover:border-gray-900 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-sm">GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-slate-50 to-blue-50 text-gray-500">
                New to TaskFlow?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Create an account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Terms */}
          <p className="mt-8 text-center text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />
    </div>
  );
}
