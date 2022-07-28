const channels = require('../channels.json');
const Client = require('../index');
const suggestModel = require('../db/suggestSchema');

module.exports = {
    execute(message, arg, splitted) {       
        let text = arg[1].split('suggest')[1];   

        if(!text || text.length < 7)
            return message.reply('You must type a good and real reason.');

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
    
            message.reply(`☑️ Your suggestion was successfully added, check <#${channels.suggest_channel}>.`);

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
        });
    }
};