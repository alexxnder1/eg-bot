const { PermissionFlagsBits } = require('discord.js');
const banModel = require('../db/banSchema');
const Client = require('../index');

module.exports = {
    execute(message, arg, splitted) {
        if(!message.member.permissions.has(PermissionFlagsBits.BanMembers))
            return message.reply("You don't have the necessary administrator level to use this command.");
        
        const guild = Client.guilds.cache.get('881118014366445578');

        const name = splitted[1];
        const reason = splitted[2];
       
        if(!reason || reason.length < 3)
            return message.reply('` unban <mention_user> <reason>');

        banModel.findOne({ name: name }, (err, res) => {
            if(err)
                return console.log(err);
            
            if(!res)
                return message.reply("* I didn't found any user banned with this name.");

            message.channel.send(`You successfully unbanned ${name}.`);
                
            const banLogChannel = guild.channels.cache.find((chn) => chn.name === 'ban-log');

            // unban
            banLogChannel.send(`${name} was unbanned by ${message.author.tag}, reason: ${reason}. `);    
            banModel.deleteOne({ name: name }).then((err) => { if(err) return console.log(err) });
        });
    }
}