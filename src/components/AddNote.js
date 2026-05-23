import React, { useState } from 'react'
import Notecontext from '../context/notes/notecontext';
import { useContext } from 'react';
import RichTextEditor from './dashboard/RichTextEditor';

const AddNote = (props) => {
     const context = useContext(Notecontext);
        const {addnote } = context;
        const [note, setnote] = useState({title:'', description:'',tag:'', reminderDate: ''})

        const clickhandle=(e)=>{
            e.preventDefault();
             addnote(note.title, note.description, note.tag, '', note.reminderDate);
             setnote({title:'', description:'',tag:'', reminderDate: ''})
             props.showalert("Add Note Successfully", "success")

        }
        const onchange=(e)=>{
            setnote({...note ,[e.target.name]:e.target.value})
        }

        const onEditorChange = (html) => {
            setnote(prev => ({ ...prev, description: html }));
        }

  return (
    <div className="container my-4">
      <div className="glass-card p-4">
        <h2 className="mb-4">Add a New Note</h2>
        <form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input type="text" className="form-control" id="title" name='title' placeholder="What's on your mind?" value={note.title} onChange={onchange} minLength={5} required />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="tag" className="form-label">Tag</label>
              <input type="text" className="form-control" id="tag" name='tag' placeholder="Work, Personal, etc." value={note.tag} onChange={onchange} />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="reminderDate" className="form-label">Set Reminder (Optional)</label>
              <input type="datetime-local" className="form-control" id="reminderDate" name='reminderDate' value={note.reminderDate} onChange={onchange} />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="form-label">Description</label>
            <RichTextEditor 
              value={note.description} 
              onChange={onEditorChange} 
              placeholder="Write your note here... (Markdown supported: # Heading, - List, **Bold**)"
            />
          </div>
        
          <button type="submit" disabled={note.title.length<5 || note.description.length<10} className="btn btn-premium w-100 py-2" onClick={clickhandle}>Save Note to iNotebook</button>
        </form>
      </div>
    </div>
  )
}

export default AddNote

