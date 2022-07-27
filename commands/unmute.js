const muteModel = require('../db/muteSchema');

module.exports = {
    execute(message, arg, splitted) {
        let person = splitted[1];
        let reason = splitted[2];
        
        const mutedRole = message.guild.roles.cache.find((role) => role.name === 'Muted');

        if(!person || !reason || reason.length < 3)
            return message.reply("`* " + process.env.PREFIX + " unmute <mention_user> <reason>`");

        message.guild.members.fetch(message.mentions.users.first().id).then((member) => {
            if(!member)
                return message.reply("You must mention a user in order to mute him.");
                  
            if(!member.roles.cache.some(role => role === mutedRole))
                return message.reply("This user is not muted.");

            muteModel.findOneAndUpdate({ mutedId: member.user.id }, { $set: { mutedStatus: false, unmutedBy: message.author.id, unmutedReason: reason } }, (err) => {
                if(err) return console.log(err);
            });

            member.roles.remove(mutedRole).then(() => {
                message.reply(`You unmuted <@${member.user.id}>, reason: ${reason}.`);
            });

            const muteLog = message.guild.channels.cache.find((ch) => ch.name === 'mute-log');
            muteLog.send(`<@${message.author.id}> unmuted <@${member.user.id}>, reason: ${reason}.`);
        });
    }
}