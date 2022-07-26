const userModel = require('../db/userSchema');
const Client  = require('../index');

module.exports = {
    execute(message) {
        const guild = Client.guilds.cache.get('881118014366445578');
        guild.members.fetch().then((members) => {

            members.forEach(member => {

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
    }
}