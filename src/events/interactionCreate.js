const Client = require('../../index');
const server_info = require('../db/loadServerInfo');

module.exports = {
    execute(int) {       
        if(int.isChatInputCommand()) {
            const fileCmd = require(`../commands/${int.commandName.toLowerCase()}.js`);
            fileCmd.execute(int);     
            return true;
        }

        // ticket system
        require('./interactions/tickets').execute(int);
    
        const guild = Client.guilds.cache.get(server_info[0].guild_id);
        const memberRole = guild.roles.cache.find((role) => role.name === 'Novice');
    
        if(int.channel.id === server_info[0].rules_channel) {
            const notVerified = guild.roles.cache.find(role => role.id === server_info[0].not_verified_role_id);

            int.member.roles.add(memberRole);
            int.member.roles.remove(notVerified);
        }

        if(int.customId === 'coinflip-accept')
            require('./interactions/coinflip').accept(int.member.id, int.message.channelId, int.message.id);
            
        require('./interactions/coinflip').decline(int);
        require('./interactions/coinflip').cancel(int);
        require('./interactions/tic-tac-toe').execute(int);
        require('./interactions/store').execute(int);
        require('./interactions/inventory').execute(int);
        require('./interactions/suggest').modal(int);
    
        if(int.customId === 'help-economy') {
            require('./interactions/economy').execute(int, guild);
        }
    }
}