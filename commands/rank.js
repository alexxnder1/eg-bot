const userModel = require('../db/userSchema');

async function getUsersSorted () {
    let result = userModel.find({ }).sort({ level: -1 });
    return result;
}

async function execute(message) {       
    const users = await getUsersSorted();
    users.forEach((member) => {
        if(member.discord_id == message.author.id) {
            let rank = users.indexOf(member) + 1;
            message.reply(`${rank === 1 ? ('👑') : ('')} Your rank in server top is **#${rank}**.`);                        
        }
    })
}
module.exports = {execute, getUsersSorted};