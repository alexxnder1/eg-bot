const Client = require('./index');
const server_info = require('./db/loadServerInfo');

module.exports = {
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    returnLevelUpPoints(level, exp) {
        return parseInt(level * (240 + exp));
    },

    setRoleForLevel(message, level) {
        const guild = Client.guilds.cache.get(server_info[0].guild_id);

        for(var i = 1; i<=100; i++) {
            if(message.member.roles.cache.some(role => role.name === `Level ${i}`) && i !== level) {
                console.log(i);
                const role = guild.roles.cache.find((role) => role.name === `Level ${i}`);
                message.member.roles.remove(role);
            }
        }

        const newRole = guild.roles.cache.find(role => role.name === `Level ${level}`);
        message.member.roles.add(newRole);
    }
}