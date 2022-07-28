module.exports = {
    execute(reaction) {
        require('../systems/suggest').reactionAdd(reaction);        
    }
}