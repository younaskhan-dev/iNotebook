const cron = require('node-cron');
const Note = require('../models/Notes');
const User = require('../models/User');
const sendEmail = require('./emailService');

const startReminderJob = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            
            // Find notes that have a reminderDate due and not yet completed
            const dueNotes = await Note.find({
                reminderDate: { $lte: now },
                isReminderCompleted: false
            }).populate('user');

            for (const note of dueNotes) {
                if (note.user && note.user.email) {
                    const subject = `🔔 Reminder: ${note.title}`;
                    const text = `Hello ${note.user.name},\n\nThis is a reminder for your note: "${note.title}"\n\nDescription: ${note.description}\n\nStay productive!\niNoteBook Team`;
                    const html = `
                        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                            <h2 style="color: #4d1f42;">🔔 Reminder: ${note.title}</h2>
                            <p>Hello <strong>${note.user.name}</strong>,</p>
                            <p>This is a reminder for your note:</p>
                            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 5px solid #4d1f42;">
                                <p><strong>${note.title}</strong></p>
                                <p>${note.description}</p>
                            </div>
                            <p style="margin-top: 20px;">Stay productive!<br><strong>iNoteBook Team</strong></p>
                        </div>
                    `;

                    const emailSent = await sendEmail(note.user.email, subject, text, html);
                    
                    if (emailSent) {
                        // Mark reminder as completed so it doesn't send again
                        note.isReminderCompleted = true;
                        await note.save();
                        console.log(`Reminder sent to ${note.user.email} for note: ${note.title}`);
                    }
                }
            }
        } catch (error) {
            console.error('Error in reminder job:', error);
        }
    });
};

module.exports = startReminderJob;
