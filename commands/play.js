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
                value: `${numberWithCommas(song.dislikes)}`,
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

async function execute(message, splitted, unsplitted) {
    if(message.member.voice.channel == undefined)
        return message.reply("You must be in a voice channel in order to play a track.");

    if(unsplitted[1] == undefined)
        return message.reply("Invalid song / url.");

    if(distube.getQueue(message) <= 1) 
        return message.reply('There is not any songs that can be played.');

    message.reply("🔥 Communicating with the server ...").then((msg) => {
        setTimeout(() => {
            msg.delete({ timeout: 1500 });
        }, 1100);
    });

    distube.play(message.member.voice.channel, splitted[1].split('play ')[1], { 
        message,
        textChannel: message.channel,
        member: message.member
    }).catch((err) => {
        if(err) return console.log(err.errorCode);
    });

    setTimeout(() => {
        message.delete({ timeout: 1000 });
    }, 1000);   
}

module.exports = { execute, distube };