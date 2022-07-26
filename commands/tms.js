// ticket message sender.
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    execute(message) {
        if(!message.member.roles.cache.some(role => role.name === 'Admin'))
            return message.reply("You don't have the necessary administrator level to use this command.");

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
    }
}