module.exports = {
    execute(reaction) { 
        require('./interactions/suggest').reactionRemove(reaction);
    }
}