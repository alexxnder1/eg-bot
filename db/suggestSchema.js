const mongoose = require('mongoose');

const suggestSchema = mongoose.Schema({
    discord_id: Number,
    name: String,
    text: String,
    message_id: Number,
    date: { type: Date, default: new Date().toUTCString() }, 
    YesVotes: { type: Number, default: 1 },
    NoVotes: { type: Number, default: 1 }
});

const suggestModel = new mongoose.model('Suggests', suggestSchema);
module.exports = suggestModel;