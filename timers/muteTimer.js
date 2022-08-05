const ticketModel = require('../db/muteSchema');
const Client = require('../index');
const server_info = require('../db/loadServerInfo');

module.exports = {
    execute() {
        // 5 sec
        setInterval(() => {
            ticketModel.findOne({ mutedStatus: true }, (err, res) => {
                if(err) return console.log(err);
                if(!res) return false;

                if(new Date().getTime() >= res.mutedTime)
                {
                    const guild = Client.guilds.cache.get('881118014366445578');

                    const muteLog = guild.channels.cache.find((ch) => ch.id === server_info[0].mute_log_channel);
    
                    guild.members.fetch().then((members) => {
                        members.forEach((member) => {
                            if(member.user.id == res.mutedId) {
                                const mutedRole = guild.roles.cache.find((role) => role.name === 'Muted');
                                            
                                member.roles.remove(mutedRole).then(() => {
                                    console.log(`I unmuted <@${member.user.id}>, reason: time expired.`);
                                });

                                ticketModel.findOneAndUpdate({ mutedId: res.mutedId, mutedStatus: true }, { $set: { unmutedReason: 'time expired', mutedStatus: false, unmutedBy: Client.user.id } }).then((err, res) => {
                                    if(err) return console.log(err);
                                });

                                muteLog.send(`I unmuted <@${member.user.id}>, reason: time expired.`);
                            }
                        });
                    });
                }
            });
        }, 10000);   
    }
}