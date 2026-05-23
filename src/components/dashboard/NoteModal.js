import React, { useState, useEffect, useRef } from 'react';
import RichTextEditor from './RichTextEditor';

const NOTE_COLORS = [
  { label: 'Default', value: '', class: 'color-default' },
  { label: 'Purple', value: '#6d28d9', class: 'color-purple' },
  { label: 'Blue', value: '#1d4ed8', class: 'color-blue' },
  { label: 'Green', value: '#065f46', class: 'color-green' },
  { label: 'Orange', value: '#92400e', class: 'color-orange' },
  { label: 'Pink', value: '#9d174d', class: 'color-pink' },
];

const NoteModal = ({ isOpen, onClose, onSave, initialNote = null, mode = 'create' }) => {
  const titleRef = useRef(null);
  const [note, setNote] = useState({ title: '', description: '', tag: '', color: '', reminderDate: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialNote) {
        setNote({
          title: initialNote.title || '',
          description: initialNote.description || '',
          tag: initialNote.tag || '',
          color: initialNote.color || '',
          reminderDate: initialNote.reminderDate ? new Date(initialNote.reminderDate).toISOString().slice(0, 16) : ''
        });
      } else {
        setNote({ title: '', description: '', tag: '', color: '', reminderDate: '' });
      }
      setErrors({});
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isOpen, mode, initialNote]);

  const validate = () => {
    const e = {};
    if (note.title.length < 5) e.title = 'Title must be at least 5 characters';
    if (note.description.length < 5) e.description = 'Description must be at least 5 characters';
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSaving(true);
    await onSave(note);
    setSaving(false);
    onClose();
  };

  const onChange = (e) => {
    setNote(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="note-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {/* Header */}
        <div className="note-modal-header">
          <h2 id="modal-title" className="note-modal-title">
            <i className={`fa-solid ${mode === 'edit' ? 'fa-pen-to-square' : 'fa-plus'}`}></i>
            {mode === 'edit' ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button className="note-modal-close" onClick={onClose} aria-label="Close modal">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}
        <div className="note-modal-body">
          {/* Title */}
          <div className="modal-field">
            <label htmlFor="modal-title-input" className="modal-label">Title <span className="required">*</span></label>
            <input
              ref={titleRef}
              id="modal-title-input"
              type="text"
              name="title"
              className={`modal-input ${errors.title ? 'input-error' : ''}`}
              placeholder="Give your note a title..."
              value={note.title}
              onChange={onChange}
            />
            {errors.title && <p className="field-error">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="modal-field">
            <label htmlFor="modal-desc" className="modal-label">Description <span className="required">*</span></label>
            <RichTextEditor
              value={note.description}
              onChange={(html) => {
                setNote(prev => ({ ...prev, description: html }));
                if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
              }}
              placeholder="Write your note here... (Markdown supported: # Heading, - List, **Bold**)"
            />
            {errors.description && <p className="field-error">{errors.description}</p>}
          </div>

          {/* Tag */}
          <div className="modal-field">
            <label htmlFor="modal-tag" className="modal-label">Tag</label>
            <input
              id="modal-tag"
              type="text"
              name="tag"
              className="modal-input"
              placeholder="Work, Personal, Ideas..."
              value={note.tag}
              onChange={onChange}
            />
          </div>

          {/* Reminder Date */}
          <div className="modal-field">
            <label htmlFor="modal-reminder" className="modal-label">Set Reminder (Optional)</label>
            <input
              id="modal-reminder"
              type="datetime-local"
              name="reminderDate"
              className="modal-input"
              value={note.reminderDate}
              onChange={onChange}
            />
          </div>

          {/* Color Picker */}
          <div className="modal-field">
            <label className="modal-label">Note Color</label>
            <div className="color-picker-row">
              {NOTE_COLORS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  className={`color-dot ${c.class} ${note.color === c.value ? 'color-selected' : ''}`}
                  style={c.value ? { background: c.value } : {}}
                  title={c.label}
                  onClick={() => setNote(prev => ({ ...prev, color: c.value }))}
                  aria-label={`Select ${c.label} color`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="note-modal-footer">
          <button className="modal-btn-cancel" onClick={onClose} disabled={saving}>Cancel</button>
          <button
            className="modal-btn-save"
            onClick={handleSave}
            disabled={saving || note.title.length < 5 || note.description.length < 5}
          >
            {saving
              ? <><i className="fa-solid fa-spinner fa-spin"></i> Saving...</>
              : <><i className="fa-solid fa-floppy-disk"></i> {mode === 'edit' ? 'Update Note' : 'Save Note'}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
