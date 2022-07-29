module.exports = {
    execute(reaction, user) {
        require('../systems/suggest').reactionAdd(reaction); 
    }
}