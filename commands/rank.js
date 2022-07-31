const userModel = require('../db/userSchema');

module.exports = {
    execute(message, arg, splitted) {       
        userModel.find({ }).sort({ level: -1 }).exec((err, res) => {
            if(err) return console.log(err);

            res.forEach((user) => {
                if(user.discord_id == message.author.id) {
                    message.reply(`${(res.indexOf(user) + 1 == 1) ? ('👑') : ('')} Your rank in server top is **#${res.indexOf(user) + 1}**.`);
                }
            });
        });
    }
}