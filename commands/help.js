const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    execute(message) {
        const field = [
            {
                name: "Normal Commands",
                value: "`Economy: \n* stats - shows your account statistics (money, exp, etc) \n* rank - reveals your rank \n* top - shows you the server classification of members in the server sorted by level, money, exp & shards \n\nUseful: \n* suggest <description of the suggest> (only in the suggest channel) \n\nGambling: \n* coinflip <mention_user> <$bet> \n* coinflip accept \n* coinflip cancel \n\nMusic:\n * play <track>` \n`* pause` \n`* resume` \n`* skip` \n`* remove <track_id>` \n`* loop <disabled/song/queue>` \n`* clear (clears the queue)` \n`* queue`\n\n",
            }
        ];

        // founders
        if(message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            field.push(
                {
                    name: "Debug Commands [administrators]",
                    value: "`* debugUsers - query through all members on the server and insert them again in the db.`\n`* tms - sends a message with a button for open ticket`\n`* grm (sends on rules channel a message for verifying user)`",
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
                icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`,
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