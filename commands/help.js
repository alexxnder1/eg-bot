module.exports = {
    execute(message) {
        const helpEmbed = {
            color: 0x9234eb,
        	author: {
                name: "Eastern Games Bot | Help Menu",
                icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`,
            },

            thumbnail:{
                url: "https://imgur.com/1nqnLxd.png",
            },

            fields: [
                {
                    name: "Normal Commands",
                    value: "`* play <track>` `* pause` `* resume` `* skip` `* remove <track_id>` `* loop <disabled/song/queue>` `* clear (clears the queue)` `* queue`\n`* suggest <description of the suggest> (only in the suggest channel)\n* stats`",
                },

                {
                    name: "Debug Commands [founders]",
                    value: "`* debugUsers - query through all members on the server and insert them again in the db.`\n`* tms - sends a message with a button for open ticket`\n`* grm (sends on rules channel a message for verifying user)`",
                },

                {
                    name: "Admin Commands",
                    value: "`* tclose <Reason> - close a ticket (working only in particular ticket channel)\n* ban <mention_user> <time (0=permanent)[days]> <reason>\n* unban <username>`",
                },
                
                {
                    name: "Helpers Commands",
                    value: "`* mute <mention_user> <time [min]> <reason>\n* unmute <mention_user> <reason>`",
                }
            ],

            timestamp: new Date(),
            footer: {
                text: `requested by ${message.author.tag}`
            }
        }
        message.channel.send({ embeds: [helpEmbed]});
    }
}