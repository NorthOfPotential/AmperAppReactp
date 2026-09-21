import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export default function LoginPage() {
  const { loginAsMember } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    setError("");
    const displayName = email.split("@")[0];
    loginAsMember(displayName);
    navigate("/menu");
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Log In Your Account</h2>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Remember me
        </label>
        <p className="error-text">{error}</p>
        <button className="btn btn-primary" type="submit">
          Log In
        </button>
        <Link to="/signup" className="text-link">
          Create an Account
        </Link>
        <button type="button" className="text-link" onClick={() => setShowForgot(true)}>
          Forgot Password?
        </button>

        <div className="or-divider">
          <span>OR</span>
        </div>

        <button type="button" className="btn btn-primary" onClick={() => navigate("/guest")}>
          Log In as Guest
        </button>
      </form>

      {showForgot && (
        <div className="modal-backdrop" onClick={() => setShowForgot(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Reset Password</h3>
            {forgotSent ? (
              <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
                If an account exists for <strong>{email || "that email"}</strong>, a reset link
                has been sent.
              </p>
            ) : (
              <>
                <div className="field">
                  <label htmlFor="forgot-email">Email</label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button className="btn btn-primary" onClick={() => setForgotSent(true)}>
                  Send Reset Link
                </button>
              </>
            )}
            <button
              className="btn btn-ghost"
              onClick={() => {
                setShowForgot(false);
                setForgotSent(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
