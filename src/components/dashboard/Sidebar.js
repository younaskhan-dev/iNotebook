import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Notecontext from '../../context/notes/notecontext';

const navItems = [
  { path: '/dashboard', icon: 'fa-solid fa-house', label: 'Dashboard', end: true },
  { path: '/dashboard/notes', icon: 'fa-solid fa-note-sticky', label: 'All Notes' },
  { path: '/dashboard/favorites', icon: 'fa-solid fa-star', label: 'Favorites' },
  { path: '/dashboard/archive', icon: 'fa-solid fa-box-archive', label: 'Archived' },
  { path: '/dashboard/trash', icon: 'fa-solid fa-trash-can', label: 'Trash' },
];

const bottomItems = [
  { path: '/dashboard/settings', icon: 'fa-solid fa-gear', label: 'Settings' },
];

const Sidebar = ({ isOpen, onClose, showalert }) => {
  const navigate = useNavigate();
  const { userData } = useContext(Notecontext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    showalert('Logged out successfully', 'success');
    navigate('/login');
  };

  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <i className="fa-solid fa-book-open-reader"></i>
        </div>
        <span className="sidebar-logo-text">iNotebook</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <p className="sidebar-section-label">WORKSPACE</p>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
            onClick={onClose}
          >
            <span className="sidebar-nav-icon"><i className={item.icon}></i></span>
            <span className="sidebar-nav-label-text">{item.label}</span>
          </NavLink>
        ))}

        <p className="sidebar-section-label" style={{ marginTop: '24px' }}>GENERAL</p>
        {bottomItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
            onClick={onClose}
          >
            <span className="sidebar-nav-icon"><i className={item.icon}></i></span>
            <span className="sidebar-nav-label-text">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {userData.profileImage ? (
                <img src={userData.profileImage} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
                <i className="fa-solid fa-user"></i>
            )}
          </div>
          <div className="sidebar-user-info">
            <p className="sidebar-username">{userData.name}</p>
            <p className="sidebar-userstatus">● Online</p>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout} title="Logout">
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
