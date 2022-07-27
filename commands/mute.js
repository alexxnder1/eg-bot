const muteModel = require('../db/muteSchema');

module.exports = {
    execute(message, arg, splitted) {
        let person = splitted[1];
        let time = splitted[2];
        let reason = splitted[3];

        const mutedRole = message.guild.roles.cache.find((role) => role.name === 'Muted');

        if(!person || !time || !reason || reason.length < 3)
            return message.reply("`* " + process.env.PREFIX + " mute <mention_user> <time [min]> <reason>`");

        message.guild.members.fetch(message.mentions.users.first().id).then((member) => {
            if(!member)
                return message.reply("You must mention a user in order to mute him.");
        
            if(member.roles.cache.some(role => role === mutedRole))
                return message.reply("This user is already muted.");

            muteModel.create({
                mutedId: member.user.id,
                muteReason: reason,
                mutedTime: new Date().getTime() + (time * 60000),
                mutedBy: message.author.id,
                mutedStatus: true,
                mutedDate: new Date().toUTCString()
            }); 
        
            member.roles.add(mutedRole).then(() => {
                message.reply(`You muted <@${member.user.id}> for ${time} minutes, reason: ${reason}.`);
            });

            const muteLog = message.guild.channels.cache.find((ch) => ch.name === 'mute-log');
            muteLog.send(`<@${message.author.id}> muted <@${member.user.id}> for ${time} minutes, reason: ${reason}.`);
        });
    }
}