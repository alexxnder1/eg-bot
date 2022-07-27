const userModel = require('../db/userSchema');

module.exports = {
    execute(member) {
        console.log(`[Join] ${member.tag} joined the party.`);

        userModel.findOne({ discord_id: member.id }, (err, res) => {
            if(err)
                return console.log(err);

            if(res == null) {
                userModel.create({
                    discord_id: member.id,
                    username: member.username,
                    tag: member.tag,
                    joined: new Date(member.createdTimestamp).toLocaleDateString('en-US'),
                    created: member.createdAt
                })
            }
        });

        // the-gate channel
        let channel = member.guild.channels.cache.get('1001042385721114695');
        const guild = Client.guilds.cache.get('881118014366445578');

        const welcomeEmbed = {
            color: member.user.accentColor,
            title: `Welcome 👋`,
            description: `**${member.user.tag}** joined the party! 🎉`,
            thumbnail: {
                url: member.user.displayAvatarURL()
            },

            fields: [
                {
                    name: 'Member ID',
                    value: "`#" + guild.memberCount + '`',
                },

                {
                    name: 'Account Created On',
                    value: '`' + new Date(member.user.createdTimestamp).toLocaleDateString('en-US') + '`',
                }
            ],
            
            timestamp: new Date(),
            footer: {
                text: 'Eastern Games BOT',
                icon_url: "https://imgur.com/1nqnLxd.png",
            }
        }

        channel.send({ embeds: [welcomeEmbed] });
    }
}