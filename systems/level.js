const model = require('../db/userSchema');

module.exports = {
    execute(message) {
        model.updateOne({ discord_id: message.author.id }, { $inc: { messagesWritten: 1 } })
            .exec((err) => {
                if(err) return console.log(err);
            });
        
        model.findOne({ discord_id: message.author.id }, (err, res) => {
            if(err)
                return console.log(err);

            if(res.messagesWritten >= this.returnLevelUpPoints(res.level)) {
                model.updateOne({ discord_id: message.author.id }, { $inc: { level: 1 }})
                .exec((err) => {
                    if(err) return console.log(err);
                });

                const level = {
                    color: 0x4287f5,
                    title: `${message.author.tag} achieved a new level of ${res.level + 1}!`,
                    author: {
                        name: 'Level Up!',
                        iconURL: "https://imgur.com/1nqnLxd.png",
                    },
        
                    fields: [
                        {
                            name: 'Actual EXP',
                            value: '💳 `' + `${res.messagesWritten}` + '`',
                            inline: true
                        },
                        
                        {
                            name: 'Next Level EXP',
                            value: '💸 `' + `${this.returnLevelUpPoints((res.level + 1))}` + '`',
                            inline: true
                        }
                    ]
                }
        
                message.reply( { embeds: [level] });        
            }
        });
    },

    returnLevelUpPoints(level) {
        return (level * 22);
    }
}