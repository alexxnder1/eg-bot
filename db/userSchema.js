const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    discord_id: Number,
    username: String,
    tag: String,
    joined: String,
    created: String,
    dailyReward: { type: Number, default: 0 },
    messagesWritten: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    nextExperience: { type: Number },
    money: { type: Number, default: 0 },
    shards: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    bot: { type: Boolean, default: false }
});

const userModel = new mongoose.model("Users", schema);
module.exports = userModel;