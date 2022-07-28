const { distube } = require('./play');

module.exports = {
    execute(message, arg, splitted) {
        if(!distube.getQueue(message))
          return message.reply('There is not any song that is playing.');

        if(distube.getQueue(message).voiceChannel !== message.member.voice.channel)
            return message.reply('You are not in the same voice channel as me.');

        let id = splitted[1];

        if(id < 0 || id > distube.getQueue(message).length) 
            return message.reply("Incorrect track id.");

        message.reply(`✅ Removed **${distube.getQueue(message).songs[id - 1].name}** from queue.`).then(() => {
            distube.getQueue(message).songs.splice(1, (id - 1));
        });
    }
}