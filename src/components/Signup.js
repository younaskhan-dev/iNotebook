import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { validateName, validateEmail, validatePassword } from "../utils/validation";

const Signup = (props) => {
  const [credentials, setcredentials] = useState({ name: '', email: '', password: '', Cpassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { name, email, password, Cpassword } = credentials;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    const nameError = validateName(name);
    if (nameError) validationErrors.name = nameError;

    const emailError = validateEmail(email);
    if (emailError) validationErrors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) validationErrors.password = passwordError;

    if (password !== Cpassword) {
      validationErrors.Cpassword = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/createUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, Cpassword }),
      });
      const json = await response.json();
      if (json.authtoken) {
        props.showalert("Account created! Please login.", "success");
        navigate("/login");
      } else {
        props.showalert(json.error || "Invalid details. Please try again.", "danger");
      }
    } catch {
      props.showalert("Server error. Please try again.", "danger");
    }
    setLoading(false);
  };

  const onChange = (e) => {
    const { name: fieldName, value } = e.target;
    setcredentials({ ...credentials, [fieldName]: value });
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: null });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      <Link to="/" className="auth-back-link">
        <i className="fa-solid fa-arrow-left"></i> Back to Home
      </Link>

      <div className="auth-card animate-scale-in">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <i className="fa-solid fa-book-open-reader"></i>
          </div>
          <span className="auth-logo-text">iNotebook</span>
        </div>

        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Join iNotebook and store your notes securely in the cloud</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="signup-name" className="auth-label">Full Name</label>
            <div className="auth-input-wrap">
              <i className="fa-solid fa-user auth-input-icon"></i>
              <input type="text" id="signup-name" name="name" className={`auth-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter your name" value={name} onChange={onChange} minLength={3} required />
            </div>
            {errors.name && <p className="auth-error">{errors.name}</p>}
          </div>

          <div className="auth-field">
            <label htmlFor="signup-email" className="auth-label">Email Address</label>
            <div className="auth-input-wrap">
              <i className="fa-solid fa-envelope auth-input-icon"></i>
              <input type="email" id="signup-email" name="email" className={`auth-input ${errors.email ? 'error' : ''}`}
                placeholder="name@example.com" value={email} onChange={onChange} required />
            </div>
            {errors.email && <p className="auth-error">{errors.email}</p>}
          </div>

          <div className="auth-fields-row">
            <div className="auth-field">
              <label htmlFor="signup-password" className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <i className="fa-solid fa-lock auth-input-icon"></i>
                <input type="password" id="signup-password" name="password" className={`auth-input ${errors.password ? 'error' : ''}`}
                  placeholder="Min 5 chars" value={password} onChange={onChange} minLength={5} required />
              </div>
              {errors.password && <p className="auth-error">{errors.password}</p>}
            </div>
            <div className="auth-field">
              <label htmlFor="signup-cpassword" className="auth-label">Confirm Password</label>
              <div className="auth-input-wrap">
                <i className="fa-solid fa-lock auth-input-icon"></i>
                <input type="password" id="signup-cpassword" name="Cpassword" className={`auth-input ${errors.Cpassword ? 'error' : ''}`}
                  placeholder="Repeat password" value={Cpassword} onChange={onChange} minLength={5} required />
              </div>
              {errors.Cpassword && <p className="auth-error">{errors.Cpassword}</p>}
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading} id="signup-submit-btn">
            {loading
              ? <><i className="fa-solid fa-spinner fa-spin"></i> Creating account...</>
              : <><i className="fa-solid fa-user-plus"></i> Create Account</>
            }
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" className="auth-switch-link">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
