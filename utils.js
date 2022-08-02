const Client = require('./index');
const channels = require('./channels.json');

module.exports = {
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    returnLevelUpPoints(level) {
        return parseInt(level * 182 * (Math.floor(Math.random() * 666)));
    },

    setRoleForLevel(message, level) {
        const guild = Client.guilds.cache.get(channels.guild_id);

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