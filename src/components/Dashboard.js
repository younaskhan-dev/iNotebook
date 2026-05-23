import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Notecontext from '../context/notes/notecontext';
import Sidebar from './dashboard/Sidebar';
import DashboardNavbar from './dashboard/DashboardNavbar';
import DashboardHome from './dashboard/DashboardHome';
import AllNotes from './dashboard/AllNotes';
import Favorites from './dashboard/Favorites';
import Archive from './dashboard/Archive';
import Trash from './dashboard/Trash';
import SettingsPage from './dashboard/SettingsPage';

const Dashboard = ({ showalert }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getUser, getnotes, notes } = useContext(Notecontext);
  const alertedReminders = React.useRef(new Set());

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getUser();
      getnotes();
    }
    // eslint-disable-next-line
  }, []);

  // Poll for due reminders every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      notes.forEach(note => {
        if (note.reminderDate && !note.isReminderCompleted) {
          const reminderTime = new Date(note.reminderDate);
          // If due and we haven't alerted for this specific note during this session
          if (reminderTime <= now && !alertedReminders.current.has(note._id)) {
            showalert(`⏰ Reminder: ${note.title}`, 'warning', false);
            alertedReminders.current.add(note._id);
          }
        }
      });
    }, 10000); 

    return () => clearInterval(interval);
  }, [notes, showalert]);

  if (!localStorage.getItem('token')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-wrapper">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showalert={showalert}
      />
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <div className="dashboard-main">
        <DashboardNavbar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showalert={showalert}
        />
        <div className="dashboard-content">
          <Routes>
            <Route index element={<DashboardHome showalert={showalert} searchQuery={searchQuery} />} />
            <Route path="notes" element={<AllNotes showalert={showalert} searchQuery={searchQuery} />} />
            <Route path="favorites" element={<Favorites showalert={showalert} />} />
            <Route path="archive" element={<Archive showalert={showalert} />} />
            <Route path="trash" element={<Trash showalert={showalert} />} />
            <Route path="settings" element={<SettingsPage showalert={showalert} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

