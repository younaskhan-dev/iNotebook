import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const PublicNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
  ];

  return (
    <nav className="public-navbar">
      <div className="public-nav-inner">
        {/* Logo */}
        <Link to="/" className="public-nav-logo">
          <div className="public-nav-logo-icon">
            <i className="fa-solid fa-book-open-reader"></i>
          </div>
          <span>iNotebook</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="public-nav-links">
          {navLinks.map(l => (
            <Link
              key={l.path}
              to={l.path}
              className={`public-nav-link ${location.pathname === l.path ? 'active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="public-nav-actions">
          <button className="topnav-icon-btn" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
            {theme === 'dark'
              ? <i className="fa-solid fa-sun"></i>
              : <i className="fa-solid fa-moon"></i>}
          </button>

          {isLoggedIn ? (
            <Link to="/dashboard" className="public-nav-cta">
              <i className="fa-solid fa-gauge"></i> Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="public-nav-btn-ghost">Login</Link>
              <Link to="/signup" className="public-nav-cta">Get Started</Link>
            </>
          )}

          {/* Mobile Hamburger */}
          <button
            className="public-nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="public-nav-mobile">
          {navLinks.map(l => (
            <Link
              key={l.path}
              to={l.path}
              className="public-nav-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="public-nav-mobile-actions">
            {isLoggedIn ? (
              <Link to="/dashboard" className="public-nav-cta w-full" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="public-nav-btn-ghost w-full" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="public-nav-cta w-full" onClick={() => setMenuOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;
