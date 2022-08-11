const { SlashCommandBuilder } = require('discord.js');
const userModel = require('../db/schemas/userSchema');

const data = new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Shows your rank.')

async function getUsersSorted () {
    let result = userModel.find({ }).sort({ level: -1, experience: -1, money: -1, shards: -1 }).limit(10);
    return result;
}

async function execute(int) {       
    const users = await getUsersSorted();
    users.forEach((member) => {
        if(member.discord_id == int.user.id) {
            let rank = users.indexOf(member) + 1;
            int.reply(`${rank === 1 ? ('👑') : ('')} Your rank in server top is **#${rank}**.`);                        
        }
    })
}
module.exports = {execute, data, getUsersSorted};