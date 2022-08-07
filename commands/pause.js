const { distube } = require('./play');

async function execute(message) {        
    if(!distube.getQueue(message))
       return message.reply('There is not any queue.');

    if(!distube.getQueue(message).playing)
       return message.reply('There is not any song that is playing.');

    if(distube.getQueue(message).voiceChannel !== message.member.voice.channel)
        return message.reply('You are not in the same voice channel as me.');

    distube.pause(message);
    message.reply('Paused song... ⏸️');        
}

module.exports = { execute };