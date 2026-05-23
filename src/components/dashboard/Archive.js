import React, { useContext, useEffect } from 'react';
import Notecontext from '../../context/notes/notecontext';
import ViewNoteModal from './ViewNoteModal';
import { stripHtml } from '../../utils/stripHtml';

const Archive = ({ showalert }) => {
  const context = useContext(Notecontext);
  const { notes, getnotes, archivedIds, trashedIds, noteColors, toggleArchive } = context;
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [viewingNote, setViewingNote] = React.useState(null);

  useEffect(() => {
    if (localStorage.getItem('token')) getnotes();
    // eslint-disable-next-line
  }, []);

  const archivedNotes = notes.filter(n => archivedIds.has(n._id) && !trashedIds.has(n._id));

  const handleRestore = (id) => {
    toggleArchive(id);
    showalert('Note restored to All Notes', 'success');
  };

  const openView = (note) => {
    setViewingNote({ ...note, color: noteColors[note._id] || '' });
    setViewModalOpen(true);
  };

  return (
    <div className="page-fade-in">
      <div className="page-header">
        <div>
          <h2 className="page-header-title">
            <i className="fa-solid fa-box-archive" style={{ color: '#60a5fa', marginRight: '10px' }}></i>
            Archived Notes
          </h2>
          <p className="page-header-sub">{archivedNotes.length} archived note{archivedNotes.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {archivedNotes.length === 0 ? (
        <div className="empty-state">
          <i className="fa-solid fa-box-archive empty-state-icon" style={{ color: '#60a5fa' }}></i>
          <h4>No archived notes</h4>
          <p>Archive notes you want to store out of your main workspace</p>
        </div>
      ) : (
        <div className="notes-grid">
          {archivedNotes.map((note, i) => (
            <div
              key={note._id}
              className={`note-card archived-card animate-fade-in-up stagger-${(i % 6) + 1}`}
              style={{
                ...(noteColors[note._id] ? { borderTop: `3px solid ${noteColors[note._id]}` } : {}),
                cursor: 'pointer'
              }}
              onClick={() => openView(note)}
            >
              <div className="note-card-header">
                <span className="note-card-tag">{note.tag || 'General'}</span>
                <span className="archived-badge">
                  <i className="fa-solid fa-box-archive"></i> Archived
                </span>
              </div>
              <h4 className="note-card-title">{note.title}</h4>
              <p className="note-card-desc">
                {stripHtml(note.description).length > 100 ? stripHtml(note.description).substring(0, 100) + "..." : stripHtml(note.description)}
              </p>

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
                  {note.date ? new Date(note.date).toLocaleDateString('en-GB') : 'Recently'}
                </span>
                <button className="btn-restore" onClick={(e) => { e.stopPropagation(); handleRestore(note._id); }} aria-label="Restore note">
                  <i className="fa-solid fa-rotate-left"></i> Restore
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ViewNoteModal
        isOpen={viewModalOpen}
        onClose={() => { setViewModalOpen(false); setViewingNote(null); }}
        note={viewingNote}
      />
    </div>
  );
};

export default Archive;
