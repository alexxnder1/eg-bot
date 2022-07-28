const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const channels = require('../channels.json');
const Client = require('../index');

module.exports = {
    execute(message) {
        if(!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return message.reply('You can not do this because you are not an administrator.');

        const guild = Client.guilds.cache.get(channels.guild_id);
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
                    .setStyle(ButtonStyle.Primary)
            )
        

        rule_channel.send({ embeds: [embed], components: [row] });
    }
}