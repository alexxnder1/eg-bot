const path = require('path');
const fs = require('fs');

const cmdPath = path.join(__dirname.split('\events')[0], "commands");
const cmdFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'));

module.exports = {
    execute(message) {
        if(message.author.bot)
            return false;
            
       require('../systems/level').execute(message);        
       require('../systems/tickets').transcript(message);        

        if(!message.content.startsWith(process.env.PREFIX))
            return false;

        const splitted = message.content.split(`${process.env.PREFIX} `);
        const messageSplitted = splitted[1].split(' '); 
        
        const cmd = cmdFiles.filter((file) => file.split('.js')[0] === messageSplitted[0]);
        if(!cmd.length)
            return message.reply("**Beep, boop, beep!** That command doesn't exists! :robot:")

        const fileCmd = require(`../commands/${cmd}`);
        fileCmd.execute(message, splitted, messageSplitted);    
    }
}