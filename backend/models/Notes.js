const mongoose = require('mongoose');
// const User = require('./User');
// const { type } = require('@testing-library/user-event/dist/type');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {                    
    type: String,
    default: "General"
  },
    date: {
        type: Date,
        default: Date.now
    },
    reminderDate: {
        type: Date,
        default: null
    },
    isReminderCompleted: {
        type: Boolean,
        default: false
    }
},
{ collection: 'notes' });
module.exports = mongoose.model('Note', NotesSchema);

