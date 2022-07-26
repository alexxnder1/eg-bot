const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    opener_id: Number,
    solvedBy: Number,
    reason: String,
    channel_id: Number,
    active: { type: Boolean, default: true },
    date: { type: Date, default: new Date().toUTCString() },
    solvedDate: Date,
    transcript: Array
});

const ticketModel = new mongoose.model('Tickets', schema);
module.exports = ticketModel;