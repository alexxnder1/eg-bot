const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    discord_id: Number,
    username: String,
    tag: String,
    joined: String,
    created: String
});

const userModel = new mongoose.model("Users", userSchema);
module.exports = userModel;