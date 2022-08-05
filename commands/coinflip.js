const Client = require('../index');
const server_info = require('../db/loadServerInfo');
const userModel = require('../db/userSchema');
const utils = require('../utils.js');
const emojis = require('../emojis.json');

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

require('dotenv').config()

var coinflips = [];

module.exports = {
    coinflips,
    execute(message, arg, splitted) {
        if(coinflips.find((ch) => ch.challanger_id == message.author.id))
            return message.reply("You already have a coinflip challange active. Disable it by typing " + process.env.PREFIX + " coinflip cancel.");
    
        if(coinflips.find((ch) => ch.target_id == message.author.id))
            return message.reply(`Somebody already challenged you. Please decline his challenge.`);

        if(!message.mentions.users.first())
            return message.reply('You must mention the user you want to challange');

        if(coinflips.find((ch) => ch.target_id == message.mentions.users.first()))
            return message.reply(`This user is already challanged by <@${ch.challanger_id}>.`);

        const guild = Client.guilds.cache.get(server_info[0].guild_id);
        guild.members.fetch(message.mentions.users.first()).then((member) => {
            var bet = splitted[2];

            if(bet.includes(",") || bet.includes("."))
                return message.reply("Please try to don't use comma or dot in your bet.");

            bet = parseInt(bet);

            if(!bet || Number.isNaN(bet))
                return message.reply("Invalid bet amount.");

            if(!member)
                return message.reply("Invalid user.");
        
            if(member.user.id === message.author.id)
                return message.reply("You can not challange yourself.");

            if(member.user.bot && message.mentions.users.first().id !== server_info[0].bot_id) {
                return message.reply(`You can not challenge other bots than <@${server_info[0].bot_id}>.`);
            }
                
            userModel.findOne({ discord_id: message.author.id }, (err, res) => {   
                if(err) return console.log(err);

                if(bet > res.money)
                    return message.reply("You don't have that amount of money. Please check your balance typing " + process.env.PREFIX + " stats.");
                    
                userModel.findOne({ discord_id: member.user.id }, (err, res) => { 
                    if(err) return console.log(err);

                    if(bet > res.money) {
                        if(member.user.bot) {
                            const botMoney = Math.floor(bet + Math.random() * 500000);
                            message.reply(`I don't have that amount of money! But, I asked my creator <@${server_info[0].dev_id}> and he gave me +$${utils.numberWithCommas(botMoney)} ${emojis.money}.`);
                            
                            userModel.updateOne({ discord_id: server_info[0].bot_id }, { $inc: { money: botMoney } }).then((err) => {
                                if(err) return console.log(err);
                            });
                        }

                        else {
                            return message.reply(`<@${member.user.id}> doesn't have that amount of money!`);
                        }
                    }

      
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('coinflip-accept')
                                .setLabel(`Accept [${member.user.tag}]`)
                                .setStyle(ButtonStyle.Success)
                            ,
                            new ButtonBuilder()
                                .setCustomId('coinflip-decline')
                                .setLabel(`Decline [${member.user.tag}]`)
                                .setStyle(ButtonStyle.Danger)

                            ,

                            new ButtonBuilder()
                                .setCustomId('coinflip-cancel')
                                .setLabel(`Cancel [${message.author.tag}]`)
                                .setStyle(ButtonStyle.Danger)
                        )

                    const text = `You have been challanged <@${member.user.id}> for a coinflip round. [bet: $${utils.numberWithCommas(bet)}]`;
                    (!member.user.bot) ? message.reply({ content: text, ephemeral: true,  components: [row]}) : message.reply({ content: text, ephemeral: true,  components: []});
                
                    coinflips.push({
                        challanger_id: message.author.id,
                        challanger_name: message.author.username,
                        bet: bet,
                        target_id: member.user.id,
                        target_name: member.user.username,
                        target_accepted: false,
                        heads: 0,
                        tails: 0
                    });

                    if(member.user.bot) 
                        require('../events/interactions/coinflip').accept(server_info[0].bot_id, message.channel.id, message.id);
                });
            });
        });
    }   
}