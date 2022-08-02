const Client = require('../index');
const channels = require('../channels.json');

require('dotenv').config();
       
module.exports = {
    execute(int) {       
        if(!int.isButton()) return false;
        int.deferUpdate();

        // ticket system
        require('./interactions/tickets').execute(int);
    
        const guild = Client.guilds.cache.get(channels.guild_id);
        const memberRole = guild.roles.cache.find((role) => role.name === 'Member');
    
        if(int.message.channel.id === channels.rules_channel) {
            const notVerified = guild.roles.cache.find(role => role.id === channels.not_verified_role_id);
            
            int.member.roles.add(memberRole);
            int.member.roles.remove(notVerified);
        }

        if(int.customid === 'coinflip-accept')
            require('./interactions/coinflip').accept(int.member.id, int.message.channelId, int.message.id);
            
        require('./interactions/coinflip').decline(int);
        require('./interactions/coinflip').cancel(int);
        require('./interactions/suggest').interaction(int);
    
        if(int.customId === 'help-economy') {
            require('./interactions/economy').execute(int, guild);
        }
    }
}