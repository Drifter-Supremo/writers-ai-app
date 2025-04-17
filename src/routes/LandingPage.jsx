import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const { user, login, signup, loginWithGoogle, authLoading, error, setError } = useAuth();
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  // If logged in, show "Continue" button
  if (user) {
    return (
      // Use the new background and center the button
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#032934] py-16">
        <button
          className="bg-cream-yellow text-teal-deep font-semibold px-6 py-3 rounded-lg shadow hover:bg-cream-yellow/90 transition"
          onClick={() => navigate("/projects")}
        >
          Continue to App
        </button>
      </div>
    );
  }

  // Auth form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "signup" && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (mode === "login") {
      await login(email, password);
    } else {
      await signup(email, password);
    }
  };

  const handleGoogle = async () => {
    await loginWithGoogle();
  };

  return (
    // Apply new container styles, background color, and padding
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#032934] pt-12 pb-16">
      {/* Add Logo */}
      <img
        src="/assets/logo-no-background.png"
        alt="Writers AI Assistant Logo"
        className="h-40 w-auto mb-4" // Adjust size and margin as needed
      />

      {/* Add Tagline */}
      <p className="font-migra text-lg text-cream-yellow mb-8"> {/* Use Migra font, adjust size, color, margin */}
        Draft. Organize. Evolve.
      </p>

      {/* Sign-in box - remove z-index */}
      <div className="w-full max-w-md md:w-[380px] bg-teal-deep/95 rounded-xl shadow-lg p-8 flex flex-col items-center">
        <div className="flex mb-6 w-full">
          <button
            className={`flex-1 py-2 font-semibold rounded-l-lg ${
              mode === "login"
                ? "bg-cream-yellow text-teal-deep"
                : "bg-teal-light text-cream-yellow"
            }`}
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            disabled={authLoading}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 font-semibold rounded-r-lg ${
              mode === "signup"
                ? "bg-cream-yellow text-teal-deep"
                : "bg-teal-light text-cream-yellow"
            }`}
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            disabled={authLoading}
          >
            Sign Up
          </button>
        </div>
        {error && (
          <div className="mb-4 text-status-error text-center">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div>
            <input
              type="email"
              className="input-creative w-full bg-teal-light text-cream-yellow border-cream-yellow/40 placeholder-cream-yellow/60"
              placeholder="Email"
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
            <input
              type="password"
              className="input-creative w-full bg-teal-light text-cream-yellow border-cream-yellow/40 placeholder-cream-yellow/60"
              placeholder="Password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setError(null);
              }}
              required
            />
          </div>
          {mode === "signup" && (
            <div>
              <input
                type="password"
                className="input-creative w-full bg-teal-light text-cream-yellow border-cream-yellow/40 placeholder-cream-yellow/60"
                placeholder="Confirm Password"
                value={confirm}
                onChange={e => {
                  setConfirm(e.target.value);
                  setError(null);
                }}
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold bg-cream-yellow text-teal-deep hover:bg-cream-yellow/90 transition"
            disabled={authLoading}
          >
            {authLoading
              ? mode === "login"
                ? "Signing in..."
                : "Signing up..."
              : mode === "login"
              ? "Sign In"
              : "Sign Up"}
          </button>
        </form>
        <div className="my-4 w-full flex items-center">
          <div className="flex-grow border-t border-cream-yellow/30"></div>
          <span className="mx-2 text-cream-yellow text-sm">or</span>
          <div className="flex-grow border-t border-cream-yellow/30"></div>
        </div>
        {/* Google button with space green background */}
        <button
          className="w-full flex items-center justify-center gap-3 py-3 rounded-lg font-semibold transition hover:brightness-95"
          style={{ backgroundColor: '#f9f4d9', color: '#0f303d' }}
          onClick={handleGoogle}
          disabled={authLoading}
        >
          <svg className="h-5 w-5" viewBox="0 0 48 48">
            <g>
              <path
                d="M44.5 20H24v8.5h11.7C34.7 32.9 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.4-6.4C33.5 5.1 28.1 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-8.1 20-21 0-1.3-.1-2.7-.5-4z"
                fill="#FFC107"
              />
              <path
                d="M6.3 14.7l7 5.1C15.5 17.1 19.4 15 24 15c2.7 0 5.2.9 7.2 2.4l6.4-6.4C33.5 5.1 28.1 3 24 3c-7.2 0-13.4 3.1-17.7 8.1z"
                fill="#FF3D00"
              />
              <path
                d="M24 45c5.8 0 10.7-1.9 14.6-5.2l-6.7-5.5C29.7 36.1 27 37 24 37c-5.7 0-10.6-3.1-13.1-7.7l-7 5.4C6.6 42.1 14.7 45 24 45z"
                fill="#4CAF50"
              />
              <path
                d="M44.5 20H24v8.5h11.7c-1.6 4.1-6.1 7.5-11.7 7.5-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.4-6.4C33.5 5.1 28.1 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-8.1 20-21 0-1.3-.1-2.7-.5-4z"
                fill="none"
              />
            </g>
          </svg>
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
