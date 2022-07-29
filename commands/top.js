const userModel = require('../db/userSchema');
const emojis = require('../emojis.json');
const utils = require('../utils');

module.exports = {
    execute(message) {       
        const top = [];
        userModel.find({ bot: undefined }).sort({ level: -1, experience: -1, money: -1, shards: -1 }).limit(10).exec((err, res) => {
            if(err) return console.log(err);
            res.forEach((user) => {
                top.push({
                    name: `**#${res.indexOf(user) + 1}.** ${user.tag} [level ${res[res.indexOf(user)].level}] ${((res.indexOf(user) + 1) == 1) ? ('👑') : ('')}`,
                    value: `EXP: **${utils.numberWithCommas(res[res.indexOf(user)].experience)}** ${emojis.xp} | Money: **$${utils.numberWithCommas(res[res.indexOf(user)].money)}** ${emojis.money} | Shards: **${utils.numberWithCommas(res[res.indexOf(user)].shards)}** ${emojis.shard} `    
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

            message.reply({ embeds: [embed]});
        });
    }
}