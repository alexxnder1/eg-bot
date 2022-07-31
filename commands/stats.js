const userSchema = require('../db/userSchema');
const utils = require('../utils');
const emojis = require('../emojis.json');

module.exports = {
    execute(message) {
        userSchema.findOne({ discord_id: message.author.id }, (err, res) => {
            if(err) return console.log(err);

            if(!res) 
                return message.reply('An error occurred with your database account. Please try again later.');
        
            const embed = {
                color: 0x3236a8,
                title: `📊 ${message.author.tag}'s account statistics`,
                thumbnail: {
                    url: message.author.displayAvatarURL()
                },
        
                fields: [
                    {
                        name: `Level ${res.level} ${emojis.xp} `,
                        value: `(${utils.numberWithCommas(res.experience)}/${utils.numberWithCommas(utils.returnLevelUpPoints((res.level + 1), res.messagesWritten))} EXP)`,
                        inline: false
                    },

                    
                    {
                        name: `Money ${emojis.money}`,
                        value: `$${utils.numberWithCommas(res.money)}`,
                        inline: false
                    },

                    {
                    
                        name: `Shards ${emojis.shard}`,
                        value: `${utils.numberWithCommas(res.shards)}`,
                        inline: false
                    },
                    
                    {
                    
                        name: `Messages ${emojis.message}`,
                        value: `${utils.numberWithCommas(res.messagesWritten)}`,
                        inline: false
                    }
                ],

                footer: {
                    text: 'Eastern Games BOT',
                    icon_url: "https://imgur.com/1nqnLxd.png"
                }
            }   

            message.reply({ embeds: [embed] });
        });
    }
}