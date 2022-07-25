const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    discord_id: Number,
    username: String,
    tag: String,
    joined: String,
    created: String,
    messagesWritten: { type: Number, default: 0 },
    level: { type: Number, default: 1 }
});

const userModel = new mongoose.model("Users", schema);
module.exports = userModel;