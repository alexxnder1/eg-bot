// NOTE: this module is for guildMemberAdd testing purposes.
module.exports = {
    execute(message) {
        require('../events/guildMemberAdd').execute(message.member);
    }
}