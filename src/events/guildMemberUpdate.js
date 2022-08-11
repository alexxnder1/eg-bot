const userModel = require('../db/schemas/userSchema');
const server_info = require('../db/loadServerInfo');
const Client = require('../../index');

module.exports = {
    execute(member) {       
        const guild = Client.guilds.cache.get(server_info[0].guild_id);

        guild.members.fetch(member.user.id).then((m) => {
            const name = (m.nickname) ? m.nickname : m.user.username;
            userModel.updateOne({ discord_id: m.user.id }, { $set: { username:name, tag: `${name}#${m.user.discriminator}` } }, (err) => {
                if(err) return console.log(err);
            });    
        });    
    }
}