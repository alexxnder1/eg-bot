const Client = require('../index');

const { numberWithCommas }  = require('../utils');

const { YtDlpPlugin } = require("@distube/yt-dlp");
const { DisTube } = require('distube');
const distube = new DisTube(Client, { plugins: [new YtDlpPlugin({ update: false })] });

distube.on('addSong', (queue, song) => {
    const playEmbed = {
        color: 0x03ad00,
        title: `${song.name} **[${song.formattedDuration}]**`,
        description: `Queue Position **#${queue.songs.length}**`,
        thumbnail: {
            url: song.thumbnail,
        },

        fields: [
            {
                name: "👤 Uploader",
                value: `${song.uploader.name}`,
                inline: true,
            },
            
            {
                name: "👀 Views",
                value: `${numberWithCommas(song.views)}`,
                inline: true,
            },

            {
                name: "👍 Likes",
                value: `${numberWithCommas(song.likes)}`,
                inline: true,
            },
            
            {
                name: "👎 Dislikes",
                value: `${numberWithCommas(song.likes)}`,
                inline: true,
            }
        ],

        timestamp: new Date(),
        footer: {
            text: `requested by ${song.member.displayName}`,
            icon_url: song.member.displayAvatarURL()
        }
    };

    queue.textChannel.send({ embeds: [playEmbed]})
})

module.exports = {
    execute(message, splitted) {
        console.log(splitted);
        distube.play(message.member.voice.channel, splitted[1], { 
            message,
            textChannel: message.channel,
            member: message.member
        });

        setTimeout(() => {
            message.delete({ timeout: 1000 });
        }, 1500);
    }
}