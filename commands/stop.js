const { distube } = require('./play');

module.exports = {
    execute(message) {
        if(message.member.voice.channel == undefined)
            return message.reply("You must be in a voice channel in order to play a track.");

        if(!distube.getQueue(message))
            return message.reply('There is not any queue.');

        if(distube.getQueue(message).songs.length < 1) 
            return message.reply('There is not any songs that can be played.');

        message.reply('Stopped the music.');
        distube.stop(message);
    }
}