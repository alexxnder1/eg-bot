const channels = require('../channels.json');
const Client = require('../index');
const suggestModel = require('../db/suggestSchema');

require('dotenv').config()

module.exports = {
    execute(message) {       
        let text = message.content.slice(process.env.PREFIX.length + 9);   

        if(!text || text.length < 7)
            return message.reply('You must type a good and real reason.').then((msg) => {setTimeout(() => msg.delete({ timeout: 1000 }) , 4000); });

        const guild = Client.guilds.cache.get(channels.guild_id);
        const channel = guild.channels.cache.find((chn) => chn.id === channels.suggest_channel);

        suggestModel.count({}, (err, res) => {
            if(err) return console.log(err);

            const embed = {
                color: 0x34eb8c,
                title: `💿 Suggest #${res + 1}`,
                description: text,
    
                thumbnail: {
                    url: message.author.displayAvatarURL()
                },
    
                fields: [
                    {
                        name: '`Suggest By`',
                        value: message.author.tag,
                        inline:true,
                    },
                    
                    {
                        name: '`Date`',
                        value: new Date().toUTCString(),
                        inline:true,
                    }
                ],
    
                footer: {
                    text:  "Eastern Games BOT",
                    icon_url: "https://imgur.com/1nqnLxd.png"
                }
            }
    
            channel.send({ embeds: [embed] }).then((msg) => {
                msg.react('👍');
                msg.react('👎');
                
                suggestModel.create({
                    discord_id: message.author.id,
                    name: message.author.tag,
                    text: text,
                    YesVotes: 1,
                    message_id: msg.id,
                    NoVotes: 1
                });
            }); 

            setTimeout(() => {
                message.delete();
            }, 4000);
        });
    }
};