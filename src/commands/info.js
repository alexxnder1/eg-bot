const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const server_info = require('../db/loadServerInfo');

const data = new SlashCommandBuilder() 
    .setName('info')
    .setDescription('Sends a specific message to a channel depending on option you select.')
    .addSubcommand(subcmd => subcmd.setName('ticket').setDescription('Sends the message with the button for opening tickets.'))
    .addSubcommand(subcmd => subcmd.setName('verify').setDescription('Sends the message with the button for verifying user.'))

async function execute(int) {
    if(!int.member.permissions.has(PermissionsBitField.Flags.Administrator))
        return int.reply({ content: "You can not use this command due to adminstrator level.", ephemeral: true});

    const Client = require('../../index');
    const guild = Client.guilds.cache.get(server_info[0].guild_id);

    switch(int.options.getSubcommand()) {
        case 'ticket': {
            var channel = int.guild.channels.cache.get('1001405952735576215');
    
            const embed = {
                color: 0xf55142,
                title: 'Tickets',
                description: 'You can open a ticket with your problem by pressing the below button.',
                footer: {
                    text: 'Eastern Games BOT',
                    iconURL: Client.user.displayAvatarURL(),
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
            await int.reply({ content: `You successfully sent a message on ${channel} for opening a ticket.`, ephemeral: true })
            break;
        }

        case 'verify': {
            const rule_channel = guild.channels.cache.find((chn) => chn.id === server_info[0].rules_channel);
    
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
            await int.reply({ content: `You successfully sent a message on ${rule_channel} for verifying user.`, ephemeral: true })
            break;
        }
    }
}

module.exports = { execute, data };