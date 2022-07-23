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
                    value: "`play`",
                },

                {
                    name: "Admin Commands",
                    value: "- coming soon -",
                },
                
                {
                    name: "Helpers Commands",
                    value: "- coming soon -",
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