const mongoose = require('mongoose');

const sis = new mongoose.Schema({
    gate_channel: String,
    ticket_channel: String,
    suggest_channel: String,
    rules_channel: String,

    guild_id: String,
    bot_id: String,
    dev_id: String,
    not_verified_role_id: String,
    
    ticket_log_channel: String,
    ban_log_channel: String,
    kick_log_channel: String,
    mute_log_channel: String
});

const sis_model = new mongoose.model('Server Info', sis);
module.exports = sis_model; 