const server_info = require('../db/loadServerInfo');
const suggestModel = require('../db/suggestSchema');

module.exports = {
    execute(reaction) { 
        require('./interactions/suggest').reactionRemove(reaction);
    }
}