const server_info = require('./src/db/loadServerInfo');

module.exports = {
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    returnLevelUpPoints(level) {
        return parseInt(level * 58222);
    },

    returnSkillUpPoints(skill) {
        return parseInt(skill * 60);
    },
    
    returnGraduateProgressColor(val) {
        let color = "#fffffff";
        
        switch(true) {
            case (val > 0 && val <= 25): {
                color = "#a3ff33"
                break;
            }
            case (val > 25 && val <= 50): {
                color = "#d4c600"
                break;
            }
            case (val > 50 && val <= 75): {
                color = "#db8802"
                break;
            }
            case (val > 75 && val <= 100): {
                color = "#d92518"
                break;
            }
        }

        return color;
    },

    setRoleForLevel(message, level) {
        const Client = require('./index');
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