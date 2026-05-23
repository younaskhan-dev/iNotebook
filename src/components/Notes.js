import React, { useEffect, useRef, useState } from 'react'
import Notecontext from '../context/notes/notecontext';
import { useContext } from 'react'
import Noteitem from './Noteitem';
import AddNote from './AddNote';
import { useNavigate } from "react-router-dom";
import ViewNoteModal from './dashboard/ViewNoteModal';
import RichTextEditor from './dashboard/RichTextEditor';

function Notes(props) {
    const navigate = useNavigate()
    const context = useContext(Notecontext);
    const { notes, getnotes,editenote } = context;
    useEffect(() => {
        if(localStorage.getItem('token')){
            getnotes()
        }
        else{
            navigate("/signup");
        }
        // eslint-disable-next-line
    }, [])
    const ref = useRef(null)
    const refclose = useRef(null)
    const [note, setnote] = useState({ id: '', etitle: '', edescription: '', etag: '', ereminderDate: '' })
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewingNote, setViewingNote] = useState(null);

    const updatenote = (currentnote) => {
        ref.current.click();
        setnote({ 
            id: currentnote._id, 
            etitle: currentnote.title, 
            edescription: currentnote.description, 
            etag: currentnote.tag,
            ereminderDate: currentnote.reminderDate ? new Date(currentnote.reminderDate).toISOString().slice(0, 16) : ''
        })
    }

    const openView = (note) => {
        setViewingNote(note);
        setViewModalOpen(true);
    };

    const clickhandle = (e) => {
        editenote(note.id ,note.etitle,note.edescription,note.etag, note.ereminderDate)
        refclose.current.click();
        props.showalert("successfully updated Note","success")

    }
    const onchange = (e) => {
        setnote({ ...note, [e.target.name]: e.target.value })
    }
    return (
        <>
            <AddNote showalert={props.showalert} />
            <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content glass-card border-0">
                        <div className="modal-header" style={{borderBottom: '1px solid var(--glass-border)'}}>
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-4">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name='etitle' value={note.etitle} aria-describedby="etextHelp" onChange={onchange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label">Description</label>
                                    <RichTextEditor
                                      value={note.edescription}
                                      onChange={(html) => setnote({ ...note, edescription: html })}
                                      placeholder="Edit your note details..."
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name='etag' value={note.etag} onChange={onchange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ereminderDate" className="form-label">Reminder Date & Time</label>
                                    <input type="datetime-local" className="form-control" id="ereminderDate" name='ereminderDate' value={note.ereminderDate} onChange={onchange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer" style={{borderTop: '1px solid var(--glass-border)'}}>
                            <button type="button" ref={refclose} className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" disabled={note.etitle.length<5 || note.edescription.length<5}  className="btn btn-premium" onClick={clickhandle}>Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row my-3'>
                <h1 className="mb-4">Your Cloud Notes</h1>
                <div className='container mx-2'>
                {notes.length===0 && "No notes to display"}
                </div>
                {notes.map((note) => {
                    return <Noteitem key={note._id} updatenote={updatenote} openView={openView} showalert={props.showalert}  note={note} />;
                })}
            </div>
            <ViewNoteModal
                isOpen={viewModalOpen}
                onClose={() => { setViewModalOpen(false); setViewingNote(null); }}
                note={viewingNote}
            />
        </>
    )
}

export default Notes
