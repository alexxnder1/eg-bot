const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const kickModel = require('../db/schemas/kickSchema');
const server_info = require('../db/loadServerInfo');

const data = new SlashCommandBuilder() 
    .setName('kick')
    .setDescription('Kicks a member.')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option => option.setName('user').setDescription('User you want to kick').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason you want to kick').setRequired(true))

async function execute(int) {
    const mention = int.options.getUser('user');

    if(!mention)
        return int.reply("You must mention the user that you want to ban.");
    
    const reason = int.options.getString('reason');

    if(!reason || reason.length < 3)
        return int.reply({ content: "* kick <mention_user> <reason>", ephemeral: true });
        
    const kickLogChannel = int.guild.channels.cache.find((chn) => chn.id === server_info[0].kick_log_channel);
    if(!mention)
        return int.reply({ content: "You must mention the user that you want to kick.", ephemeral: true});

    int.guild.members.fetch(mention).then(async member => {
        member.kick().then(() => {
            kickLogChannel.send(`${member.user.tag} have been kicked from our server by ${int.user.tag}, reason: ${reason}.`);
        
            kickModel.create({
                id: member.user.id,
                name: member.user.tag,
                reason: reason,
                kickedBy: int.user.tag,
                kickedById: int.user.id
            });

            console.log(`${member.user.tag} have been kicked from our server by ${int.user.tag}, reason: ${reason}.`);
            int.reply(`☑️ You successfully kicked ${member.user.tag}.`);
        }).catch(() => {
            int.reply('An error occurred.');
        });
    });
}

module.exports = { execute, data };