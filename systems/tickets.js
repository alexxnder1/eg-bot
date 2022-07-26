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
                        ticketModel.create({
                            opener_id: int.user.id,
                            channel_id: channel.id,
                            date: new Date().toUTCString()
                        });
            
                        console.log(`[Tickets] ${int.user.tag} made a ticket.`);
                    });
                }
                
            });
        }
    }
}