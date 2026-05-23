import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Notecontext from '../../context/notes/notecontext';
import { useContext } from 'react';

const routeTitles = {
  '/dashboard': 'Dashboard',
  '/dashboard/notes': 'All Notes',
  '/dashboard/favorites': 'Favorites',

  '/dashboard/archive': 'Archived Notes',
  '/dashboard/trash': 'Trash',
  '/dashboard/settings': 'Settings',
};

const DashboardNavbar = ({ onMenuToggle, searchQuery, setSearchQuery, showalert }) => {
  const { theme, toggleTheme } = useTheme();
  const { userData, notes, archivedIds, trashedIds, uploadProfileImage } = useContext(Notecontext);
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const pageTitle = routeTitles[location.pathname] || 'Dashboard';

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fileInputRef = useRef(null);

  const handleChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadProfileImage(file);
      if (res && res.success) {
        showalert && showalert('Profile image updated', 'success');
      } else {
        showalert && showalert(res?.error || 'Upload failed', 'danger');
      }
    } catch (err) {
      console.error('Upload error', err);
      showalert && showalert('Upload error', 'danger');
    } finally {
      e.target.value = '';
      setShowDropdown(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    showalert('Logged out successfully', 'success');
    navigate('/login');
  };

  const notificationNotes = notes
    .filter(note => !trashedIds.has(note._id) && !archivedIds.has(note._id) && note.reminderDate && !note.isReminderCompleted)
    .sort((a, b) => new Date(a.reminderDate) - new Date(b.reminderDate));
  const notificationCount = notificationNotes.length;

  return (
    <header className="dashboard-topnav">
      {/* Left */}
      <div className="topnav-left">
        <button className="topnav-menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
          <i className="fa-solid fa-bars"></i>
        </button>
        <h1 className="topnav-title">{pageTitle}</h1>
      </div>

      {/* Right */}
      <div className="topnav-right">
        {/* Search */}
        <div className="topnav-search">
          <i className="fa-solid fa-magnifying-glass topnav-search-icon"></i>
          <input
            type="text"
            className="topnav-search-input"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search notes"
          />
          {searchQuery && (
            <button className="topnav-search-clear" onClick={() => setSearchQuery('')}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        {/* Theme Toggle */}
        <button className="topnav-icon-btn" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
          {theme === 'dark'
            ? <i className="fa-solid fa-sun"></i>
            : <i className="fa-solid fa-moon"></i>
          }
        </button>

        {/* Notification */}
        <div className="topnav-notifications" ref={notificationRef}>
          <button
            className="topnav-icon-btn"
            title="Notifications"
            aria-label="Notifications"
            aria-expanded={showNotifications}
            onClick={() => {
              setShowNotifications(prev => !prev);
              setShowDropdown(false);
            }}
          >
            <i className="fa-solid fa-bell"></i>
            {notificationCount > 0 && <span className="topnav-badge">{notificationCount}</span>}
          </button>
          {showNotifications && (
            <div className="topnav-notifications-dropdown">
              <div className="topnav-notifications-header">
                <strong>Reminders</strong>
                <span>{notificationCount} new</span>
              </div>
              {notificationCount === 0 ? (
                <div className="topnav-notification-empty">No new reminders</div>
              ) : (
                notificationNotes.slice(0, 5).map(note => (
                  <button
                    key={note._id}
                    className="topnav-notification-item"
                    type="button"
                  >
                    <div className="notification-title">{note.title || 'Untitled note'}</div>
                    <div className="notification-meta">{new Date(note.reminderDate).toLocaleString()}</div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="topnav-user" ref={dropdownRef}>
          <button
            className="topnav-avatar-btn"
            onClick={() => setShowDropdown(!showDropdown)}
            aria-label="User menu"
            aria-expanded={showDropdown}
          >
            <div className="topnav-avatar">
              {userData.profileImage ? (
                <img src={userData.profileImage} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} />
              ) : (
                <i className="fa-solid fa-user"></i>
              )}
            </div>
            <i className="fa-solid fa-chevron-down topnav-chevron"></i>
          </button>

          {showDropdown && (
            <div className="topnav-dropdown">
              <div className="topnav-dropdown-header">
                <p className="topnav-dropdown-name">{userData.name}</p>
                <p className="topnav-dropdown-email">{userData.email || 'user@inotebook.com'}</p>
              </div>
              <div className="topnav-dropdown-divider"></div>
              <button className="topnav-dropdown-item" onClick={() => { navigate('/dashboard/settings'); setShowDropdown(false); }}>
                <i className="fa-solid fa-user-pen"></i> Profile
              </button>
              <button className="topnav-dropdown-item" onClick={() => { navigate('/dashboard/settings'); setShowDropdown(false); }}>
                <i className="fa-solid fa-gear"></i> Settings
              </button>

              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
              <button type="button" className="topnav-dropdown-item" onClick={handleChooseFile}>
                <i className="fa-solid fa-upload"></i> Upload image
              </button>

              <div className="topnav-dropdown-divider"></div>
              <button className="topnav-dropdown-item danger" onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
