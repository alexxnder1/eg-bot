const Client = require('../index');
const channels = require('../channels.json');
const emojis = require('../emojis.json');

const path = require('path');
const fs = require('fs');

const cmdPath = path.join(__dirname.split('\events')[0], "commands");
const cmdFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'));

require('dotenv').config();
module.exports = {
    execute(int) {       
        if(!int.isButton()) return false;
        int.deferUpdate();

        // ticket system
        require('../systems/tickets').execute(int);
    
        const guild = Client.guilds.cache.get(channels.guild_id);
        const memberRole = guild.roles.cache.find((role) => role.name === 'Member');
    
        if(int.message.channel.id === channels.rules_channel) {
            const notVerified = guild.roles.cache.find(role => role.id === channels.not_verified_role_id);
            int.member.roles.add(memberRole);
            int.member.roles.remove(notVerified);
        }
        
        if(int.customId === 'coinflip-accept')
            require('../systems/coinflip').accept(int.member.id, int.message.channelId, int.message.id);
            
        require('../systems/coinflip').decline(int);
        require('../systems/coinflip').cancel(int);
        require('../systems/suggest').interaction(int);
    
        if(int.customId === 'help-economy') {
            const channel = guild.channels.cache.get(int.message.channelId);
            
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
                        value: `At every 24-hour cycle you can use **${process.env.PREFIX} daily** to get your prizes ${emojis.money} ${emojis.xp} ${emojis.shard}.`,
                        inline: false
                    },
                    
                    {
                        name: 'Levelling Up',
                        value: `When you have the neccessary amount of EXP to reach the next level you will level up and get a random amount of EXP, Money & Shards. **(BTW: ${process.env.PREFIX} rank / ${process.env.PREFIX} top)**`,
                        inline: false
                    },
    
                    {
                        name: 'Using them',
                        value: 'You can see what amount of shards, money, etc did you have in your account by typing **' + process.env.PREFIX + ' stats**.',
                        inline: false
                    }
                ],
    
                footer: {
                    text: `requested by ${int.user.tag}`,
                    iconURL: int.member.displayAvatarURL() 
                }
            }
    
            channel.send({ embeds: [embed] });
        }
    }
}