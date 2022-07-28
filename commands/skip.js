const { distube } = require('./play');

require('dotenv').config();

module.exports = {
    execute(message) {        
        if(!distube.getQueue(message).playing)
           return message.reply('There is not any song that is playing.');
   
        if(distube.getQueue(message).songs.length <= 1)
            return message.reply('This is the only song in the queue, if you want to skip it just use **' + process.env.PREFIX + " stop.**");

        if(distube.getQueue(message).voiceChannel !== message.member.voice.channel)
            return message.reply('You are not in the same voice channel as me.');

        message.reply('Skipped song... 👍');        
        distube.skip(message);
    }
}