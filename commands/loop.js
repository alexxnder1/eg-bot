const { distube } = require('./play');

module.exports = {
    execute(message, arg, splitted) {
        if(!distube.getQueue(message))
          return message.reply('There is not any song that is playing.');

        if(distube.getQueue(message).voiceChannel !== message.member.voice.channel)
            return message.reply('You are not in the same voice channel as me.');

        let type = splitted[1];
        let typeConverted = -1;

        if(!type)
            return message.reply('`* loop <disabled/song/queue>`');

        switch(type.toLowerCase()) {
            case "disabled": {
                typeConverted = 0;
                break;
            }

            case "song": {
                typeConverted = 1;
                break;
            }

            case "queue": {
                typeConverted = 2;
                break;
            }

            default: {
                return message.reply('❌ Invalid repeat type. **[disabled/queue/song]**');
            }
        }

        distube.setRepeatMode(message, typeConverted);
        message.reply(`🎼 Repeat mode: **${(distube.getQueue(message).repeatMode) ? ('on') : ('off')}**. Type: **${type}**.`);
    }
}