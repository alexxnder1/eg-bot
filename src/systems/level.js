const model = require('../db/schemas/userSchema');
const utils = require('../../utils');
const emojis = require('../../emojis.json');
const Client = require('../../index');
const server_info = require('../db/loadServerInfo');
const userModel = require('../db/schemas/userSchema');

module.exports = {
    generate_roles() {
        const guild = Client.guilds.cache.get(server_info[0].guild_id);
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

            if(!res)
              return false;


            const exp = Math.floor(Math.random() * 150) * (res.level / 2);
            const money = Math.floor(Math.random() * 525 * res.level);

            res.messagesWritten ++;
            res.experience += parseInt(exp);
            res.money += money,
            res.shards += shards;
            if(res.experience >= utils.returnLevelUpPoints(res.level + 1)) {
                res.level ++;
                utils.setRoleForLevel(message, res.level);

                const level = {
                    color: 0x4287f5,
                    title: `${message.author.tag} achieved a new level of ${res.level}!`,
                    author: {
                        name: 'Level Up!',
                        iconURL: Client.user.displayAvatarURL(),
                    },
        
                    fields: [
                        {
                            name: `${emojis.xp} Actual EXP`,
                            value: '`💳 ' + `${utils.numberWithCommas(res.experience)}` + '`',
                            inline: true
                        },
                        
                        {
                            name: `${emojis.xp}Next Level EXP`,
                            value: '`💸 ' + `${utils.numberWithCommas(utils.returnLevelUpPoints(res.level))}` + '`',
                            inline: true
                        }
                    ]
                }
        
                message.reply( { embeds: [level] });        
            }

            res.save();  
        });
    }
}