const ticketModel = require('../db/schemas/ticketSchema');
const server_info = require('../db/loadServerInfo');

const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Close a ticket')
    .addSubcommand(subcmd => subcmd.setName('close').setDescription('Close a ticket'))

async function execute(int) {

    if(!int.member.roles.cache.some(role => role.name === 'Helper'))
     return int.reply("You don't have the necessary administrator level to use this command.");

     var channel = int.guild.channels.cache.find(channel => channel.id === int.channel.id);
     var ticketsChannel = int.guild.channels.cache.find(channel => channel.id === server_info[0].ticket_log_channel);
     const Client = require('../../index');

     if(channel.locked)
         return int.reply({ content: "This ticket is already closed.", ephemeral: true});
    
     let _reason = arg[1].split('tclose')[1];

     if(_reason == undefined || _reason.length < 3)
        return int.reply({ content: "Please provide a good reason.", ephemeral: true});

     ticketModel.findOneAndUpdate({ channel_id: int.channel.id }, { $set: { solvedBy: int.user.id, reason: reason[1], active: false, solvedDate: new Date().toUTCString() } }, (err, res) => {
        if(err)
            return console.log(err);

        if(!res)
            return int.reply({ content: "You are not in a channel that is actually opened for a ticket.", ephemeral: true });

        let user = int.guild.members.cache.find((member) => member.id == res.opener_id);
        let chn = int.guild.channels.cache.find((channel) => channel.id == res.channel_id);
        
        const embed = {
            color: 0xfcba03,
            title: `❌ Ticket Closed`,
            author: {
                name: 'Eastern Games BOT',
                iconURL: Client.user.displayAvatarURL()
            },

            fields: [
                {
                    name: 'Opened By',
                    value: '`' + user.user.tag + '`',
                    inline: true
                },

                {
                    name: 'Opened Date',
                    value: '`' + res.date + '`',
                    inline: true
                },

                {
                    name: 'Messages Count',
                    value: '`' + res.transcript.length + '`',
                    inline: true
                },

                //  new line
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: true
                },

                {
                    
                    name: 'Closed By',
                    value: '`' + int.user.tag + '`',
                    inline: true
                },
                
                {
                    
                    name: 'Close Reason',
                    value: '`' + _reason + '`',
                    inline: true
                },

                
                {
                    
                    name: 'Closed Date',
                    value: '`' + new Date().toUTCString() + '`',
                    inline: true
                },
            ]
        }
        
        ticketsChannel.send({ embeds: [embed] });
        ticketsChannel.send('```' + `${res.transcript.toString()}` + '```');

        console.log(`This ticket opened by <@${res.opener_id}> at ${res.date} was closed by <@${int.user.id}>, reason: **${reason[1]}**.`);
        
        chn.delete();
    });
}

module.exports = { execute, data };