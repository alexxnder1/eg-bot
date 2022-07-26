const { Client } = require('discord.js');
const ticketModel = require('../db/ticketSchema');

module.exports = {
    execute(message, arg, reason) {
        if(!message.member.roles.cache.some(role => role.name === 'Helper'))
         return message.reply("You don't have the necessary administrator level to use this command.");

         var channel = message.guild.channels.cache.find(channel => channel.id === message.channel.id);
         var ticketsChannel = message.guild.channels.cache.find(channel => channel.name === 'tickets-log');
         if(channel.locked)
             return message.reply("This ticket is already closed.");
 
         if(reason[1] == undefined || reason[1].length < 3)
            return message.reply("Please provide a good reason.");

         // TODO: query the db and search if this channel is there
         ticketModel.findOneAndUpdate({ channel_id: message.channel.id }, { $set: { solvedBy: message.author.id, reason: reason[1], active: false, solvedDate: new Date().toUTCString() } }, (err, res) => {
            if(err)
                return console.log(err);

            if(!res)
                return message.reply("You are not in a thread that is actually opened for a ticket.");

            let user = message.guild.members.cache.find((member) => member.id == res.opener_id);
            let chn = message.guild.channels.cache.find((channel) => channel.id == res.channel_id);
            
            const embed = {
                color: 0xfcba03,
                title: `❌ Ticket Closed`,
                author: {
                    name: 'Eastern Games BOT',
                    iconURL: "https://imgur.com/1nqnLxd.png"
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

                    //  new line
                    {
                        name: '\u200b',
                        value: '\u200b',
                        inline: true
                    },

                    {
                        
                        name: 'Closed By',
                        value: '`' + message.author.tag + '`',
                        inline: true
                    },
                    
                    {
                        
                        name: 'Close Reason',
                        value: '`' + reason[1] + '`',
                        inline: true
                    },

                    
                    {
                        
                        name: 'Closed Date',
                        value: '`' + new Date().toUTCString() + '`',
                        inline: true
                    },
                ]
            }
            
            ticketsChannel.send({ embeds: [embed]} );
            user.send({ embeds: [embed]} );          
              
            console.log(`This ticket opened by <@${res.opener_id}> at ${res.date} was closed by <@${message.author.id}>, reason: **${reason[1]}**.`);
            
            chn.delete();
        });
    }
}