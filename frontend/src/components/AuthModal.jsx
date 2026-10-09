import { useState } from "react";
import { loginAPI, registerAPI } from "../services/api";
import "./AuthModal.css";

function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let data;
      if (isLogin) {
        data = await loginAPI({ email, password });
      } else {
        data = await registerAPI({ name, email, password });
      }
      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-card">
        <div className="auth-modal-header">
          <h2>{isLogin ? "Log In to Task Manager" : "Create New Account"}</h2>
          <button className="auth-close-btn" onClick={onClose}>&times;</button>
        </div>

        <p className="auth-subtitle">
          {isLogin
            ? "Enter your credentials to access protected task routes."
            : "Sign up to generate a secure JWT token and hash passwords."}
        </p>

        {error && <div className="auth-error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Deep Bhalani"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="deep@charusat.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Processing..." : (isLogin ? "Log In" : "Register")}
          </button>
        </form>

        <div className="auth-footer-toggle">
          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <button onClick={() => { setIsLogin(false); setError(""); }}>
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already registered?{" "}
              <button onClick={() => { setIsLogin(true); setError(""); }}>
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
