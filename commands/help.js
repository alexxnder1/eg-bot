const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const server_info = require('../db/serverInfoSchema');

module.exports = {
    execute(message) {

        server_info.create({
            gate_channel: "980082274244632576",
            ticket_channel: "1001405952735576215",
            suggest_channel: "1002859133332111370",
            rules_channel: "953355987551662110",
        
            guild_id: "881118014366445578",
            bot_id: "1000077848536678440",
            dev_id: "285032425187180546",
            not_verified_role_id: "1002820437081849896",
        
            ticket_log_channel:  "1001495022035796089",
            ban_log_channel: "1001845330406551662",
            kick_log_channel: "1001840771118411866",
            mute_log_channel: "1001814428058124299"
        });

        const field = [
            {
                name: "Normal Commands",
                value: "`Economy: \n* stats - shows your account statistics (money, exp, etc) \n* rank - reveals your rank \n* top - shows you the server classification of members in the server sorted by level, money, exp & shards \n\nUseful: \n* suggest <description of the suggest> (only in the suggest channel) \n\nGames: \n* tic-tac-toe <mention> <$bet> \n* coinflip <mention [eg-bot/user]> <$bet> \n\nMusic:\n * play <track>` \n`* pause` \n`* resume` \n`* skip` \n`* remove <track_id>` \n`* loop <disabled/song/queue>` \n`* clear (clears the queue)` \n`* queue`\n\n",
            }
        ];

        // founders
        if(message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            field.push(
                {
                    name: "Debug Commands [administrators]",
                    value: "`* debug <users> - query through all members on the server and insert them again in the db.`\n`* info <ticket/verify> (sends a message with a button for open ticket/verify user)`\n`* clear <message_count> - clears an amount of messages in the channel you write.`",
                },
            );
        }

        // helper
        if(message.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
            field.push(
                {
                    name: "Helpers Commands",
                    value: "`* mute <mention_user> <time [min]> <reason>\n* unmute <mention_user> <reason>`",
                }
            );
        }

        // admin
        if(message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            field.push(
                {
                    name: "Admin Commands",
                    value: "`* tclose <Reason> - close a ticket (working only in particular ticket channel)\n* ban <mention_user> <time (0=permanent)[days]> <reason>\n* unban <username>\n* kick <mention_user> <reason>`",
                }
            );
        }

        const helpEmbed = {
            color: 0x9234eb,
        	author: {
                name: "Eastern Games Bot | Help Menu",
                icon_url: message.member.displayAvatarURL()
            },

            thumbnail:{
                url: "https://imgur.com/1nqnLxd.png",
            },

            fields: field,

            timestamp: new Date(),
            footer: {
                text: `requested by ${message.author.tag}`
            }
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('help-economy')
                    .setStyle(ButtonStyle.Success)
                    .setLabel('Info: Money, Shards & EXP')
            );

        message.channel.send({ embeds: [helpEmbed], components: [row]});
    }
}