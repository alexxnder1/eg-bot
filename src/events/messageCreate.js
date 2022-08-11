module.exports = {
    execute(message) {
        if(message.author.bot)
            return false;

        // require('../systems/antiswear').check(message);        
       require('../systems/level').execute(message);        
       require('./interactions/tickets').transcript(message);        
    }
}