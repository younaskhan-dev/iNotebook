import React, { useContext, useEffect } from 'react';
import Notecontext from '../../context/notes/notecontext';
import ViewNoteModal from './ViewNoteModal';
import { stripHtml } from '../../utils/stripHtml';

const Trash = ({ showalert }) => {
  const context = useContext(Notecontext);
  const { notes, getnotes, trashedIds, noteColors, restoreFromTrash, permanentDelete } = context;
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [viewingNote, setViewingNote] = React.useState(null);

  useEffect(() => {
    if (localStorage.getItem('token')) getnotes();
    // eslint-disable-next-line
  }, []);

  const trashedNotes = notes.filter(n => trashedIds.has(n._id));

  const handleRestore = (id) => {
    restoreFromTrash(id);
    showalert('Note restored', 'success');
  };

  const handlePermanentDelete = async (id) => {
    if (window.confirm('Permanently delete this note? This cannot be undone.')) {
      await permanentDelete(id);
      showalert('Note permanently deleted', 'success');
    }
  };

  const handleEmptyTrash = async () => {
    if (!trashedNotes.length) return;
    if (window.confirm(`Permanently delete all ${trashedNotes.length} note(s)? This cannot be undone.`)) {
      for (const note of trashedNotes) await permanentDelete(note._id);
      showalert('Trash emptied', 'success');
    }
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
            <i className="fa-solid fa-trash-can" style={{ color: '#f87171', marginRight: 10 }}></i>
            Trash
          </h2>
          <p className="page-header-sub">{trashedNotes.length} deleted note{trashedNotes.length !== 1 ? 's' : ''}</p>
        </div>
        {trashedNotes.length > 0 && (
          <button className="btn-empty-trash" onClick={handleEmptyTrash} id="empty-trash-btn">
            <i className="fa-solid fa-fire"></i> Empty Trash
          </button>
        )}
      </div>

      {trashedNotes.length === 0 ? (
        <div className="empty-state">
          <i className="fa-solid fa-trash-can empty-state-icon" style={{ color: '#f87171' }}></i>
          <h4>Trash is empty</h4>
          <p>Deleted notes appear here before being permanently removed</p>
        </div>
      ) : (
        <>
          <div className="trash-notice">
            <i className="fa-solid fa-circle-info"></i>
            Notes in trash can be restored or permanently deleted
          </div>
          <div className="notes-grid">
            {trashedNotes.map((note, i) => (
              <div key={note._id} className={`note-card trash-card animate-fade-in-up stagger-${(i % 6) + 1}`}
                style={{
                  ...(noteColors[note._id] ? { borderTop: `3px solid ${noteColors[note._id]}` } : {}),
                  cursor: 'pointer'
                }}
                onClick={() => openView(note)}
              >
                <div className="note-card-header">
                  <span className="note-card-tag">{note.tag || 'General'}</span>
                  <span className="trash-badge"><i className="fa-solid fa-trash-can"></i> Deleted</span>
                </div>
                <h4 className="note-card-title">{note.title}</h4>
                <p className="note-card-desc">
                  {stripHtml(note.description).length > 100 ? stripHtml(note.description).substring(0, 100) + "..." : stripHtml(note.description)}
                </p>
                <div className="note-card-footer">
                  <span className="note-card-date">
                    <i className="fa-regular fa-clock"></i>
                    {note.date ? new Date(note.date).toLocaleDateString('en-GB') : 'Recently'}
                  </span>
                  <div className="note-card-actions">
                    <button className="btn-restore" onClick={(e) => { e.stopPropagation(); handleRestore(note._id); }} aria-label="Restore">
                      <i className="fa-solid fa-rotate-left"></i> Restore
                    </button>
                    <button className="note-action-btn delete" onClick={(e) => { e.stopPropagation(); handlePermanentDelete(note._id); }} title="Permanently delete" aria-label="Delete permanently">
                      <i className="fa-solid fa-fire"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ViewNoteModal
        isOpen={viewModalOpen}
        onClose={() => { setViewModalOpen(false); setViewingNote(null); }}
        note={viewingNote}
      />
    </div>
  );
};

export default Trash;
