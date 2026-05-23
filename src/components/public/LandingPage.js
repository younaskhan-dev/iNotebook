import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';

const features = [
  { icon: 'fa-solid fa-lock', title: 'Secure & Private', desc: 'Your notes are protected with JWT authentication. Only you can access your data.', color: 'purple' },
  { icon: 'fa-solid fa-cloud', title: 'Cloud Sync', desc: 'Access your notes from anywhere, anytime. Synced across all your devices in real-time.', color: 'blue' },
  { icon: 'fa-solid fa-bolt', title: 'Lightning Fast', desc: 'Built with React and Node.js for an ultra-responsive experience with zero lag.', color: 'yellow' },
  { icon: 'fa-solid fa-tags', title: 'Smart Tagging', desc: 'Organize notes with custom tags. Filter and find any note in seconds.', color: 'green' },
  { icon: 'fa-solid fa-star', title: 'Favorites', desc: 'Star your most important notes and access them instantly from the favorites section.', color: 'orange' },
  { icon: 'fa-solid fa-moon', title: 'Dark & Light Mode', desc: 'Fully themed dark and light modes. Your preference is saved automatically.', color: 'pink' },
];

const stats = [
  { value: '100%', label: 'Secure' },
  { value: '∞', label: 'Notes' },
  { value: '0ms', label: 'Delay' },
  { value: '24/7', label: 'Available' },
];

const LandingPage = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="public-page">
      <PublicNavbar />

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-bg-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge animate-fade-in-up stagger-1">
            <i className="fa-solid fa-sparkles"></i> The smarter way to take notes
          </div>
          <h1 className="hero-title animate-fade-in-up stagger-2">
            Your Notes.<br />
            <span className="hero-title-gradient">Organized. Secured.</span><br />
            Always Accessible.
          </h1>
          <p className="hero-subtitle animate-fade-in-up stagger-3">
            iNotebook is a modern, cloud-powered notes app built for productivity.
            Create, organize, and access your notes from anywhere — with military-grade security.
          </p>
          <div className="hero-cta-group animate-fade-in-up stagger-4">
            {isLoggedIn ? (
              <Link to="/dashboard" className="hero-btn-primary">
                <i className="fa-solid fa-gauge"></i> Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/signup" className="hero-btn-primary" id="hero-get-started">
                  <i className="fa-solid fa-rocket"></i> Get Started Free
                </Link>
                <Link to="/login" className="hero-btn-secondary" id="hero-login">
                  <i className="fa-solid fa-right-to-bracket"></i> Login
                </Link>
              </>
            )}
            <Link to="/about" className="hero-btn-ghost">
              Learn More <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats animate-fade-in-up stagger-5">
            {stats.map((s, i) => (
              <div key={i} className="hero-stat">
                <p className="hero-stat-value">{s.value}</p>
                <p className="hero-stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* App Preview Mockup */}
        <div className="hero-mockup animate-scale-in stagger-3">
          <div className="mockup-window">
            <div className="mockup-titlebar">
              <span className="mockup-dot red"></span>
              <span className="mockup-dot yellow"></span>
              <span className="mockup-dot green"></span>
              <span className="mockup-url">inotebook.app/dashboard</span>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                <div className="mockup-logo-row"><i className="fa-solid fa-book-open-reader"></i> iNotebook</div>
                {['Dashboard', 'All Notes', 'Favorites', 'Archived', 'Trash'].map((item, i) => (
                  <div key={i} className={`mockup-nav-item ${i === 1 ? 'mockup-active' : ''}`}>
                    <span className="mockup-dot-sm"></span>{item}
                  </div>
                ))}
              </div>
              <div className="mockup-main">
                <div className="mockup-header">
                  <span className="mockup-title">All Notes</span>
                  <span className="mockup-btn">+ New Note</span>
                </div>
                <div className="mockup-cards">
                  {[
                    { title: 'Project Ideas', tag: 'Work', color: '#8b5cf6' },
                    { title: 'Shopping List', tag: 'Personal', color: '#06b6d4' },
                    { title: 'Meeting Notes', tag: 'Work', color: '#10b981' },
                    { title: 'Book Summary', tag: 'Learning', color: '#f59e0b' },
                  ].map((c, i) => (
                    <div key={i} className="mockup-card" style={{ borderTop: `2px solid ${c.color}` }}>
                      <div className="mockup-card-tag" style={{ color: c.color }}>{c.tag}</div>
                      <div className="mockup-card-title">{c.title}</div>
                      <div className="mockup-card-lines">
                        <div className="mockup-line"></div>
                        <div className="mockup-line short"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-label-badge animate-fade-in-up">Features</div>
          <h2 className="section-heading animate-fade-in-up stagger-1">Everything you need to stay organized</h2>
          <p className="section-subheading animate-fade-in-up stagger-2">
            Built with modern technology for a seamless note-taking experience
          </p>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className={`feature-card feature-${f.color} animate-fade-in-up stagger-${(i % 5) + 1}`}>
                <div className="feature-icon">
                  <i className={f.icon}></i>
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section">
        <div className="section-container">
          <div className="section-label-badge animate-fade-in-up">How It Works</div>
          <h2 className="section-heading animate-fade-in-up stagger-1">Up and running in 3 steps</h2>
          <div className="steps-grid">
            {[
              { step: '01', icon: 'fa-solid fa-user-plus', title: 'Create Account', desc: 'Sign up for free in under 30 seconds. No credit card required.' },
              { step: '02', icon: 'fa-solid fa-pen-to-square', title: 'Create Notes', desc: 'Write, tag and organize your notes with our intuitive dashboard.' },
              { step: '03', icon: 'fa-solid fa-cloud', title: 'Access Anywhere', desc: 'Your notes are synced to the cloud. Access them from any device, anytime.' },
            ].map((s, i) => (
              <div key={i} className={`step-card animate-fade-in-up stagger-${(i % 3) + 1}`}>
                <div className="step-number">{s.step}</div>
                <div className="step-icon"><i className={s.icon}></i></div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-section">
        <div className="cta-orb cta-orb-1"></div>
        <div className="cta-orb cta-orb-2"></div>
        <div className="section-container cta-inner">
          <h2 className="cta-title">Ready to get organized?</h2>
          <p className="cta-subtitle">Join thousands of users who trust iNotebook with their notes.</p>
          <div className="cta-buttons">
            {isLoggedIn ? (
              <Link to="/dashboard" className="hero-btn-primary">
                <i className="fa-solid fa-gauge"></i> Open Dashboard
              </Link>
            ) : (
              <>
                <Link to="/signup" className="hero-btn-primary" id="cta-signup-btn">
                  <i className="fa-solid fa-rocket"></i> Start for Free
                </Link>
                <Link to="/login" className="hero-btn-secondary">
                  Already have an account? Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="public-footer">
        <div className="section-container footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">
              <i className="fa-solid fa-book-open-reader"></i>
              <span>iNotebook</span>
            </div>
            <p className="footer-tagline">Your notes. Secured in the cloud with fast sync and elegant UI.</p>
            <div className="footer-socials">
              <a href="https://www.linkedin.com/in/younaskhanofficial/" className="footer-social-link" target="_blank" rel="noreferrer">
                <i className="fa-brands fa-linkedin"></i>
                LinkedIn
              </a>
              <a href="https://github.com/younaskhan-dev" className="footer-social-link" target="_blank" rel="noreferrer">
                <i className="fa-brands fa-github"></i>
                GitHub
              </a>
              <a href="https://younas-khan-portfolio.vercel.app" className="footer-social-link" target="_blank" rel="noreferrer">
                <i className="fa-solid fa-globe"></i>
                Portfolio
              </a>
              <a href="mailto:younaskhan1822@gmail.com" className="footer-social-link">
                <i className="fa-solid fa-envelope"></i>
                Email
              </a>
            </div>
          </div>
          <div className="footer-links-group">
            <p className="footer-group-title">Site</p>
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/about" className="footer-link">About</Link>
            <Link to="/login" className="footer-link">Login</Link>
            <Link to="/signup" className="footer-link">Signup</Link>
          </div>
          <div className="footer-links-group">
            <p className="footer-group-title">Resources</p>
            <span className="footer-link">Cloud Sync</span>
            <span className="footer-link">Secure Storage</span>
            <span className="footer-link">Dark Mode</span>
            <span className="footer-link">Smart Tags</span>
          </div>
          <div className="footer-links-group">
            <p className="footer-group-title">Support</p>
            <a href="mailto:younaskhan1822@gmail.com" className="footer-link">Email Me</a>
            <a href="https://github.com/younaskhan-dev" className="footer-link" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://younas-khan-portfolio.vercel.app" className="footer-link" target="_blank" rel="noreferrer">Portfolio</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Younas Khan. Designed with modern motion and MERN energy.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
