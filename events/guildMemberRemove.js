const server_info = require('../db/loadServerInfo');
const Client = require('../index');

const userModel = require('../db/userSchema');

module.exports = {
    execute(member) {
        const guild = Client.guilds.cache.get(server_info[0].guild_id);
        const channel = guild.channels.cache.find((chn) => chn.id === server_info[0].gate_channel);

        userModel.findOne({ discord_id: member.user.id }, (err, res) => {
            if(err) return console.log(err);

            if(res) {
                const embed = {
                    color: 0xff0400,
                    title: 'Leave 😔',
                    description: `${member.user.tag} left the party!`,
                    thumbnail: {
                        url: member.user.displayAvatarURL()
                    },
        
                    fields: [
                        {
                            name: 'Joined On',
                            value: res.joined
                        }
                    ],

                    footer: {
                        name: 'Eastern Games BOT',
                        iconURL: "https://imgur.com/1nqnLxd.png"
                    }
                }
        
                channel.send({ embeds: [embed] });
            }
        });
    }
}