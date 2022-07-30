const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionOverwriteManager, PermissionsBitField } = require('discord.js');
const channels = require('../channels.json');
const Client = require('../index');

require('dotenv').config()

module.exports = {
    execute(message, arg, splitted) {
        if(!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return message.reply("You can not use this command due to adminstrator level.");

        const option = arg[1].split('info')[1].split(' ')[1];
        const guild = Client.guilds.cache.get(channels.guild_id);

        switch(option) {
            case 'ticket': {
                var channel = message.guild.channels.cache.get('1001405952735576215');
        
                const embed = {
                    color: 0xf55142,
                    title: 'Tickets',
                    description: 'You can open a ticket with your problem by pressing the below button.',
                    footer: {
                        text: 'Eastern Games BOT',
                        iconURL: "https://imgur.com/1nqnLxd.png",
                    }
                }
        
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('ticket-button-id')
                        .setLabel('📧 Open a Ticket')
                        .setStyle(ButtonStyle.Primary)        
            
                    );
                    
                channel.send({ embeds: [embed], components: [row] });
                break;
            }

            case 'verify': {
                const rule_channel = guild.channels.cache.find((chn) => chn.id === channels.rules_channel);
        
                const embed = {
                    color: 0x43b000,
                    title: '☑️ Verify your account',
                    description: 'Click the button below this message to get your Member role.'
                }
        
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('react-member')
                            .setLabel('Verify')
                            .setStyle(ButtonStyle.Success)
                            .setDisabled(false)
                    )
                
        
                rule_channel.send({ embeds: [embed], components: [row] });
                break;
            }
        }
    }
}