const Client = require('../index');
const channels = require('../channels.json');

module.exports = {
    execute(int) {
        if(!int.isButton()) return false;
        int.deferUpdate();

        // ticket system
        require('../systems/tickets').execute(int);

        const guild = Client.guilds.cache.get(channels.guild_id);
        const memberRole = guild.roles.cache.find((role) => role.name === 'Member');
        
        if(int.customId == 'react-member') {
            int.member.roles.add(memberRole);
        }
    }
}