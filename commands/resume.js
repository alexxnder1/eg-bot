const { distube } = require('./play');

async function execute(message) {    
    if(!distube.getQueue(message))
        return message.reply('There is not any queue.');
        
    if(distube.getQueue(message).playing)
        return message.reply('There is song that is playing.');

    if(distube.getQueue(message).voiceChannel !== message.member.voice.channel)
        return message.reply('You are not in the same voice channel as me.');

    distube.resume(message);
    message.reply('Resumed song... 🎶');        
}

module.exports = { execute };