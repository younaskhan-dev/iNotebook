import React, { useContext, useEffect, useState } from 'react';
import Notecontext from '../../context/notes/notecontext';
import NoteModal from './NoteModal';
import ViewNoteModal from './ViewNoteModal';
import { stripHtml } from '../../utils/stripHtml';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'alpha', label: 'A → Z' },
  { value: 'alpha-desc', label: 'Z → A' },
];

const AllNotes = ({ showalert, searchQuery }) => {
  const context = useContext(Notecontext);
  const {
    notes, getnotes, addnote, editenote, deletenote,
    favoriteIds, archivedIds, trashedIds, pinnedIds, noteColors,
    toggleFavorite, toggleArchive, togglePin, setNoteColor,
  } = context;

  const [modalOpen, setModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [sort, setSort] = useState('newest');
  const [filterTag, setFilterTag] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingNote, setViewingNote] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('token')) getnotes();
    // eslint-disable-next-line
  }, []);

  const activeNotes = notes.filter(n => !trashedIds.has(n._id) && !archivedIds.has(n._id));
  const allTags = [...new Set(activeNotes.map(n => n.tag).filter(Boolean))];
  const query = searchQuery || localSearch;

  let filtered = activeNotes.filter(n => {
    const matchSearch = !query ||
      n.title?.toLowerCase().includes(query.toLowerCase()) ||
      n.description?.toLowerCase().includes(query.toLowerCase()) ||
      n.tag?.toLowerCase().includes(query.toLowerCase());
    const matchTag = !filterTag || n.tag === filterTag;
    return matchSearch && matchTag;
  });

  const pinned = filtered.filter(n => pinnedIds.has(n._id));
  const unpinned = filtered.filter(n => !pinnedIds.has(n._id));

  const sortNotes = (arr) => {
    return [...arr].sort((a, b) => {
      if (sort === 'newest') return new Date(b.date || 0) - new Date(a.date || 0);
      if (sort === 'oldest') return new Date(a.date || 0) - new Date(b.date || 0);
      if (sort === 'alpha') return a.title?.localeCompare(b.title);
      if (sort === 'alpha-desc') return b.title?.localeCompare(a.title);
      return 0;
    });
  };

  const sortedNotes = [...pinned, ...sortNotes(unpinned)];

  const handleCreate = async (noteData) => {
    await addnote(noteData.title, noteData.description, noteData.tag, noteData.color, noteData.reminderDate);
    showalert('Note created successfully!', 'success');
  };

  const handleEdit = async (noteData) => {
    await editenote(editingNote._id, noteData.title, noteData.description, noteData.tag, noteData.reminderDate);
    if (noteData.color !== undefined) setNoteColor(editingNote._id, noteData.color);
    showalert('Note updated successfully!', 'success');
  };

  const openEdit = (note) => {
    setEditingNote({ ...note, color: noteColors[note._id] || '' });
    setEditModal(true);
  };

  const openView = (note) => {
    setViewingNote({ ...note, color: noteColors[note._id] || '' });
    setViewModalOpen(true);
  };

  const handleDelete = (id) => {
    deletenote(id);
    showalert('Note moved to trash', 'success');
  };

  const handleArchive = (id) => {
    toggleArchive(id);
    showalert('Note archived', 'success');
  };


  return (
    <div className="page-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-header-title">All Notes</h2>
          <p className="page-header-sub">{activeNotes.length} note{activeNotes.length !== 1 ? 's' : ''} total</p>
        </div>
        <button className="btn-create-note" onClick={() => setModalOpen(true)} id="create-note-btn">
          <i className="fa-solid fa-plus"></i> New Note
        </button>
      </div>

      {/* Filter / Sort Bar */}
      <div className="filter-bar">
        <div className="filter-search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search notes..."
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            className="filter-search-input"
            aria-label="Search notes"
          />
        </div>

        <div className="filter-controls">
          {/* Tag filter */}
          <select
            value={filterTag}
            onChange={e => setFilterTag(e.target.value)}
            className="filter-select"
            aria-label="Filter by tag"
          >
            <option value="">All Tags</option>
            {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="filter-select"
            aria-label="Sort notes"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      {sortedNotes.length === 0 ? (
        <div className="empty-state">
          <i className="fa-solid fa-note-sticky empty-state-icon"></i>
          <h4>{query || filterTag ? 'No matching notes found' : 'No notes yet'}</h4>
          <p>{query || filterTag ? 'Try different filters' : 'Click "New Note" to create your first note'}</p>
          {!query && !filterTag && (
            <button className="btn-create-note" onClick={() => setModalOpen(true)} style={{ marginTop: '16px' }}>
              <i className="fa-solid fa-plus"></i> Create Note
            </button>
          )}
        </div>
      ) : (
        <>
          {pinned.length > 0 && (
            <p className="notes-section-label">
              <i className="fa-solid fa-thumbtack"></i> Pinned
            </p>
          )}
          <div className="notes-grid">
            {sortedNotes.map((note, i) => {
              const previewText = stripHtml(note.description);
              return (
                <div
                  key={note._id}
                  className={`note-card ${pinnedIds.has(note._id) ? 'note-pinned' : ''} animate-fade-in-up stagger-${(i % 6) + 1}`}
                  style={{
                    ...(noteColors[note._id] ? { borderTop: `3px solid ${noteColors[note._id]}` } : {}),
                    cursor: 'pointer'
                  }}
                  onClick={() => openView(note)}
                >
                  <div className="note-card-header">
                    <span className="note-card-tag">{note.tag || 'General'}</span>
                    <div className="note-card-header-actions">
                      <button
                        className={`note-fav-btn ${favoriteIds.has(note._id) ? 'favorited' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(note._id); }}
                        title="Toggle favorite"
                        aria-label="Toggle favorite"
                      >
                        <i className={favoriteIds.has(note._id) ? 'fa-solid fa-star' : 'fa-regular fa-star'}></i>
                      </button>
                      <button
                        className={`note-pin-btn ${pinnedIds.has(note._id) ? 'pinned' : ''}`}
                        onClick={(e) => { e.stopPropagation(); togglePin(note._id); }}
                        title="Toggle pin"
                        aria-label="Toggle pin"
                      >
                        <i className="fa-solid fa-thumbtack"></i>
                      </button>
                    </div>
                  </div>

                  <h4 className="note-card-title">{note.title}</h4>
                  <p className="note-card-desc">
                    {previewText.length > 120 ? previewText.substring(0, 120) + "..." : previewText}
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
                    <button className="note-action-btn edit" onClick={(e) => { e.stopPropagation(); openEdit(note); }} title="Edit note" aria-label="Edit note">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button className="note-action-btn archive" onClick={(e) => { e.stopPropagation(); handleArchive(note._id); }} title="Archive note" aria-label="Archive note">
                      <i className="fa-solid fa-box-archive"></i>
                    </button>
                    <button className="note-action-btn delete" onClick={(e) => { e.stopPropagation(); handleDelete(note._id); }} title="Delete note" aria-label="Delete note">
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Create Modal */}
      <NoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleCreate}
        mode="create"
      />

      {/* Edit Modal */}
      <NoteModal
        isOpen={editModal}
        onClose={() => { setEditModal(false); setEditingNote(null); }}
        onSave={handleEdit}
        initialNote={editingNote}
        mode="edit"
      />

      {/* View Modal */}
      <ViewNoteModal
        isOpen={viewModalOpen}
        onClose={() => { setViewModalOpen(false); setViewingNote(null); }}
        note={viewingNote}
        showalert={showalert}
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

export default AllNotes;
