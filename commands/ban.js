const { PermissionsBitField } = require('discord.js');
const banModel = require('../db/banSchema');

module.exports = {
    execute(message, arg, splitted) {
        const mention = message.mentions.members.first();

        if(!mention)
            return message.reply("You must mention the user that you want to ban.");
        
        const reason = splitted[3];
        const time = splitted[2];

        if(!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
            return message.reply("You don't have the necessary administrator level to use this command.");
        
        if(!reason || reason.length < 3 || time < 0)
            return message.reply("* ban <mention_user> <time (0=permanent) [days]> <reason>");

        const banLogChannel = message.guild.channels.cache.find((chn) => chn.name === 'ban-log');

        message.guild.members.fetch(mention).then((member) => {
            banLogChannel.send(`${member.user.tag} have been banned ${(time > 0) ? ('for ' + time + ' days') : ('permanent')} from our server by ${message.author.tag}, reason: ${reason}.`);
            
            // time * 86 400 000 = time from days to ms for timestamp
            banModel.create({
                discord_id: member.user.id,
                name: member.user.tag,
                reason: reason,
                bannedBy: message.author.tag,
                duration: (time > 0) ? new Date().getTime() + (time * 86400000) : ('permanent'),
                permanent: (time > 0) ? false : true,
                bannedById: message.author.id
            });

            console.log(`${member.user.tag} have been banned ${(time > 0) ? ('for ' + time + ' days') : ('permanent')} from our server by ${message.author.tag}, reason: ${reason}.`);
            member.user.send(`You have been banned ${(time > 0) ? ('for ' + time + ' days') : ('permanent')} from our server by ${message.author.tag}, reason: ${reason}.`).then(() => {
                member.ban();
            });
        }); 
    }
}