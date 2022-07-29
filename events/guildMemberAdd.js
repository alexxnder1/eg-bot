const userModel = require('../db/userSchema');
const Client = require('../index');

module.exports = {
    execute(member) {
        console.log(`[Join] ${member.user.tag} joined the party.`);
         // the-gate channel
        let channel = member.guild.channels.cache.get('980082274244632576');
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
        
        userModel.findOne({ discord_id: member.user.id }, (err, res) => {
            if(err)
                return console.log(err);

            if(!res) {
                userModel.create({
                    discord_id: member.user.id,
                    username: member.user.username,
                    tag: member.user.tag,
                    joined: new Date(member.user.createdTimestamp).toLocaleDateString('en-US'),
                    created: member.user.createdAt
                });
            }
        });
    }
}