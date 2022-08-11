const mongoose = require('mongoose');

const muteSchema = new mongoose.Schema({
    mutedId: Number,
    mutedTime: Number,
    muteReason: String,
    mutedBy: Number,
    mutedStatus: { type: Boolean, default: true },
    unmutedReason: String,
    unmutedBy: Number,
    mutedDate: { type: Date, default: new Date().toUTCString() }
});

const muteModel = mongoose.model('Mutes', muteSchema);
module.exports = muteModel;