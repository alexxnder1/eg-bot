const mongoose = require('mongoose');

const banSchema = mongoose.Schema({
    discord_id: Number,
    name: String,
    date: { type: Date, default: new Date().toUTCString() },
    reason: String,
    bannedBy: String,
    duration: Number,
    permanent: Boolean,
    bannedById: Number
});

const banModel = new mongoose.model('Bans', banSchema);
module.exports = banModel;