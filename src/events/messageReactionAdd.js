module.exports = {
    execute(reaction, user) {
        require('./interactions/suggest').reactionAdd(reaction); 
    }
}