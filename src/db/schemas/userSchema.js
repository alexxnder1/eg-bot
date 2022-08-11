const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    discord_id: Number,
    username: String,
    tag: String,
    joined: String,
    created: String,
    wallpapers: [{ 
        name: { type: String, default: 'default' },
        link:  { type: String },
        shard:  { type: Number },
        money:  { type: Number },
        active:  { type: Boolean, default: true },
    }],
    fishes: [{
        name: String,
        price: Number,
        date: Date,
        count: Number,
    }],
    
    skills: [{
        name: String,
        points: Number,
        skill: Number,
    }], 
    dailyReward: { type: Number, default: 0 }, 
    messagesWritten: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    money: { type: Number, default: 0 },
    shards: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    bot: { type: Boolean, default: false }
});

const userModel = new mongoose.model("Users", schema);
module.exports = userModel;