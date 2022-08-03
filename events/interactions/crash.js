const channels = require('../../channels.json');
const userModel = require('../../db/userSchema');
const { crash_info } = require('../../systems/crash');
const Client = require('../../index');
const utils = require('../../utils');

module.exports = {
    execute(int) {
        const guild = Client.guilds.cache.get(channels.guild_id);
        const channel = guild.channels.cache.get(int.message.channel.id);
        if(int.customId === 'crash-join') {
            if(!crash_info.startingIn)
                return false;

            crash_info.players.forEach((player) => {
                if(player.id === int.member.id) {
                    if(player.joined)
                        return false;
                    
                    player.joined = true;
                    return channel.send(`<@${int.member.id}> joined the crash!`).then((msg) => { setTimeout(() => { msg.delete({ timeout: 1000 }) }, 1800); });
                }

                else return channel.send(`<@${int.member.id}> you must bet before you join crash!`).then((msg) => { setTimeout(() => { msg.delete({ timeout: 1000 }) }, 1800); });
            });
        }

        else if(int.customId === 'crash-cashout') {         

            if(crash_info.waiting)
                return false;

            const player = crash_info.players.find((player) => player.id === int.member.id && player.joined);
            if(!player)
                return false;

            const profit = crash_info.value * player.bet;
            userModel.updateOne({ discord_id: int.member.id }, { $inc: { money: profit } }, (err) => { if(err) return console.log(err); });
            await int.reply({ content: `You cash out his bet at **${crash_info.value}x**! [profit: $${utils.numberWithCommas(profit)}]`,  ephemeral: true });
            
            crash_info.players.splice(crash_info.players.indexOf(player), 1);
        }
    }
}