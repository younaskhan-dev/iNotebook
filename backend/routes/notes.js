const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Notes');
const { body, validationResult } = require('express-validator');
const PDFDocument = require('pdfkit');
const TurndownService = require('turndown');
const { Document, Packer, Paragraph, TextRun } = require('docx');

// Route 1: Get all the notes using GET "/api/notes/fetchallnotes?page=1&limit=10" login is required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
        const skip = (page - 1) * limit;

        const total = await Note.countDocuments({ user: req.user.id });
        const notes = await Note.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            data: notes,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
})
// Route 2: Add new notes  using Post "/api/Notes/addnotes" login is required
router.post('/addnotes', [
    body('title', 'enter a valid title').isLength({ min: 3 }),
    body('description', 'description must be at least 5 characters long').isLength({ min: 5 }),
], fetchuser, async (req, res) => {
    try {
        const { title, description, tag, reminderDate } = req.body;

        // if there are error return bad request and the error
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        const note = new Note({
            title, description, tag: tag && tag.trim() !== "" ? tag : "General", user: req.user.id, reminderDate
        })
        const savenote = await note.save()
        res.json(savenote)

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
})
// Route 3: update  notes  using put "/api/Notes/updatentes" login is required
router.put('/updatenotes/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag, reminderDate, isReminderCompleted } = req.body;
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).json({ error: 'Note not found' }); }

        if (note.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const newnote = {};
        if (title) newnote.title = title;
        if (description) newnote.description = description;
        if (tag) newnote.tag = tag;

        const oldReminder = note.reminderDate ? note.reminderDate.toISOString() : null;
        const newReminder = reminderDate ? new Date(reminderDate).toISOString() : null;
        if (reminderDate !== undefined) {
            newnote.reminderDate = reminderDate;
            if (oldReminder !== newReminder) {
                newnote.isReminderCompleted = false;
            }
        }

        if (isReminderCompleted !== undefined) {
            newnote.isReminderCompleted = isReminderCompleted;
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true });
        res.json({ note });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
})
// Route 4: Delete  notes  using put "/api/Notes/deletenotes" login is required
router.delete('/deletenotes/:id', fetchuser, async (req, res) => {
    try {
        // find the notes that to be delete
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).json({ error: 'Note not found' }); }

        if (note.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }
        // delete the notes 
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ success: true, message: 'Note deleted successfully' })
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// Route 5: Export a note in different formats: pdf, md, docx
router.get('/export/:id', fetchuser, async (req, res) => {
    try {
        const format = (req.query.format || 'pdf').toString().toLowerCase();
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ error: 'Note not found' });
        if (note.user.toString() !== req.user.id) return res.status(403).json({ error: 'Access denied' });

        const safeName = (note.title || 'note').replace(/[^a-z0-9\-_.]/gi, '_');

        const turndown = new TurndownService();

        if (format === 'md' || format === 'markdown') {
            const md = `# ${note.title || ''}\n\n` + turndown.turndown(note.description || '');
            res.setHeader('Content-Type', 'text/markdown');
            res.setHeader('Content-Disposition', `attachment; filename="${safeName}.md"`);
            return res.send(md);
        }

        if (format === 'docx' || format === 'word') {
            const plain = turndown.turndown(note.description || '');
            const paragraphs = [];
            paragraphs.push(new Paragraph({ children: [new TextRun({ text: note.title || '', bold: true })] }));
            paragraphs.push(new Paragraph({ children: [new TextRun({ text: '' })] }));
            plain.split(/\r?\n/).forEach(line => {
                paragraphs.push(new Paragraph({ children: [new TextRun({ text: line })] }));
            });
            const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
            const buffer = await Packer.toBuffer(doc);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.setHeader('Content-Disposition', `attachment; filename="${safeName}.docx"`);
            return res.send(buffer);
        }

        // default: pdf
        const plainText = turndown.turndown(note.description || '');
        const doc = new PDFDocument({ margin: 40 });
        const chunks = [];
        doc.on('data', (c) => chunks.push(c));
        doc.on('end', () => {
            const result = Buffer.concat(chunks);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${safeName}.pdf"`);
            res.send(result);
        });

        doc.fontSize(18).text(note.title || '', { underline: true });
        doc.moveDown();
        doc.fontSize(12).text(plainText, { align: 'left' });
        doc.end();

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// Simple extractive summarizer and auto-tagging (lightweight, on-server)
function summarizeText(text, maxSentences = 3) {
    if (!text) return '';
    // split into sentences
    const sentences = text.match(/[^.!?]+[.!?]?/g) || [text];
    const stopwords = new Set(['the','is','in','and','to','a','of','for','on','with','that','it','as','are','was','be','by','or','an','at','from','this','which','you','your']);
    const freq = {};
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(Boolean);
    words.forEach(w => { if (!stopwords.has(w) && w.length>2) freq[w] = (freq[w]||0)+1; });

    const scored = sentences.map((s, i) => {
        const sWords = s.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(Boolean);
        const score = sWords.reduce((acc, w) => acc + (freq[w]||0), 0);
        return { i, s: s.trim(), score };
    });

    scored.sort((a,b)=>b.score - a.score);
    const selected = scored.slice(0, Math.min(maxSentences, scored.length)).sort((a,b)=>a.i-b.i);
    return selected.map(x=>x.s).join(' ');
}

function extractTags(text, maxTags = 3) {
    if (!text) return [];
    const stopwords = new Set(['the','is','in','and','to','a','of','for','on','with','that','it','as','are','was','be','by','or','an','at','from','this','which','you','your']);
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(Boolean);
    const freq = {};
    words.forEach(w => { if (!stopwords.has(w) && w.length>3) freq[w] = (freq[w]||0)+1; });
    const sorted = Object.keys(freq).sort((a,b)=>freq[b]-freq[a]);
    return sorted.slice(0, maxTags).map(w => w.charAt(0).toUpperCase()+w.slice(1));
}

// Route: Summarize note
router.get('/summarize/:id', fetchuser, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ error: 'Note not found' });
        if (note.user.toString() !== req.user.id) return res.status(403).json({ error: 'Access denied' });
        const turndown = new TurndownService();
        const plain = turndown.turndown(note.description || '');
        const summary = summarizeText(plain, 3);
        res.json({ summary });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route: Auto-tag note
router.get('/autotag/:id', fetchuser, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ error: 'Note not found' });
        if (note.user.toString() !== req.user.id) return res.status(403).json({ error: 'Access denied' });
        const turndown = new TurndownService();
        const plain = turndown.turndown(note.description || '');
        const tags = extractTags((note.title || '') + ' ' + plain, 3);
        res.json({ tags });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route: Search suggestions (from user's notes)
router.get('/suggest', fetchuser, async (req, res) => {
    try {
        const q = (req.query.q || '').toString().toLowerCase().trim();
        if (!q) return res.json([]);
        const notes = await Note.find({ user: req.user.id });
        const suggestions = new Set();
        for (const n of notes) {
            if (n.title && n.title.toLowerCase().includes(q)) suggestions.add(n.title);
            if (n.tag && n.tag.toLowerCase().startsWith(q)) suggestions.add(n.tag);
            const words = (n.title+' '+(n.tag||'')+' '+(n.description||'')).toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(Boolean);
            for (const w of words) { if (w.startsWith(q) && w.length>2) { suggestions.add(w); if (suggestions.size>=12) break; } }
            if (suggestions.size>=12) break;
        }
        res.json(Array.from(suggestions).slice(0,12));
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router; 