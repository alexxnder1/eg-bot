const userModel = require('../db/userSchema');
const channels = require('../channels.json');
const Client = require('../index');

module.exports = {
    execute(member) {       
        const guild = Client.guilds.cache.get(channels.guild_id);

        guild.members.fetch(member.user.id).then((m) => {
            const name = (m.nickname) ? m.nickname : m.user.username;
            userModel.updateOne({ discord_id: m.user.id }, { $set: { username:name, tag: `${name}#${m.user.discriminator}` } }, (err) => {
                if(err) return console.log(err);
            });    
        });    
    }
}