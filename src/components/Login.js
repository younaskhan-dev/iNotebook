import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail, validatePassword } from "../utils/validation";

const Login = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    const emailError = validateEmail(credentials.email);
    if (emailError) validationErrors.email = emailError;

    const passwordError = validatePassword(credentials.password);
    if (passwordError) validationErrors.password = passwordError;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      });
      const json = await response.json();
      if (json.success) {
        localStorage.setItem("token", json.authtoken);
        props.showalert("Logged in successfully!", "success");
        navigate("/dashboard");
      } else {
        props.showalert(json.error || "Invalid credentials. Please try again.", "danger");
      }
    } catch {
      props.showalert("Server error. Please try again.", "danger");
    }
    setLoading(false);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      {/* Back to Home */}
      <Link to="/" className="auth-back-link">
        <i className="fa-solid fa-arrow-left"></i> Back to Home
      </Link>

      <div className="auth-card animate-scale-in">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <i className="fa-solid fa-book-open-reader"></i>
          </div>
          <span className="auth-logo-text">iNotebook</span>
        </div>

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Login to access your secure notes</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="login-email" className="auth-label">Email Address</label>
            <div className="auth-input-wrap">
              <i className="fa-solid fa-envelope auth-input-icon"></i>
              <input
                type="email"
                id="login-email"
                name="email"
                className={`auth-input ${errors.email ? 'error' : ''}`}
                placeholder="name@example.com"
                value={credentials.email}
                onChange={onChange}
                required
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="auth-error">{errors.email}</p>}
          </div>

          <div className="auth-field">
            <div className="auth-label-row">
              <label htmlFor="login-password" className="auth-label">Password</label>
            </div>
            <div className="auth-input-wrap">
              <i className="fa-solid fa-lock auth-input-icon"></i>
              <input
                type="password"
                id="login-password"
                name="password"
                className={`auth-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                value={credentials.password}
                onChange={onChange}
                required
                autoComplete="current-password"
              />
            </div>
            {errors.password && <p className="auth-error">{errors.password}</p>}
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading} id="login-submit-btn">
            {loading
              ? <><i className="fa-solid fa-spinner fa-spin"></i> Logging in...</>
              : <><i className="fa-solid fa-right-to-bracket"></i> Login to iNotebook</>
            }
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-switch-link">Create one free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
