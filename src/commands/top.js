const emojis = require('../../emojis.json');
const utils = require('../../utils');

const { SlashCommandBuilder } = require('discord.js');
const { getUsersSorted } = require('../commands/rank.js'); 

const data = new SlashCommandBuilder()
    .setName('top')
    .setDescription('Shows you the server top users sorted by level, money, & shards.');

async function execute(int) {       
    const top = [];

    const users = await getUsersSorted();
    users.forEach((user) => {
        top.push({
            name: `**#${users.indexOf(user) + 1}.** ${user.tag} [level ${users[users.indexOf(user)].level}] ${((users.indexOf(user) + 1) == 1) ? ('👑') : ('')}`,
            value: `EXP: **${utils.numberWithCommas(users[users.indexOf(user)].experience)}** ${emojis.xp} | Money: **$${utils.numberWithCommas(users[users.indexOf(user)].money)}** ${emojis.money} | Shards: **${utils.numberWithCommas(users[users.indexOf(user)].shards)}** ${emojis.shard} `    
        });
    });

    const embed = {
        color: 0x7ffc03,
        title: '🏅 Top 10 members',
        fields: top,
        thumbnail: {
            url: 'https://i.imgur.com/ZImaZxH.png'
        }
    }

    int.reply({ embeds: [embed]});
}

module.exports = { execute, data };