const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Send a suggest.')

async function execute(int) {       
    const modal = new ModalBuilder()
        .setCustomId('suggest-modal')
        .setTitle('Suggest')
        .addComponents(
            new ActionRowBuilder()
             .addComponents(
                new TextInputBuilder()
                .setCustomId('suggest-text')
                .setLabel("Please type your suggestion.")
                .setStyle(TextInputStyle.Paragraph)
            )
        )


    await int.showModal(modal);
};
module.exports = { execute, data };