const model = require('../db/userSchema');
const utils = require('../utils');
const emojis = require('../emojis.json');
const Client = require('../index');
const channels = require('../channels.json');
const userModel = require('../db/userSchema');

module.exports = {
    generate_roles() {
        const guild = Client.guilds.cache.get(channels.guild_id);
        for(var i = 1; i <= 100; i++) {
            if(!guild.roles.cache.some(role => role.name === `Level ${i}`)) {
                var color = 0xffffff;
                
                switch(true)
                {
                    case i >= 75: color = 0xcc0000; break;
                    case i >= 50 && i < 75: color = 0x0026bf; break;
                    case i >= 30 && i < 50: color = 0x8700b0; break;
                    case i >= 20 && i < 30: color = 0xb35300; break;
                    case i >= 1 && i < 20: color = 0xa3a3a3; break;
                }
                    
                guild.roles.create({
                    name: `Level ${i}`,
                    color: color,
                    reason: 'test'
                })
            }
        }

        guild.members.fetch().then((members) => {
            members.forEach((member) => {
                userModel.findOne({ discord_id: member.user.id }, (err, res) => {
                    if(err) return console.log(err);
                    if(!res) return false;
                    if(!member.roles.cache.some(role => role.name === `Level ${res.level}`)) {
                        var levelRole = guild.roles.cache.find(role => role.name === `Level ${res.level}`);

                        member.roles.add(levelRole);
                    }
                });
            });
        });
    },
    
    execute(message) {
        const shardChance = Math.floor(1 + Math.random() * 101);
        var shards = 0;
        if(shardChance <= 2) {
            shards = shardChance / 2;
            message.reply(`${emojis.shard} You just received **${shards}** shards.`);
        }
               
        model.findOne({ discord_id: message.author.id }, (err, res) => {
            if(err)
                return console.log(err);
                
            const exp = Math.floor(Math.random() * 150) * (res.level / 2);
            const money = Math.floor(Math.random() * 525 * res.level);
                
            model.findOneAndUpdate({ discord_id: message.author.id }, { $inc: { messagesWritten: 1, experience: parseInt(exp), money: money, shards: shards } })
            .exec((err) => {
                if(err) return console.log(err);
            });

            if(res.experience >= utils.returnLevelUpPoints(res.level, res.experience)) {
                const guild = Client.guilds.cache.get(channels.guild_id);
                
                const newRole = guild.roles.cache.find(role => role.name === `Level ${res.level + 1}`);
                const oldRole = guild.roles.cache.find(role => role.name === `Level ${res.level}`);

                message.member.roles.remove(oldRole);
                message.member.roles.add(newRole);

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
                            value: '`💸 ' + `${utils.numberWithCommas(utils.returnLevelUpPoints((res.level + 1), res.experience))}` + '`',
                            inline: true
                        }
                    ]
                }
        
                message.reply( { embeds: [level] });        
            }
        });
    }
}