import React from 'react'
import Notecontext from '../context/notes/notecontext';
import { useContext } from 'react';
import { stripHtml } from '../utils/stripHtml';

function Noteitem(props) {
    const context = useContext(Notecontext);
    const { deletenote } = context;
    const { note, updatenote } = props;

    const previewText = stripHtml(note.description);

    return (
        <div className="col-md-4 my-3">
            <div className="glass-card h-100 p-4" style={{ cursor: 'pointer' }} onClick={() => props.openView(note)}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="mb-0 text-white" style={{fontWeight: '600'}}>{note.title}</h5>
                    <span className="note-badge">{note.tag || "General"}</span>
                </div>
                <p className="text-muted mb-4 preview-text" style={{fontSize: '0.95rem', lineHeight: '1.6'}}>
                    {previewText.length > 120 ? previewText.substring(0, 120) + "..." : previewText}
                </p>
                {note.reminderDate && (
                    <div className={`reminder-badge-container mb-3 ${new Date(note.reminderDate) < new Date() && !note.isReminderCompleted ? 'overdue' : note.isReminderCompleted ? 'completed' : ''}`}>
                        <i className={`fa-solid ${note.isReminderCompleted ? 'fa-circle-check' : 'fa-clock'} me-2`}></i>
                        <span style={{fontSize: '0.8rem'}}>
                            {note.isReminderCompleted ? 'Reminder Completed' : 
                             new Date(note.reminderDate) < new Date() ? 'Reminder Overdue' : 
                             `Reminder: ${new Date(note.reminderDate).toLocaleString()}`}
                        </span>
                    </div>
                )}
                <div className="mt-auto d-flex justify-content-end gap-3 pt-3" style={{borderTop: '1px solid var(--glass-border)'}}>
                    <i
                        className="fa-solid fa-trash text-danger"
                        style={{fontSize: '1.1rem', cursor: 'pointer', transition: 'transform 0.2s'}}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.2)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        onClick={(e) =>{ e.stopPropagation(); deletenote(note._id); props.showalert("Note Deleted Successfully","success")}}
                    ></i>
                    <i
                        className="fa-solid fa-pen-to-square text-primary"
                        style={{fontSize: '1.1rem', cursor: 'pointer', transition: 'transform 0.2s'}}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.2)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        onClick={(e) => { e.stopPropagation(); updatenote(note); }}
                    ></i>
                </div>
            </div>
        </div>

    )
}

export default Noteitem
