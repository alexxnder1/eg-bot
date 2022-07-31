const userModel = require('../db/userSchema');
const emojis = require('../emojis.json');
const utils = require('../utils.js');

module.exports = {
    execute(message) {
        userModel.findOne({ discord_id: message.author.id }, (err, res) => {
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
                    description: `These are the earnings for <@${message.author.id}>.`,
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
                        iconURL: "https://imgur.com/1nqnLxd.png",

                    }
                }

                message.react('🎁');
                message.reply({ embeds: [embed]} );

                userModel.updateOne({ discord_id: message.author.id }, { $inc: { money: money, shards: shards, experience: exp }, $set: { dailyReward: new Date().getTime() } }, (err, res) => {
                    if(err) return console.log(err);
                });
            }

            else {
                const date = ((res.dailyReward + 86400000) - new Date().getTime());
                const hours = date/1000/60/60;
                const minute = hours.toString().split('.');
                
                message.reply(`You can get your daily reward in **${Math.trunc(hours)}:${Math.trunc(parseFloat(`0.${minute[1]}`) * 60)}** hours.`);
            }
        });
    }
}