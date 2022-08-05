const userModel = require('../db/userSchema');
const Client = require('../index');
const server_info = require('../db/loadServerInfo');
const sis_model = require('../db/serverInfoSchema');

module.exports = {
    execute(member) {
        member.roles.add(server_info[0].not_verified_role_id);

        console.log(`[Join] ${member.user.tag} joined the party.`);

        const guild = Client.guilds.cache.get(server_info[0].guild_id);
        let channel = guild.channels.cache.get(server_info[0].gate_channel);
        member.send(`Hi there! 👋 Welcome to Eastern Games server. Please read our <#${server_info[0].rules_channel}> and then verify your account on the same channel.`);

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
                    value: '`' + new Date(member.user.createdTimestamp).toUTCString() + '`',
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
                    joined: new Date().toUTCString(),
                    created: new Date(member.user.createdTimestamp).toUTCString()
                });
            }
            
            const levelRole = guild.roles.cache.find(role => role.name === `Level ${(res) ? res.level : 1}`);
            member.roles.add(levelRole);
        });
    }
}