const { distube } = require('./play');

module.exports = {
    execute(message) {
        if(!distube.getQueue(message) || !distube.getQueue(message).songs.length)
          return message.reply('There is not any song that is playing.');

        if(distube.getQueue(message).voiceChannel !== message.member.voice.channel)
            return message.reply('You are not in the same voice channel as me.');

        message.reply(`✅ Removed ${distube.getQueue(message).songs.length} songs from queue.`);
        distube.getQueue(message).songs = [];
    }
}