const channels = require('../channels.json');
const userModel = require('../db/userSchema');
const { crash_info } = require('../systems/crash');

const utils = require('../utils');

module.exports = {
    execute(message, arg, splitted) {
        if(message.channel.id !== channels.crash_channel)
            return false;

        if(crash_info.startingIn <= 0 || crash_info.waiting)
            return message.reply("The crashing game is in execution. Please wait before the round ends.");

        if(crash_info.players.some(player => player.id === message.author.id)) {
            return message.reply("You already joined crash game.").then((msg) => { setTimeout(() => {
                msg.delete({timeout: 1000});
            }, 1000); })
        }

        let money = splitted[1];
        if(money < 0)
            return message.reply("Please enter a valid amount of money").then((msg) => setTimeout(() => msg.delete({ timeout: 1000 }), 1800));
            
        userModel.findOne({ discord_id: message.author.id }, (err, res) => {
            if(err) return console.log(err);
            if(!res) return false;

            if(money > res.money)
                return message.reply("You don't have amount of money.").then((msg) => setTimeout(() => msg.delete({ timeout: 1000 }), 1800));

            crash_info.players.push({
                id: message.author.id,
                bet: money,
                joined: false
            });

            userModel.updateOne({ discord_id: message.author.id }, { $inc: { money: -money } });
            message.reply(`You bet at the crash game $**${utils.numberWithCommas(money)}**. Now you can press join button!`).then((msg) => setTimeout(() => { 
                msg.delete({ timeout: 1000 });
            }, 2000));            
        });

        setTimeout(() => {
            message.delete({ timeout: 1000 });
        }, 1600);
    }
}