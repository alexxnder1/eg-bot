const muteModel = require('../db/schemas/muteSchema');
const server_info = require('../db/loadServerInfo');

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmutes a member.')
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
    .addUserOption(option => option.setName('user').setDescription('User you muted.').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason you unmute him.').setRequired(true))

async function execute(int) {
    const mention = int.options.getUser('user');

    if(!mention)
        return int.reply("You must mention the user that you want to ban.");

    let reason = int.options.getString('reason');
    
    const mutedRole = int.guild.roles.cache.find((role) => role.name === 'Muted');

    if(reason.length < 3)
        return int.reply({ content: "`* " + '/' + "unmute <mention_user> <reason>`", ephemeral: true });

    int.guild.members.fetch(mention.id).then((member) => {
        if(!member)
            return int.reply("You must mention a user in order to mute him.");
              
        if(!member.roles.cache.some(role => role === mutedRole))
            return int.reply("This user is not muted.");

        muteModel.findOneAndUpdate({ mutedId: member.user.id }, { $set: { mutedStatus: false, unmutedBy: int.user.id, unmutedReason: reason } }, (err) => {
            if(err) return console.log(err);
        });

        member.roles.remove(mutedRole).then(() => {
            int.reply(`You unmuted <@${member.user.id}>, reason: ${reason}.`);
        });

        const muteLog = int.guild.channels.cache.find((ch) => ch.id === server_info[0].mute_log_channel);
        muteLog.send(`<@${int.user.id}> unmuted <@${member.user.id}>, reason: ${reason}.`);
    });
}

module.exports = { execute, data };