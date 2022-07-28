const model = require('../db/userSchema');
const utils = require('../utils');
const emojis = require('../emojis.json');

module.exports = {
    execute(message) {
        const exp = Math.floor(Math.random() * 101);
        const money = Math.floor(Math.random() * 220 * exp);
        
        const shardChance = Math.floor(Math.random() * 101);
        var shards = 0;
        if(shardChance <= 2) {
            shards = shardChance / 2;
            message.reply(`${emojis.shard} You just received **${shards}** shards.`);
        }
       
        model.findOneAndUpdate({ discord_id: message.author.id }, { $inc: { messagesWritten: 1, experience: exp, money: money, shards: shards } })
            .exec((err) => {
                if(err) return console.log(err);
            });
        
        model.findOne({ discord_id: message.author.id }, (err, res) => {
            if(err)
                return console.log(err);

            if(res.experience >= utils.returnLevelUpPoints(res.level)) {
                model.updateOne({ discord_id: message.author.id }, { $inc: { level: 1 }})
                .exec((err) => {
                    if(err) return console.log(err);
                });

                const level = {
                    color: 0x4287f5,
                    title: `${message.author.tag} achieved a new level of ${res.level + 1}!`,
                    author: {
                        name: 'Level Up!',
                        iconURL: "https://imgur.com/1nqnLxd.png",
                    },
        
                    fields: [
                        {
                            name: `${emojis.xp} Actual EXP`,
                            value: '`💳 ' + `${utils.numberWithCommas(res.experience)}` + '`',
                            inline: true
                        },
                        
                        {
                            name: `${emojis.xp}Next Level EXP`,
                            value: '`💸 ' + `${utils.numberWithCommas(utils.returnLevelUpPoints((res.level + 1)))}` + '`',
                            inline: true
                        }
                    ]
                }
        
                message.reply( { embeds: [level] });        
            }
        });
    }
}