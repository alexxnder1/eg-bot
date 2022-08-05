const { PermissionFlagsBits } = require("discord.js")

require('dotenv').config()

module.exports = {
    execute(message, arg, splitted) {
        if(!message.member.permissions.has(PermissionFlagsBits.Administrator)) 
            return false;
        
        let count = splitted[1];
        if(!count || count < 1 || count > 50)
            return message.reply('`' + `${process.env.PREFIX} clear <messages>` + '`');
        
        message.channel.bulkDelete(count).then(() => {
            message.channel.send(`Deleted ${count} messages.`);
        });
    }
}