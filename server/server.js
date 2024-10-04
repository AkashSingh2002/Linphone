// File: server.js (Backend)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/linphone_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define Contact schema
const contactSchema = new mongoose.Schema({
    contactname: String,
    contactSipAddress: String,
});

const Contact = mongoose.model('Contact', contactSchema);

// Routes
// GET all contacts
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new contact
app.post('/api/contacts', async (req, res) => {
    const contact = new Contact({
        contactname: req.body.contactname,
        contactSipAddress: req.body.contactSipAddress,
    });

    try {
        const newContact = await contact.save();
        res.status(201).json(newContact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));