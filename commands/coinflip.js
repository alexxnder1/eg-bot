const Client = require('../index');
const channels = require('../channels.json');
const userModel = require('../db/userSchema');
const utils = require('../utils.js');
const emojis = require('../emojis.json');

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

require('dotenv').config()

var coinflips = [];

module.exports = {
    coinflips,
    execute(message, arg, splitted) {
        // challange
        if(coinflips.find((ch) => ch.challanger_id == message.author.id))
            return message.reply("You already have a coinflip challange active. Disable it by typing " + process.env.PREFIX + " coinflip cancel.");

        if(!message.mentions.users.first())
            return message.reply('You must mention the user you want to challange');

        if(coinflips.find((ch) => ch.target_id == message.mentions.users.first()))
            return message.reply(`This user is already challanged by <@${ch.challanger_id}>.`);


        const guild = Client.guilds.cache.get(channels.guild_id);
        guild.members.fetch(message.mentions.users.first()).then((member) => {
            var bet = splitted[2];

            if(bet.includes(",") || bet.includes("."))
                return message.reply("Please try to don't use comma or dot in your bet.");

            bet = parseInt(bet);

            if(!bet)
                return message.reply("Invalid bet amount.");

            if(!member)
                return message.reply("Invalid user.");
        
            if(member.user.id === message.author.id)
                return message.reply("You can not challange yourself.");

            if(member.user.bot && message.mentions.users.first().id !== channels.bot_id) {
                return message.reply(`You can not challenge other bots than <@${channels.bot_id}>.`);
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
                            message.reply(`I don't have that amount of money! But, I asked my creator <@${channels.dev_id}> and he gave me +$${utils.numberWithCommas(botMoney)} ${emojis.money}.`);
                            
                            userModel.updateOne({ discord_id: channels.bot_id }, { $inc: { money: botMoney } }).then((err) => {
                                if(err) return console.log(err);
                            });
                        }

                        else {
                            message.reply(`<@${member.user.id}> doesn't have that amount of money!`);
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
                        require('../systems/coinflip').accept(channels.bot_id, message.channel.id, message.id);
                });
            });
        });
    }   
}