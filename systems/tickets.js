const Client = require('../index');
const ticketModel = require('../db/ticketSchema');
const { ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
    execute(int) {
        if(!int.isButton()) return false;
        int.deferUpdate();
             
        // user pressed the 'open ticket' button.
        if(int.customId === 'ticket-button-id') {
            const guild = Client.guilds.cache.get('881118014366445578');

            ticketModel.findOne({ opener_id: int.member.user.id, active: true }, (err, res) => {
                if(err)
                    return console.log(err);

                if(!res) {
                    guild.channels.create({
                        name: `ticket-${int.user.id}`,
                        type: ChannelType.GuildText,
                        parent: '1000456178763038780',
                        permissionOverwrites: [
                            {
                                id: int.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            }
                        ]
                    }).then(() => {
        
                        let channel = guild.channels.cache.find((chn) => chn.name === `ticket-${int.user.id}`);
                        channel.setTopic(`ticket created by ${int.user.tag}`);

                        let ticketsChannel = guild.channels.cache.find(chn => chn.name === 'tickets-log');

                        ticketModel.create({
                            opener_id: int.user.id,
                            channel_id: channel.id,
                            date: new Date().toUTCString()
                        });
            
                        console.log(`[Tickets] ${int.user.tag} made a ticket.`);

                        const embed = {
                            color: 0xfcba03,
                            title: `✔️ Ticket Opened`,
                            author: {
                                name: 'Eastern Games BOT',
                                iconURL: "https://imgur.com/1nqnLxd.png"
                            },
            
                            fields: [
                                {
                                    name: 'Opened By',
                                    value: '`' + int.user.tag + '`',
                                    inline: true
                                },
            
                                {
                                    name: 'Opened Date',
                                    value: '`' + new Date().toUTCString() + '`',
                                    inline: true
                                }
                            ]
                        }
                        
                        ticketsChannel.send({ embeds: [embed]} );
                    });
                }
                
            });
        }
    },

    transcript(message) {
        ticketModel.updateOne({ channel_id: message.channel.id, active: true }, { $push: { transcript: `\n ${message.author.tag} [${new Date().toUTCString()}]: ${message.content}` } }, (err, res) => {
            if(err) return console.log(err);
        });
    }
}