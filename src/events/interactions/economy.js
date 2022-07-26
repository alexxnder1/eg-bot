const emojis = require('../../../emojis.json');
module.exports =  {
    execute(int) {
        if(int.customId !== 'help-economy')
            return false;
           
        const embed = {
            color: 0x2a9c11,
            title: `${emojis.money} How Level, Money, Shards & EXP works?`,
            fields: [
                {
                    name: 'Getting Them',
                    value: 'Every time you write a message on any chat on our server you will receive a small amount of **experience**, **money** and a **2%** chance to receive **shards**.',
                    inline: false
                },

                {
                    name: 'Daily Rewards',
                    value: `At every 24-hour cycle you can use **/daily** to get your prizes ${emojis.money} ${emojis.xp} ${emojis.shard}.`,
                    inline: false
                },
                
                {
                    name: 'Levelling Up',
                    value: `When you have the neccessary amount of EXP to reach the next level you will level up and get a random amount of EXP, Money & Shards. **(BTW: /rank / /top)**`,
                    inline: false
                },

                {
                    name: 'Using them',
                    value: 'You can see what amount of shards, money, etc did you have in your account by typing **/stats**.',
                    inline: false
                }
            ],

            footer: {
                text: `requested by ${int.user.tag}`,
                iconURL: int.member.displayAvatarURL() 
            }
        }

        int.reply({ embeds: [embed], ephemeral: true });
    }
}