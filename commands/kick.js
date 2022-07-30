const { PermissionsBitField } = require('discord.js');
const kickModel = require('../db/kickSchema');
const channels = require('../channels.json');

module.exports = {
    execute(message, arg, splitted) {
        if(!message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
            return message.reply("You don't have the necessary administrator level to use this command.");

        const mention = message.mentions.users.first();

        if(!mention)
            return message.reply("You must mention the user that you want to ban.");
        
        const reason = arg[1].split(`kick ${mention} `)[1];

        if(!reason || reason.length < 3)
            return message.reply("* kick <mention_user> <reason>");
            
        const kickLogChannel = message.guild.channels.cache.find((chn) => chn.id === channels.kick_log_channel);
        if(!mention)
            return message.reply("You must mention the user that you want to kick.");

        message.guild.members.fetch(mention).then((member) => {
            member.kick().catch((err) => {if (err) return message.reply('An error occurred.'); }).then(() => {
                
                kickLogChannel.send(`${member.user.tag} have been kicked from our server by ${message.author.tag}, reason: ${reason}.`);
            
                kickModel.create({
                    id: member.user.id,
                    name: member.user.tag,
                    reason: reason,
                    kickedBy: message.author.tag,
                    kickedById: message.author.id
                });
    
                console.log(`${member.user.tag} have been kicked from our server by ${message.author.tag}, reason: ${reason}.`);
                message.channel.send(`☑️ You successfully kicked ${member.user.tag}.`);
            });
        });
    }
}