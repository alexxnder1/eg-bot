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
                    value: "`Music:\n * play <track>` \n`* pause` \n`* resume` \n`* skip` \n`* remove <track_id>` \n`* loop <disabled/song/queue>` \n`* clear (clears the queue)` \n`* queue`\n\n`Others: \n* suggest <description of the suggest> (only in the suggest channel)\n* stats \n* rank \n * top`",
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