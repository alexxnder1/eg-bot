const banModel = require('../db/schemas/banSchema');
const Client = require('../../index');
const server_info = require('../db/loadServerInfo');

module.exports = {
    execute() {
        setInterval(() => {
            banModel.findOne({ permanent: false }, (err, res) => {
                if(err)
                    return console.log(err);
                
                if(!res)
                    return false;

                if(res.duration <= new Date().getTime())
                {
                    const guild = Client.guilds.cache.get('881118014366445578');
                    const banLogChannel = guild.channels.cache.find((chn) => chn.id === server_info[0].ban_log_channel);
    
                    // unban
                    guild.members.unban(res.discord_id, 'time expired');
                    banLogChannel.send(`${res.name} was unbanned due to time expired. `);    
                    banModel.deleteOne({ discord_id: res.id }).then((err) => { if(err) return console.log(err) });
                }

            });
        }, 300000);
    }
}