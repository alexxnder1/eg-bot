const userModel = require('../db/schemas/userSchema');
const emojis = require('../../emojis.json');
const utils = require('../../utils.js');

const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Get your daily prizes in a 24-hour cycle.')

async function execute(int) {
    const Client = require('../../index');
    userModel.findOne({ discord_id: int.user.id }, async(err, res) => {
        if(err)
            return console.log(err);

        if(!res)
            return false;   
            
        // first daily | note: 86 400 000 = 24 hours -> ms            
        if(!res.dailyReward || (new Date().getTime() - res.dailyReward) >= 86400000) {
            var exp = res.level * Math.floor(120 + Math.random() * 5);
            var money = res.level * Math.floor(3500 + Math.random() * 3620);
            var shards = Math.floor(1 + Math.random() * 5); 
            const embed = {
                color: 0xedc600,
                title: '🎁 Daily Reward',
                description: `These are the earnings for <@${int.user.id}>.`,
                fields: [
                    {
                        name: `EXP ${emojis.xp}`,
                        value: `+${utils.numberWithCommas(exp)}`,
                        inline: true,
                    },
                    {
                        name: `Money ${emojis.money}`,
                        value: `+$${utils.numberWithCommas(money)}`,
                        inline: true,
                    },
                    {
                        name: `Shards ${emojis.shard}`,
                        value: `+${utils.numberWithCommas(shards)}`,
                        inline: true,
                    }
                ],  
                footer: {
                    text: 'Eastern Games BOT',
                    iconURL: Client.user.displayAvatarURL(),   
                }
            }   
            await int.reply({ embeds: [embed], ephemeral: true}); 
            userModel.updateOne({ discord_id: int.user.id }, { $inc: { money: money, shards: shards, experience: exp }, $set: { dailyReward: new Date().getTime() } }, (err, res) => {
                if(err) return console.log(err);
            });
        }   
        else {
            const date = ((res.dailyReward + 86400000) - new Date().getTime());
            const hours = date/1000/60/60;
            const minute = hours.toString().split('.');

            await int.reply({ content: `You can get your daily reward in **${Math.trunc(hours)}:${Math.trunc(parseFloat(`0.${minute[1]}`) * 60)}** hours.`, ephemeral: true});
        }
    });
}

module.exports = { execute, data };