import React, { useContext, useEffect, useState } from 'react';
import Notecontext from '../../context/notes/notecontext';
import NoteModal from './NoteModal';
import ViewNoteModal from './ViewNoteModal';
import { stripHtml } from '../../utils/stripHtml';

const Favorites = ({ showalert }) => {
  const context = useContext(Notecontext);
  const { notes, getnotes, editenote, deletenote, favoriteIds, trashedIds, archivedIds, noteColors, toggleFavorite, setNoteColor } = context;
  const [editModal, setEditModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingNote, setViewingNote] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('token')) getnotes();
    // eslint-disable-next-line
  }, []);

  const favoriteNotes = notes.filter(n =>
    favoriteIds.has(n._id) && !trashedIds.has(n._id) && !archivedIds.has(n._id)
  );

  const handleEdit = async (noteData) => {
    await editenote(editingNote._id, noteData.title, noteData.description, noteData.tag, noteData.reminderDate);
    if (noteData.color !== undefined) setNoteColor(editingNote._id, noteData.color);
    showalert('Note updated successfully!', 'success');
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
            <i className="fa-solid fa-star" style={{ color: '#f59e0b', marginRight: '10px' }}></i>
            Favorites
          </h2>
          <p className="page-header-sub">{favoriteNotes.length} favorite note{favoriteNotes.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {favoriteNotes.length === 0 ? (
        <div className="empty-state">
          <i className="fa-solid fa-star empty-state-icon" style={{ color: '#f59e0b' }}></i>
          <h4>No favorite notes yet</h4>
          <p>Star a note to add it to your favorites</p>
        </div>
      ) : (
        <div className="notes-grid">
          {favoriteNotes.map((note, i) => (
            <div
              key={note._id}
              className={`note-card favorite-highlight animate-fade-in-up stagger-${(i % 6) + 1}`}
              style={{
                ...(noteColors[note._id] ? { borderTop: `3px solid ${noteColors[note._id]}` } : {}),
                cursor: 'pointer'
              }}
              onClick={() => openView(note)}
            >
              <div className="note-card-header">
                <span className="note-card-tag">{note.tag || 'General'}</span>
                <button
                  className="note-fav-btn favorited"
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(note._id); showalert('Removed from favorites', 'success'); }}
                  aria-label="Remove from favorites"
                >
                  <i className="fa-solid fa-star"></i>
                </button>
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
                <div className="note-card-actions">
                  <button className="note-action-btn edit" onClick={(e) => { e.stopPropagation(); setEditingNote({ ...note, color: noteColors[note._id] || '' }); setEditModal(true); }} aria-label="Edit note">
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button className="note-action-btn delete" onClick={(e) => { e.stopPropagation(); deletenote(note._id); showalert('Note moved to trash', 'success'); }} aria-label="Delete note">
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <NoteModal
        isOpen={editModal}
        onClose={() => { setEditModal(false); setEditingNote(null); }}
        onSave={handleEdit}
        initialNote={editingNote}
        mode="edit"
      />

      <ViewNoteModal
        isOpen={viewModalOpen}
        onClose={() => { setViewModalOpen(false); setViewingNote(null); }}
        note={viewingNote}
        onEdit={(note) => {
          setViewModalOpen(false);
          setViewingNote(null);
          setEditingNote({ ...note, color: noteColors[note._id] || '' });
          setEditModal(true);
        }}
      />
    </div>
  );
};

export default Favorites;

