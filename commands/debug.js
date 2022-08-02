const { PermissionFlagsBits } = require('discord.js');
const userModel = require('../db/userSchema');
const Client  = require('../index');

const cryptoModel = require('../db/cryptoSchema');

require('dotenv').config()

module.exports = {
    execute(message, arg, splitted) {
        if(!message.member.permissions.has(PermissionFlagsBits.Administrator))
            return message.reply("You don't have access to this command due your administration evel.");

        let option = splitted[1];

        if(!option) 
            return message.reply('`' + `${process.env.PREFIX} debug <crypto/users> <...>` + '`');

        switch(option) {
            case 'users': {
                const guild = Client.guilds.cache.get('881118014366445578');
                guild.members.fetch().then((members) => {
        
                    members.forEach(member => {
                        if(member.user.bot)
                            return false;
                        
                        userModel.create({
                            discord_id: member.user.id,
                            username: member.user.username,
                            tag: member.user.tag,
                            joined: new Date(member.user.createdTimestamp).toLocaleDateString('en-US'),
                            created: member.user.createdAt,
                            messagesWritten: 0,
                            level: 1
                        });
        
                       message.channel.send(`[DB] ${ member.user.username} ${member.user.tag} ${new Date(member.user.createdTimestamp).toLocaleDateString('en-US')} ${member.user.createdAt} ADDED INTO USERS TABLE.`);
                    });
        
                    message.channel.send(`[MONGODB DEBUG] ✔️ insert operating succesfully succeed.`);
        
                })
                break;
            }
        }
    }
}