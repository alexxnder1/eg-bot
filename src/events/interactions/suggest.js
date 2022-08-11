const suggestModel = require('../../db/schemas/suggestSchema');
const server_info = require('../../db/loadServerInfo');

const { InteractionType } = require('discord.js');

module.exports = {
    modal : async int => {
        if(int.type !== InteractionType.ModalSubmit) return;
        if(int.customId !== 'suggest-modal') return;

        const message = int.fields.getTextInputValue('suggest-text');
        const Client = require('../../../index');

        suggestModel.count({}, (err, res) => {
            if(err) return console.log(err);
    
            const embed = {
                color: 0x34eb8c,
                title: `💿 Suggest #${res + 1}`,
                description: message,
    
                thumbnail: {
                    url: int.user.displayAvatarURL()
                },
    
                fields: [
                    {
                        name: '`Suggest By`',
                        value: int.user.tag,
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
                    icon_url: Client.user.displayAvatarURL()
                }
            }
            
            const guild = Client.guilds.cache.get(server_info[0].guild_id);
            const channel = guild.channels.cache.find((chn) => chn.id === server_info[0].suggest_channel);
        
            channel.send({ embeds: [embed] }).then((msg) => {
                msg.react('👍');
                msg.react('👎');
                
                suggestModel.create({
                    discord_id: int.user.id,
                    name: int.user.tag,
                    text: message,
                    YesVotes: 1,
                    message_id: msg.id,
                    NoVotes: 1
                });
            }); 
            
        });
        await int.reply({ content: `Your suggestion was successfully sent to the <#${server_info[0].suggest_channel}> channel.`, ephemeral: true });
    },

    reactionAdd(reaction) {
        if(reaction.message.channel.id !== server_info[0].suggest_channel) 
            return false;

        if(reaction.emoji.name !==  '👍' && reaction.emoji.name !==  '👎')
            return false;

        reaction.message.reactions.resolve(reaction.emoji.name).users.fetch().then(users => {
            users.forEach(user => {
                if(user.bot) return false;
        
                suggestModel.findOneAndUpdate({ message_id: reaction.message.id }, { $inc:  (reaction.emoji.name == '👍') ? ({ YesVotes: 1 }) : ({ NoVotes: 1 }) }, (err, res) => {
                    if(err)
                        return console.log(err);
        
                    if(!res)
                        return console.log(`Can not update into database the reaction by ${user.tag} at the suggest of ${res.discord_id}.`);
                
                    console.log(`Updated into database the reaction [id: ${reaction.count}] by ${user.tag} at the suggest of ${res.discord_id}.`);
                });
            });
        });
        
    },

    reactionRemove(reaction) {
        if(reaction.message.channelId !== server_info[0].suggest_channel) 
            return false;

        if(reaction.emoji.name !==  '👍' && reaction.emoji.name !==  '👎')
            return false;

        suggestModel.findOneAndUpdate({ message_id: reaction.message.id }, { $inc:  (reaction.emoji.name == '👍') ? ({ YesVotes: -1 }) : ({ NoVotes: -1 }) }, (err, res) => {
            if(err)
                return console.log(err);

            if(!res)
                return console.log(`Can not update into database the reaction at the suggest of ${res.discord_id}.`);
        
            console.log(`Removed into database the reaction ${res.discord_id}.`);
        });
    }
}