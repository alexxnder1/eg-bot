const channels = require('../channels.json');
const Client = require('../index');

const userModel = require('../db/userSchema');

module.exports = {
    execute(member) {
        const guild = Client.guilds.cache.get('881118014366445578');
        const channel = guild.channels.cache.find((chn) => chn.id === channels.gate_channel);
        
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