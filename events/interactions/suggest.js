const suggestModel = require('../../db/suggestSchema');
const server_info = require('../../db/loadServerInfo');


module.exports = {
    reactionAdd(reaction) {
        if(reaction.message.channel.id !== server_info[0].suggest_channel) 
            return false;

        if(reaction.emoji.name !==  '👍' && reaction.emoji.name !==  '👎')
            return false;

        reaction.message.reactions.resolve(reaction.emoji.name).users.fetch().then(users => {
            users.forEach(user => {
                if(user.bot) return false;
        
                suggestModel.findOneAndUpdate({ message_id: reaction.message.id }, { $inc:  (reaction.emoji.name == '👍') ? ({ YesVotes: 1 }) : ({ NoVotes: 1 }) }, (err, res) => {
                    if(err)
                        return console.log(err);
        
                    if(!res)
                        return console.log(`Can not update into database the reaction by ${user.tag} at the suggest of ${res.discord_id}.`);
                
                    console.log(`Updated into database the reaction [id: ${reaction.count}] by ${user.tag} at the suggest of ${res.discord_id}.`);
                });
            });
        });
        
    },

    reactionRemove(reaction) {
        if(reaction.message.channelId !== server_info[0].suggest_channel) 
            return false;

        if(reaction.emoji.name !==  '👍' && reaction.emoji.name !==  '👎')
            return false;

        suggestModel.findOneAndUpdate({ message_id: reaction.message.id }, { $inc:  (reaction.emoji.name == '👍') ? ({ YesVotes: -1 }) : ({ NoVotes: -1 }) }, (err, res) => {
            if(err)
                return console.log(err);

            if(!res)
                return console.log(`Can not update into database the reaction at the suggest of ${res.discord_id}.`);
        
            console.log(`Removed into database the reaction ${res.discord_id}.`);
        });
    }
}