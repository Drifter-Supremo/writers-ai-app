import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login, loginWithGoogle, authLoading, error, setError, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) navigate("/projects");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleGoogle = async () => {
    await loginWithGoogle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-bg">
      <div className="card-creative p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-text-primary mb-6 text-center">Sign In</h1>
        {error && (
          <div className="mb-4 text-status-error text-center">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-text-primary mb-1">Email</label>
            <input
              type="email"
              className="input-creative w-full"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setError(null);
              }}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-text-primary mb-1">Password</label>
            <input
              type="password"
              className="input-creative w-full"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setError(null);
              }}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-creative w-full"
            disabled={authLoading}
          >
            {authLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-cream-gray/30"></div>
          <span className="mx-2 text-text-secondary text-sm">or</span>
          <div className="flex-grow border-t border-cream-gray/30"></div>
        </div>
        <button
          className="btn-creative w-full flex items-center justify-center gap-2"
          onClick={handleGoogle}
          disabled={authLoading}
        >
          <span>Sign in with Google</span>
        </button>
        <div className="mt-6 text-center text-text-secondary text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-accent-orange hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
