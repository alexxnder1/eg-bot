const { distube } = require('../commands/play');
const Discord = require('discord.js');

module.exports = {
    execute(message, arg, splitted) {
        if(!distube.getQueue(message))
            return message.reply('There is not any song that is playing.');

        if(distube.getQueue(message).voiceChannel !== message.member.voice.channel)
            return message.reply('You are not in the same voice channel as me.');

        var songs = [];
        
        const getIndex = (song) => {
            return distube.getQueue(message).songs.indexOf(song) + 1;
        }

        distube.getQueue(message).songs.forEach((song) => {
            songs.push( { name: `${(getIndex(song) == 1) ? ('`') : ('')} ${getIndex(song)}. ${song.name} ${(getIndex(song) == 1) ? ('🎶 `') : ('')}`, value: `${(getIndex(song) == 1) ? ('`') : ('')}added by ${song.member.user.tag} ${(getIndex(song) == 1) ? ('`') : ('')}`, inline: false } );
        });

        const embed = {
            color: 0x4287f5,
            title: `📜 Queue (${distube.getQueue(message).songs.length})`,
            description: 'These are currently playing songs:',

            fields: songs,

            footer: {
                text: 'Eastern Games BOT',
                icon_url: "https://imgur.com/1nqnLxd.png",
            }
        }

        message.channel.send({ embeds: [embed] });

    }
}