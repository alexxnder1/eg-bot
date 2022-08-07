const muteModel = require('../db/muteSchema');
const server_info = require('../db/loadServerInfo');

async function execute(message, arg, splitted) {
    const mention = message.mentions.members.first();

    if(!mention)
        return message.reply("You must mention the user that you want to ban.");
        
    if(!mention.author.permissions.has(PermissionsBitField.Flags.MuteMembers))
        return message.reply("You don't have the necessary administrator level to use this command.");

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

        const muteLog = message.guild.server_info[0].cache.find((ch) => ch.id === server_info[0].mute_log_channel);
        muteLog.send(`<@${message.author.id}> unmuted <@${member.user.id}>, reason: ${reason}.`);
    });
}

module.exports = { execute };