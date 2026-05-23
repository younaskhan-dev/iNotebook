import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import profileImg from '../../assets/younas-khan-profile.png';

const techStack = [
  { icon: 'fa-solid fa-leaf', name: 'MongoDB', desc: 'NoSQL Database', color: '#10b981' },
  { icon: 'fa-solid fa-server', name: 'Express.js', desc: 'Backend Framework', color: '#94a3b8' },
  { icon: 'fa-brands fa-react', name: 'React.js', desc: 'Frontend Library', color: '#60a5fa' },
  { icon: 'fa-brands fa-node-js', name: 'Node.js', desc: 'Runtime Environment', color: '#4ade80' },
];

const features = [
  'JWT-based authentication & route protection',
  'Cloud-synced note storage on MongoDB Atlas',
  'Create, edit, delete notes instantly',
  'Soft-delete with Trash & restore flow',
  'Favorites & Archive sections',
  'Smart tagging and filtering system',
  'Real-time search across all notes',
  'Pin important notes to top',
  'Note color customization',
  'Dark & Light theme with localStorage persistence',
  'Fully responsive mobile dashboard',
  'Modern glassmorphism UI design',
];

const roadmap = [
  { status: 'done', label: 'Core CRUD notes' },
  { status: 'done', label: 'JWT Authentication' },
  { status: 'done', label: 'Dashboard UI' },
  { status: 'done', label: 'Favorites & Archive' },
  { status: 'done', label: 'Dark / Light Mode' },
  { status: 'done', label: 'Markdown Editor' },
  { status: 'done', label: 'Image Attachments' },
  { status: 'done', label: 'Reminders & Notifications' },
  { status: 'done', label: 'AI Note Summarizer' },
  { status: 'planned', label: 'Collaborative Notes' },
];

const AboutPage = () => {
  return (
    <div className="public-page">
      <PublicNavbar />

      {/* ── HERO ── */}
      <section className="about-hero">
        <div className="hero-bg-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
        </div>
        <div className="about-hero-content animate-fade-in-up">
          <div className="section-label-badge">About iNotebook</div>
          <h1 className="about-hero-title">
            Built for modern <span className="hero-title-gradient">productivity</span>
          </h1>
          <p className="about-hero-desc">
            iNotebook is a full-stack MERN application designed to be a secure,
            fast, and beautiful cloud note-taking platform. No ads. No clutter.
            Just your thoughts, organized.
          </p>
        </div>
      </section>

      {/* ── WHAT IS IT ── */}
      <section className="about-section">
        <div className="section-container">
          <div className="about-intro-grid">
            <div className="about-intro-text animate-fade-in-up stagger-1">
              <h2 className="about-section-title">What is iNotebook?</h2>
              <p className="about-text">
                iNotebook is a cloud-based note-taking web application built using the
                <strong> MERN Stack</strong> (MongoDB, Express.js, React.js, Node.js).
                It allows users to securely create, manage, and organize their notes
                from anywhere in the world.
              </p>
              <p className="about-text">
                All notes are stored securely in the cloud using MongoDB Atlas.
                User authentication is handled via <strong>JSON Web Tokens (JWT)</strong>,
                ensuring only you can access your personal notes.
              </p>
              <p className="about-text">
                The modern dashboard UI is inspired by productivity tools like
                <strong> Notion, Linear, and Vercel</strong> — offering a clean,
                fast, and delightful user experience.
              </p>
              <Link to="/signup" className="hero-btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }} id="about-signup-btn">
                <i className="fa-solid fa-rocket"></i> Get Started Free
              </Link>
            </div>
            <div className="about-intro-stats">
              {[
                { icon: 'fa-solid fa-note-sticky', value: 'Unlimited', label: 'Notes Storage' },
                { icon: 'fa-solid fa-shield-halved', value: '100%', label: 'Secure with JWT' },
                { icon: 'fa-solid fa-mobile-screen', value: 'All', label: 'Devices Supported' },
                { icon: 'fa-solid fa-bolt', value: 'Real-time', label: 'Sync & Search' },
              ].map((s, i) => (
                <div key={i} className={`about-stat-card animate-scale-in stagger-${(i % 4) + 1}`}>
                  <i className={s.icon}></i>
                  <p className="about-stat-value">{s.value}</p>
                  <p className="about-stat-label">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="about-section about-section-alt">
        <div className="section-container">
          <div className="section-label-badge animate-fade-in-up">Technology</div>
          <h2 className="section-heading animate-fade-in-up stagger-1">Built with the MERN Stack</h2>
          <p className="section-subheading animate-fade-in-up stagger-2">
            Industry-standard technologies for a scalable, production-ready application
          </p>
          <div className="tech-grid">
            {techStack.map((t, i) => (
              <div key={i} className={`tech-card animate-scale-in stagger-${(i % 4) + 1}`} style={{ '--tech-color': t.color }}>
                <div className="tech-icon" style={{ color: t.color }}>
                  <i className={t.icon}></i>
                </div>
                <h3 className="tech-name">{t.name}</h3>
                <p className="tech-desc">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="about-section">
        <div className="section-container">
          <div className="section-label-badge animate-fade-in-up">Features</div>
          <h2 className="section-heading animate-fade-in-up stagger-1">Everything you need, nothing you don't</h2>
          <div className="features-checklist-grid">
            {features.map((f, i) => (
              <div key={i} className={`feature-check-item animate-fade-in-up stagger-${(i % 5) + 1}`}>
                <span className="feature-check-icon"><i className="fa-solid fa-circle-check"></i></span>
                <span className="feature-check-text">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROADMAP ── */}
      <section className="about-section about-section-alt">
        <div className="section-container">
          <div className="section-label-badge animate-fade-in-up">Roadmap</div>
          <h2 className="section-heading animate-fade-in-up stagger-1">What's coming next</h2>
          <p className="section-subheading animate-fade-in-up stagger-2">We're continuously improving iNotebook</p>
          <div className="roadmap-list">
            {roadmap.map((r, i) => (
              <div key={i} className={`roadmap-item ${r.status} animate-fade-in-up stagger-${(i % 5) + 1}`}>
                <span className="roadmap-icon">
                  {r.status === 'done'
                    ? <i className="fa-solid fa-circle-check"></i>
                    : <i className="fa-regular fa-circle"></i>}
                </span>
                <span className="roadmap-label">{r.label}</span>
                <span className={`roadmap-badge ${r.status}`}>
                  {r.status === 'done' ? 'Completed' : 'Planned'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEVELOPER ── */}
      <section className="about-section">
        <div className="section-container">
          <div className="section-label-badge animate-fade-in-up">Developer</div>
          <h2 className="section-heading animate-fade-in-up stagger-1">Meet the developer</h2>
          <div className="dev-card animate-fade-in-up stagger-2">
            <div className="dev-avatar">
              <img
                src={profileImg}
                alt="Younas Khan"
                className="dev-avatar-image"
              />
            </div>
            <div className="dev-info">
              <h3 className="dev-name">Younas Khan</h3>
              <p className="dev-role">Full-Stack MERN Developer</p>
              <p className="dev-bio">
                Passionate about building modern web applications using the latest
                technologies. iNotebook is a personal project built to demonstrate
                full-stack development skills with MongoDB, Express, React, and Node.js.
              </p>
              <div className="dev-tech-tags">
                {['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JWT', 'REST APIs','next.js', 'TypeScript','tailwind','vercel','railway'].map((t, i) => (
                  <span key={i} className="dev-tech-tag">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-orb cta-orb-1"></div>
        <div className="cta-orb cta-orb-2"></div>
        <div className="section-container cta-inner">
          <h2 className="cta-title">Start taking better notes today</h2>
          <p className="cta-subtitle">Free forever. No credit card required.</p>
          <div className="cta-buttons">
            <Link to="/signup" className="hero-btn-primary" id="about-cta-signup">
              <i className="fa-solid fa-rocket"></i> Create Free Account
            </Link>
            <Link to="/" className="hero-btn-secondary">
              <i className="fa-solid fa-house"></i> Back to Home
            </Link>
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

export default AboutPage;
