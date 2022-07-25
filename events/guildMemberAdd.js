const userModel = require('../db/userSchema');

module.exports = {
    execute(member) {
        console.log(`[Join] ${member.tag} joined the party.`);

        userModel.findOne({ discord_id: member.id }, (err, res) => {
            if(err)
                return console.log(err);

            if(res == null) {
                userModel.create({
                    discord_id: member.id,
                    username: member.username,
                    tag: member.tag,
                    joined: new Date().toISOString(),
                    created: member.createdAt
                })
            }
        });
    }
}