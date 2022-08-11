const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js")

const data = new SlashCommandBuilder()
    .setName('clear')
    .setDescription("Clears channel's messages")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addNumberOption(option => option.setName('count').setDescription('Amount of messages you want to delete').setRequired(true))

async function execute(int) {
    let count = int.options.getNumber('count');
    if(!count || count < 1 || count > 100)
        return int.reply('/clear <messages>');
    
    int.channel.bulkDelete(count).then(() => {
        int.channel.send(`Deleted ${count} messages.`).then((msg) => {
            setTimeout(() => {
                msg.delete({ timeout: 1000 });
            }, 2500);
        });
    });
}

module.exports = { execute, data };