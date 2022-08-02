const channels = require('../channels.json');
const suggestModel = require('../db/suggestSchema');

module.exports = {
    execute(reaction) { 
        require('./interactions/suggest').reactionRemove(reaction);
    }
}