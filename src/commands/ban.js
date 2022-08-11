const { SlashCommandBuilder, PermissionFlagsBits, } = require('discord.js');
const banModel = require('../db/schemas/banSchema');
const server_info = require('../db/loadServerInfo');

const data = new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a member that pissed off you')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.BanMembers)
    .addUserOption(option => option.setName('user').setDescription('User you want to ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason you want to ban the user').setRequired(true))
    .addNumberOption(option => option.setName('time').setDescription('Days you want to ban user [0=permanent]').setRequired(true))

async function execute(int) {
    const mention = int.options.getUser('user');
    if(!mention)
        return int.reply("You must mention the user that you want to ban.");
    
    const reason = int.options.getString('reason');
    const time = int.options.getNumber('time');

    if(!reason || reason.length < 3 || time < 0)
        return int.reply("* ban <mention_user> <time (0=permanent) [days]> <reason>");

    const banLogChannel = int.guild.channels.cache.find((chn) => chn === server_info[0].ban_log_channel);
    int.guild.members.fetch(mention).then((member) => {
        member.ban().catch((err) => {
            if(err) return int.reply('An error occurred.');
            
            banLogChannel.send(`${member.user.tag} have been banned ${(time > 0) ? ('for ' + time + ' days') : ('permanent')} from our server by ${int.user.tag}, reason: ${reason}.`);
        
            // time * 86 400 000 = time from days to ms for timestamp
            banModel.create({
                discord_id: member.user.id,
                name: member.user.tag,
                reason: reason,
                bannedBy: int.user.tag,
                duration: (time > 0) ? new Date().getTime() + (time * 86400000) : ('permanent'),
                permanent: (time > 0) ? false : true,
                bannedById: int.user.id
            });

            console.log(`${member.user.tag} have been banned ${(time > 0) ? ('for ' + time + ' days') : ('permanent')} from our server by ${int.user.tag}, reason: ${reason}.`);
            member.user.send(`You have been banned ${(time > 0) ? ('for ' + time + ' days') : ('permanent')} from our server by ${int.user.tag}, reason: ${reason}.`);    
        });    
    }); 
}
module.exports = { execute, data };