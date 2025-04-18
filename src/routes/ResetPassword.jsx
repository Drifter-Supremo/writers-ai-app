import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // "success" | "error" | null
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setError("");
    setLoading(true);
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setStatus("success");
    } catch (err) {
      let msg = "";
      if (err.code === "auth/user-not-found") {
        msg = "No account found with that email.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Invalid email address.";
      } else {
        msg = "Failed to send reset email. Please try again.";
      }
      setError(msg);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#032934] pt-12 pb-16">
      <img
        src="/assets/logo-no-background.png"
        alt="Writers AI Assistant Logo"
        className="h-40 w-auto mb-4"
      />
      <p className="font-migra text-lg text-cream-yellow mb-8">
        Draft. Organize. Evolve.
      </p>
      <div className="w-full max-w-md md:w-[380px] bg-teal-deep/95 rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h2 className="text-cream-yellow text-xl font-semibold mb-4">Reset Password</h2>
        {status === "success" ? (
          <div className="mb-4 text-green-400 text-center">
            Password reset email sent! Check your inbox.
          </div>
        ) : error ? (
          <div className="mb-4 text-status-error text-center">{error}</div>
        ) : null}
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <input
            type="email"
            className="input-creative w-full bg-teal-light text-cream-yellow border-cream-yellow/40 placeholder-cream-yellow/60"
            placeholder="Enter your email"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              setError("");
              setStatus(null);
            }}
            required
            autoFocus
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold bg-cream-yellow text-teal-deep hover:bg-cream-yellow/90 transition"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <button
          className="mt-6 text-cream-yellow hover:underline text-sm"
          onClick={() => navigate("/")}
          disabled={loading}
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
}
