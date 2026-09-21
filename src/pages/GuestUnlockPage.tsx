import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export default function GuestUnlockPage() {
  const { loginAsGuest } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = loginAsGuest(code);
    if (!ok) {
      setError("Unlock Code doesn't exist");
      return;
    }
    navigate("/menu");
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Enter Unlock Code</h2>
        <div className="field">
          <label htmlFor="code">Unlock code</label>
          <input id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)} />
        </div>
        <p className="error-text">{error}</p>
        <button className="btn btn-primary" type="submit">
          Unlock
        </button>
        <button type="button" className="text-link" onClick={() => navigate("/")}>
          Back to login
        </button>
      </form>
    </div>
  );
}
