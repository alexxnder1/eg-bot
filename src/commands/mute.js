const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const muteModel = require('../db/schemas/muteSchema');
const server_info = require('../db/loadServerInfo');

const data = new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mutes a specific user.')
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
    .addUserOption(option => option.setName('target').setDescription('The user you want to mute').setRequired(true))
    .addNumberOption(option => option.setName('time').setDescription('The time for user to be muted (in seconds)').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for the mute').setRequired(true))

var muteUser = (message, muted_id, reason, time, by, status) => {
    const Client = require('../../index');
    const guild = Client.guilds.cache.get(server_info[0].guild_id);
    const mutedRole = guild.roles.cache.find((role) => role.name === 'Muted');
    let timeFormated = Math.round((time - new Date().getTime()) / 1000);

    muteModel.create({
        mutedId: muted_id,
        muteReason: reason,
        mutedTime: time,
        mutedBy: by,
        mutedStatus: status,
        mutedDate: new Date().toUTCString()
    }); 

    guild.members.fetch().then(members => {
        members.forEach((member) => {
            if(member.id === muted_id) {
                member.roles.add(mutedRole).then(() => {
                    message.reply(`<@${by}> muted <@${member.user.id}> for ${timeFormated} minutes, reason: ${reason}.`);
                });
            }
        })
    })
    
    const muteLog = guild.channels.cache.find((ch) => ch.id === server_info[0].mute_log_channel);
    muteLog.send(`<@${by}> muted <@${muted_id}> for ${timeFormated} minutes, reason: ${reason}.`);
}

async function execute(int) {
    const mention = int.options.getUser('target');
    if(!mention)
        return int.reply("You must mention the user that you want to mute.");

    let time = int.options.getNumber('time');
    let reason = int.options.getString('reason');

    int.guild.members.fetch(mention.id).then((member) => {
        if(!member)
            return int.reply("You must mention a user in order to mute him.");
    
        if(member.roles.cache.some(role => role.name === "Muted"))
            return int.reply("This user is already muted.");

        muteUser(int, member.user.id, reason, new Date().getTime() + (time * 1000), int.user.id, true, new Date().toUTCString());
    });
}

module.exports = { execute, data, muteUser };