const { PermissionsBitField } = require('discord.js');
const kickModel = require('../db/kickSchema');

module.exports = {
    execute(message, arg, splitted) {
        const reason = splitted[2];
        const mention = message.mentions.users.first();

        if(!mention)
            return message.reply("You must mention the user that you want to ban.");
        
        if(!mention.author.permissions.has(PermissionsBitField.Flags.KickMembers))
            return message.reply("You don't have the necessary administrator level to use this command.");

        if(!reason || reason.length < 3)
            return message.reply("* kick <mention_user> <reason>");

        const kickLogChannel = message.guild.channels.cache.find((chn) => chn.name === 'kick-log');
        if(!mention)
            return message.reply("You must mention the user that you want to kick.");

        message.guild.members.fetch(mention).then((member) => {
            kickLogChannel.send(`${member.user.tag} have been kicked from our server by ${message.author.tag}, reason: ${reason}.`);
            
            kickModel.create({
                id: member.user.id,
                name: member.user.tag,
                reason: reason,
                kickedBy: message.author.tag,
                kickedById: message.author.id
            });

            console.log(`${member.user.tag} have been kicked from our server by ${message.author.tag}, reason: ${reason}.`);
            member.user.send(`You have been kicked from our server by ${message.author.tag}, reason: ${reason}.`).then(() => {
                member.kick();
            });
        }); 
    }
}