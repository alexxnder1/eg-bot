const mongoose = require('mongoose');

const kickSchema = mongoose.Schema({
    id: Number,
    name: String,
    date: { type: Date, default: new Date().toUTCString() },
    reason: String,
    kickedBy: String,
    kickedById: Number
});

const kickModel = new mongoose.model('Kicks', kickSchema);
module.exports = kickModel;