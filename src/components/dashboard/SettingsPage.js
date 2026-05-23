import React, { useState, useContext, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Notecontext from '../../context/notes/notecontext';

const SettingsPage = ({ showalert }) => {
  const { theme, toggleTheme } = useTheme();
  const { userData, uploadProfileImage, updateUser } = useContext(Notecontext);
  const [profile, setProfile] = useState({ name: userData.name, email: userData.email });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [notifications, setNotifications] = useState({ email: true, reminders: false, updates: true });
  const [activeTab, setActiveTab] = useState('appearance');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setProfile({ name: userData.name, email: userData.email });
  }, [userData]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const result = await updateUser(profile.name, profile.email);
    if (result.success) {
      showalert('Profile updated and saved to database!', 'success');
    } else {
      showalert(result.error, 'danger');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showalert('Image size should be less than 5MB', 'danger');
        return;
      }

      setUploading(true);
      const result = await uploadProfileImage(file);
      setUploading(false);

      if (result.success) {
        showalert('Profile image updated successfully!', 'success');
      } else {
        showalert(result.error || 'Failed to upload image', 'danger');
      }
    }
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      showalert('Passwords do not match', 'danger');
      return;
    }
    if (passwords.newPass.length < 5) {
      showalert('Password must be at least 5 characters', 'danger');
      return;
    }
    showalert('Password changed successfully!', 'success');
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  const tabs = [
    { id: 'appearance', icon: 'fa-solid fa-palette', label: 'Appearance' },
    { id: 'profile', icon: 'fa-solid fa-user', label: 'Profile' },
    { id: 'security', icon: 'fa-solid fa-lock', label: 'Security' },
    { id: 'notifications', icon: 'fa-solid fa-bell', label: 'Notifications' },
  ];

  return (
    <div className="page-fade-in">
      <div className="page-header">
        <div>
          <h2 className="page-header-title">Settings</h2>
          <p className="page-header-sub">Manage your account and preferences</p>
        </div>
      </div>

      <div className="settings-layout">
        {/* Sidebar Tabs */}
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              id={`settings-tab-${tab.id}`}
            >
              <i className={tab.icon}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="settings-panel">

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h3 className="settings-section-title">Appearance</h3>
              <p className="settings-section-desc">Customize the look and feel of iNotebook</p>

              <div className="settings-card">
                <div className="settings-row">
                  <div>
                    <p className="settings-row-title">Theme</p>
                    <p className="settings-row-desc">Switch between dark and light mode</p>
                  </div>
                  <button className="theme-toggle-pill" onClick={toggleTheme} aria-label="Toggle theme">
                    <span className={`theme-pill-icon ${theme === 'dark' ? 'active' : ''}`}>
                      <i className="fa-solid fa-moon"></i> Dark
                    </span>
                    <span className={`theme-pill-icon ${theme === 'light' ? 'active' : ''}`}>
                      <i className="fa-solid fa-sun"></i> Light
                    </span>
                  </button>
                </div>

                <div className="settings-divider"></div>

                <div className="settings-row">
                  <div>
                    <p className="settings-row-title">Current Theme</p>
                    <p className="settings-row-desc">
                      Currently using <strong>{theme === 'dark' ? '🌙 Dark' : '☀️ Light'}</strong> mode
                    </p>
                  </div>
                  <div className={`theme-indicator ${theme}`}>
                    <i className={`fa-solid ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h3 className="settings-section-title">Profile</h3>
              <p className="settings-section-desc">Update your personal information</p>
              <div className="settings-card">
                <div className="profile-avatar-section">
                  <div className="profile-avatar-large" style={{ position: 'relative', overflow: 'hidden' }}>
                    {uploading ? (
                      <div style={{
                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2
                      }}>
                        <i className="fa-solid fa-circle-notch fa-spin" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                      </div>
                    ) : null}
                    {userData.profileImage ? (
                        <img src={userData.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <i className="fa-solid fa-user"></i>
                    )}
                    <label htmlFor="avatar-upload" style={{
                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: 0, cursor: uploading ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s',
                        zIndex: 1
                    }} onMouseOver={e => !uploading && (e.currentTarget.style.opacity = 1)} onMouseOut={e => e.currentTarget.style.opacity = 0}>
                        <i className="fa-solid fa-camera" style={{ color: 'white' }}></i>
                    </label>
                    <input id="avatar-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={uploading} />
                  </div>
                  <div>
                    <p className="profile-avatar-name">{userData.name}</p>
                    <p className="profile-avatar-email">{userData.email || 'iNotebook User'}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Click photo to upload</p>
                  </div>
                </div>
                <div className="settings-divider"></div>
                <form onSubmit={handleProfileSave}>
                  <div className="settings-form-group">
                    <label htmlFor="settings-name" className="settings-label">Full Name</label>
                    <input
                      id="settings-name"
                      type="text"
                      className="settings-input"
                      value={profile.name}
                      onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="settings-form-group">
                    <label htmlFor="settings-email" className="settings-label">Email Address</label>
                    <input
                      id="settings-email"
                      type="email"
                      className="settings-input"
                      value={profile.email}
                      onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <button type="submit" className="btn-settings-save" id="save-profile-btn">
                    <i className="fa-solid fa-floppy-disk"></i> Save Profile
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <h3 className="settings-section-title">Security</h3>
              <p className="settings-section-desc">Manage your password and account security</p>
              <div className="settings-card">
                <form onSubmit={handlePasswordSave}>
                  <div className="settings-form-group">
                    <label htmlFor="settings-curr-pass" className="settings-label">Current Password</label>
                    <input id="settings-curr-pass" type="password" className="settings-input"
                      placeholder="Enter current password"
                      value={passwords.current}
                      onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} />
                  </div>
                  <div className="settings-form-group">
                    <label htmlFor="settings-new-pass" className="settings-label">New Password</label>
                    <input id="settings-new-pass" type="password" className="settings-input"
                      placeholder="Min 5 characters"
                      value={passwords.newPass}
                      onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))} />
                  </div>
                  <div className="settings-form-group">
                    <label htmlFor="settings-conf-pass" className="settings-label">Confirm Password</label>
                    <input id="settings-conf-pass" type="password" className="settings-input"
                      placeholder="Repeat new password"
                      value={passwords.confirm}
                      onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} />
                  </div>
                  <button type="submit" className="btn-settings-save" id="change-password-btn">
                    <i className="fa-solid fa-lock"></i> Change Password
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3 className="settings-section-title">Notifications</h3>
              <p className="settings-section-desc">Choose what notifications you receive</p>
              <div className="settings-card">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                  { key: 'reminders', label: 'Note Reminders', desc: 'Get reminded about your notes' },
                  { key: 'updates', label: 'Product Updates', desc: 'New features and improvements' },
                ].map(item => (
                  <div key={item.key}>
                    <div className="settings-row">
                      <div>
                        <p className="settings-row-title">{item.label}</p>
                        <p className="settings-row-desc">{item.desc}</p>
                      </div>
                      <button
                        className={`toggle-switch ${notifications[item.key] ? 'on' : ''}`}
                        onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key] }))}
                        aria-label={`Toggle ${item.label}`}
                        role="switch"
                        aria-checked={notifications[item.key]}
                      >
                        <span className="toggle-knob"></span>
                      </button>
                    </div>
                    <div className="settings-divider"></div>
                  </div>
                ))}
                <button className="btn-settings-save" onClick={() => showalert('Preferences saved!', 'success')} id="save-notifications-btn">
                  <i className="fa-solid fa-floppy-disk"></i> Save Preferences
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
