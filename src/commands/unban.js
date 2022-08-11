const { PermissionFlagsBits } = require('discord.js');
const banModel = require('../db/schemas/banSchema');
const server_info = require('../db/loadServerInfo');

const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unbans a member.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.BanMembers)
    .addStringOption(option => option.setName('name').setDescription('Name of the user you banned.').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason you unban him.').setRequired(true))

async function execute(int) {
    if(!int.member.permissions.has(PermissionFlagsBits.BanMembers))
        return int.reply({ content: "You don't have the necessary administrator level to use this command.", ephemeral: true});
    
    const Client = require('../../index');
    const guild = Client.guilds.cache.get('881118014366445578');

    const name = int.options.getString('name');
    const reason = int.options.getString('reason');
    
    if(reason.length < 3)
        return int.reply({ content: 'Please provide a long and good reason.', ephemeral: true});

    banModel.findOne({ name: name }, (err, res) => {
        if(err)
            return console.log(err);
        
        if(!res)
            return int.reply({ content: "* I didn't found any user banned with this name.", ephemeral: true });

        int.reply(`You successfully unbanned ${name}.`);
            
        const banLogChannel = guild.channels.cache.find((chn) => chn.id === server_info[0].ban_log_channel);

        // unban
        banLogChannel.send(`${name} was unbanned by ${int.user.tag}, reason: ${reason}. `);    
        banModel.deleteOne({ name: name }).then((err) => { if(err) return console.log(err) });
    });
}

module.exports = { execute, data };