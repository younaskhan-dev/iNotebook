import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Notecontext from '../../context/notes/notecontext';
import ViewNoteModal from './ViewNoteModal';

const StatCard = ({ icon, label, count, color, description, index }) => (
  <div className={`stat-card stat-${color} animate-scale-in stagger-${(index % 4) + 1}`}>
    <div className="stat-card-icon">
      <i className={icon}></i>
    </div>
    <div className="stat-card-body">
      <p className="stat-card-label">{label}</p>
      <h3 className="stat-card-count">{count}</h3>
      <p className="stat-card-desc">{description}</p>
    </div>
  </div>
);

const DashboardHome = ({ showalert, searchQuery }) => {
  const context = useContext(Notecontext);
  const { notes, getnotes, favoriteIds, archivedIds, trashedIds, pinnedIds, noteColors, toggleFavorite, deletenote } = context;
  // const navigate = useNavigate();
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [viewingNote, setViewingNote] = React.useState(null);

  useEffect(() => {
    if (localStorage.getItem('token')) getnotes();
    // eslint-disable-next-line
  }, []);

  const activeNotes = notes.filter(n => !trashedIds.has(n._id) && !archivedIds.has(n._id));
  const allTags = [...new Set(notes.map(n => n.tag).filter(Boolean))];

  const recentNotes = [...activeNotes]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 6);

  const filteredRecent = searchQuery
    ? recentNotes.filter(n =>
        n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.tag?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentNotes;

  const openView = (note) => {
    setViewingNote({ ...note, color: noteColors[note._id] || '' });
    setViewModalOpen(true);
  };

  const favoriteCount = activeNotes.filter(n => favoriteIds.has(n._id)).length;
  const archivedCount = notes.filter(n => archivedIds.has(n._id) && !trashedIds.has(n._id)).length;
  const pinnedCount = activeNotes.filter(n => pinnedIds.has(n._id)).length;

  const stats = [
    { icon: 'fa-solid fa-note-sticky', label: 'Total Notes', count: activeNotes.length, color: 'purple', description: `${pinnedCount} pinned` },
    { icon: 'fa-solid fa-star', label: 'Favorites', count: favoriteCount, color: 'yellow', description: 'Starred notes' },
    { icon: 'fa-solid fa-box-archive', label: 'Archived', count: archivedCount, color: 'blue', description: 'Stored safely' },
    { icon: 'fa-solid fa-tags', label: 'Total Tags', count: allTags.length, color: 'green', description: 'Unique tags' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="page-fade-in">
      {/* Welcome */}
      <div className="dashboard-welcome animate-fade-in-up stagger-1">
        <div>
          <h2 className="welcome-title">{getGreeting()}! 👋</h2>
          <p className="welcome-subtitle">Here's a summary of your notes workspace</p>
        </div>
        <Link to="/dashboard/notes" className="btn-create-note">
          <i className="fa-solid fa-plus"></i> New Note
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s, i) => <StatCard key={i} {...s} index={i} />)}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h3 className="section-title animate-fade-in-up stagger-2">Quick Actions</h3>
        <div className="quick-actions-grid">
          {[
            { icon: 'fa-solid fa-plus', label: 'Create Note', path: '/dashboard/notes', color: 'purple' },
            { icon: 'fa-solid fa-star', label: 'Favorites', path: '/dashboard/favorites', color: 'yellow' },
            { icon: 'fa-solid fa-box-archive', label: 'Archive', path: '/dashboard/archive', color: 'blue' },
            { icon: 'fa-solid fa-trash-can', label: 'Trash', path: '/dashboard/trash', color: 'red' },
          ].map((action, i) => (
            <Link key={i} to={action.path} className={`quick-action-btn qa-${action.color} animate-fade-in-up stagger-${(i % 4) + 1}`}>
              <i className={action.icon}></i>
              <span>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Notes */}
      <div className="recent-notes-section">
        <div className="section-header animate-fade-in-up stagger-3">
          <h3 className="section-title">Recent Notes</h3>
          <Link to="/dashboard/notes" className="see-all-link">
            See all <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        {filteredRecent.length === 0 ? (
          <div className="empty-state animate-scale-in">
            <i className="fa-solid fa-note-sticky empty-state-icon"></i>
            <h4>{searchQuery ? 'No matching notes' : 'No notes yet'}</h4>
            <p>{searchQuery ? 'Try a different search term' : 'Create your first note to get started'}</p>
            {!searchQuery && (
              <Link to="/dashboard/notes" className="btn-create-note" style={{ marginTop: '16px' }}>
                <i className="fa-solid fa-plus"></i> Create Note
              </Link>
            )}
          </div>
        ) : (
          <div className="notes-grid">
            {filteredRecent.map((note, i) => (
              <div
                key={note._id}
                className={`note-card animate-fade-in-up stagger-${(i % 6) + 1}`}
                style={{
                  ...(noteColors[note._id] ? { borderTop: `3px solid ${noteColors[note._id]}` } : {}),
                  cursor: 'pointer'
                }}
                onClick={() => openView(note)}
              >
                <div className="note-card-header">
                  <span className="note-card-tag">{note.tag || 'General'}</span>
                  <button
                    className={`note-fav-btn ${favoriteIds.has(note._id) ? 'favorited' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(note._id); }}
                    aria-label="Toggle favorite"
                  >
                    <i className={favoriteIds.has(note._id) ? 'fa-solid fa-star' : 'fa-regular fa-star'}></i>
                  </button>
                </div>
                <h4 className="note-card-title">{note.title}</h4>
                <p className="note-card-desc">{note.description}</p>
                
                {note.reminderDate && (
                  <div className={`reminder-badge-container ${new Date(note.reminderDate) < new Date() && !note.isReminderCompleted ? 'overdue' : note.isReminderCompleted ? 'completed' : ''}`} style={{marginBottom: '12px', fontSize: '0.8rem', padding: '6px 10px'}}>
                      <i className={`fa-solid ${note.isReminderCompleted ? 'fa-circle-check' : 'fa-clock'} me-2`}></i>
                      <span>
                          {note.isReminderCompleted ? 'Reminder Completed' : 
                           new Date(note.reminderDate) < new Date() ? 'Reminder Overdue' : 
                           `Reminder: ${new Date(note.reminderDate).toLocaleString()}`}
                      </span>
                  </div>
                )}

                <div className="note-card-footer">
                  <span className="note-card-date">
                    <i className="fa-regular fa-clock"></i>
                    {note.date ? new Date(note.date).toLocaleDateString() : 'Recently'}
                  </span>
                  <div className="note-card-actions">
                    <button className="note-action-btn delete" onClick={(e) => { e.stopPropagation(); deletenote(note._id); showalert('Note moved to trash', 'success'); }} aria-label="Delete note">
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ViewNoteModal
        isOpen={viewModalOpen}
        onClose={() => { setViewModalOpen(false); setViewingNote(null); }}
        note={viewingNote}
      />
    </div>
  );
};

export default DashboardHome;
