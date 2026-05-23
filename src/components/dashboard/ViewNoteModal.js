import React from 'react';
import './RichTextEditor.css';

const ViewNoteModal = ({ isOpen, onClose, note, showalert, onEdit }) => {
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const [localNote, setLocalNote] = React.useState(note);
  const [summary, setSummary] = React.useState('');
  const [aiTags, setAiTags] = React.useState([]);
  const [loadingSummary, setLoadingSummary] = React.useState(false);
  const [loadingTags, setLoadingTags] = React.useState(false);

  React.useEffect(() => {
    setLocalNote(note);
    setSummary('');
    setAiTags([]);
  }, [note]);

  const fetchSummary = async () => {
    if (!localNote?._id) return;
    setLoadingSummary(true);
    try {
      const host = process.env.REACT_APP_BACKEND_URL || '';
      const res = await fetch(`${host}/api/Notes/summarize/${localNote._id}`, { headers: { 'auth-token': localStorage.getItem('token') } });
      if (!res.ok) { showalert && showalert('Summary failed', 'danger'); setLoadingSummary(false); return; }
      const json = await res.json();
      setSummary(json.summary || '');
      showalert && showalert('Summary ready', 'success');
    } catch (err) {
      console.error(err);
      showalert && showalert('Summary error', 'danger');
    } finally { setLoadingSummary(false); }
  };

  const fetchTags = async () => {
    if (!localNote?._id) return;
    setLoadingTags(true);
    try {
      const host = process.env.REACT_APP_BACKEND_URL || '';
      const res = await fetch(`${host}/api/Notes/autotag/${localNote._id}`, { headers: { 'auth-token': localStorage.getItem('token') } });
      if (!res.ok) { showalert && showalert('Auto-tag failed', 'danger'); setLoadingTags(false); return; }
      const json = await res.json();
      setAiTags(json.tags || []);
      showalert && showalert('Tags suggested', 'success');
    } catch (err) {
      console.error(err);
      showalert && showalert('Auto-tag error', 'danger');
    } finally { setLoadingTags(false); }
  };

  const applyTag = async (tag) => {
    if (!localNote?._id) return;
    try {
      const host = process.env.REACT_APP_BACKEND_URL || '';
      const res = await fetch(`${host}/api/Notes/updatenotes/${localNote._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'auth-token': localStorage.getItem('token') },
        body: JSON.stringify({ tag })
      });
      if (!res.ok) { showalert && showalert('Apply tag failed', 'danger'); return; }
      setLocalNote(prev => ({ ...prev, tag }));
      showalert && showalert('Tag applied', 'success');
    } catch (err) {
      console.error(err);
      showalert && showalert('Apply tag error', 'danger');
    }
  };

  const handleEdit = () => {
    if (!localNote?._id) return;
    if (onEdit) {
      onEdit(localNote);
      return;
    }
    onClose();
    setTimeout(() => {
      const evt = new CustomEvent('startEdit', { detail: localNote });
      window.dispatchEvent(evt);
    }, 250);
  };

  if (!isOpen || !note) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="note-modal view-mode modern" role="dialog" aria-modal="true" aria-labelledby="view-modal-title">
        <div className="note-modal-header modern-header" style={localNote?.color ? { borderBottom: `2px solid ${localNote.color}` } : {}}>
          <div className="note-header-left">
            <div className="note-avatar">{(localNote?.title || 'N')[0].toUpperCase()}</div>
            <div className="note-header-copy">
              <span className="note-status-pill">{localNote?.tag || 'General'}</span>
              <h2 id="view-modal-title" className="note-modal-title modern-title">{localNote?.title}</h2>
              <div className="note-header-meta">
                <span>{localNote?.date ? new Date(localNote.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'No date'}</span>
                {localNote?.reminderDate && (
                  <span className={`reminder-badge ${new Date(localNote.reminderDate) < new Date() && !localNote.isReminderCompleted ? 'overdue' : localNote.isReminderCompleted ? 'completed' : ''}`}><i className="fa-regular fa-clock"></i> {new Date(localNote.reminderDate).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          </div>

          <div className="modal-header-actions">
            <button className="modal-action-btn pdf" title="Export PDF" onClick={() => triggerExport(localNote._id, 'pdf', showalert)}>
              <i className="fa-solid fa-file-pdf"></i>
            </button>
            <button className="modal-action-btn md" title="Export MD" onClick={() => triggerExport(localNote._id, 'md', showalert)}>
              <i className="fa-solid fa-file-lines"></i>
            </button>
            <button className="modal-action-btn docx" title="Export Word" onClick={() => triggerExport(localNote._id, 'docx', showalert)}>
              <i className="fa-solid fa-file-word"></i>
            </button>
            <button className="note-modal-close" onClick={onClose} aria-label="Close modal">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <div className="note-modal-body modern-body" style={{ maxHeight: '80vh' }}>
          <div className="view-pane">
            <div className="view-note-content rich-text-content modern-content" dangerouslySetInnerHTML={{ __html: localNote?.description }} />

            {summary && (
              <div className="ai-summary">
                <div className="panel-section-title">Smart Summary</div>
                <p>{summary}</p>
              </div>
            )}
          </div>

          <aside className="note-meta-panel">
            <div className="panel-section">
              <div className="panel-section-title">Note details</div>
              <div className="meta-row"><strong>Date</strong><span>{localNote?.date ? new Date(localNote.date).toLocaleString() : 'Recently'}</span></div>
              <div className="meta-row"><strong>Category</strong><span>{localNote?.tag || 'General'}</span></div>
              {localNote?.reminderDate && <div className="meta-row"><strong>Reminder</strong><span>{new Date(localNote.reminderDate).toLocaleString()}</span></div>}
              <div className="meta-row"><strong>Status</strong><span>{localNote?.isReminderCompleted ? 'Completed' : 'Pending'}</span></div>
              <div className="meta-row"><strong>Words</strong><span>{(stripHtmlOrText(localNote?.description || '').trim() || '').split(/\s+/).filter(Boolean).length}</span></div>
            </div>

            <div className="panel-section">
              <div className="panel-section-title">AI tools</div>
              <div className="panel-actions">
                <button className="btn-secondary wide" onClick={fetchSummary} disabled={loadingSummary}>{loadingSummary ? 'Summarizing…' : <><i className="fa-solid fa-brain"></i> Summarize</>}</button>
                <button className="btn-secondary wide" onClick={fetchTags} disabled={loadingTags}>{loadingTags ? 'Tagging…' : <><i className="fa-solid fa-tags"></i> Auto-tag</>}</button>
              </div>
            </div>

            {aiTags && aiTags.length > 0 && (
              <div className="panel-section">
                <div className="panel-section-title">Suggested tags</div>
                <div className="tag-list">
                  {aiTags.map((t) => (
                    <button key={t} className="tag-pill small" onClick={() => applyTag(t)}>{t}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="panel-section panel-cta">
              <button className="btn-secondary wide" onClick={() => { navigator.clipboard.writeText(stripHtmlOrText(localNote?.description || '')); showalert && showalert('Copied note to clipboard', 'success'); }}><i className="fa-solid fa-copy"></i> Copy text</button>
              {onEdit && (
                <button className="btn-secondary wide" onClick={handleEdit}><i className="fa-solid fa-pen-to-square"></i> Edit note</button>
              )}
            </div>
          </aside>
        </div>

        <div className="note-modal-footer modern-footer">
          <div className="view-note-meta">
            <span className="note-card-date"><i className="fa-regular fa-clock"></i> {localNote?.date ? new Date(localNote.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recently'}</span>
          </div>
          <button className="modal-btn-cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// Helper functions used in the modal
function stripHtmlOrText(html) {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

async function triggerExport(id, format, showalert) {
  try {
    showalert && showalert('Preparing download...', 'info');
    const host = process.env.REACT_APP_BACKEND_URL || '';
    const res = await fetch(`${host}/api/Notes/export/${id}?format=${format}`, { method: 'GET', headers: { 'auth-token': localStorage.getItem('token') } });
    if (!res.ok) { showalert && showalert('Export failed', 'danger'); return; }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const ext = format === 'md' ? 'md' : (format === 'docx' ? 'docx' : 'pdf');
    a.download = `note.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    showalert && showalert('Download started', 'success');
  } catch (err) {
    console.error(err);
    showalert && showalert('Export error', 'danger');
  }
}

export default ViewNoteModal;
