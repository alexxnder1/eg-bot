const Client = require('../index');
const channels = require('../channels.json');
const userModel = require('../db/userSchema');
const utils = require('../utils');

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

require('dotenv').config()

var matches = []; 

module.exports = {
    matches,
    execute(message, arg, splitted) {
        if(matches.some(match => match.challanger === message.author.id) || matches.some(match => match.target === message.author.id))
            return message.reply(`You are in a challange with somebody.`);

        const mention = message.mentions.users.first();
        const bet = splitted[2];
        if(!mention || bet < 0)
            return message.reply(`${process.env.PREFIX} tic-tac-toe <@mention> <bet>`);

        if(matches.some(match => match.target === mention) || matches.some(match => match.challanger === mention))
            return message.reply("That user is already in a tic-tac-toe challange with somebody.");

        if(mention === message.author.id)
            return message.reply("You can not challange yourself.");

        userModel.findOne({ discord_id: message.author.id }, (err, res) => {
            if(err) return console.log(err);

            if(bet > res.money) 
                return message.reply("You don't have that amount of money.");
                
            userModel.findOne({ discord_id: mention.id }, (err, res) => {
                if(err) return console.log(err);
            
                if(bet > res.money)
                    return message.reply(`<@${mention.id}> don't have that amount of money.`);
            });
           
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel(`Accept ${mention.tag}`)
                        .setCustomId('ttt-accept')
                        .setStyle(ButtonStyle.Success)
                    ,

                    new ButtonBuilder()
                        .setLabel(`Decline ${mention.tag}`)
                        .setCustomId('ttt-decline')
                        .setStyle(ButtonStyle.Danger)
                
                    ,

                    new ButtonBuilder()
                        .setLabel(`Cancel ${message.author.tag}`)
                        .setCustomId('ttt-cancel')
                        .setStyle(ButtonStyle.Secondary)
                )

            message.channel.send({ content: `<@${message.author.id}> challanged <@${mention.id}> at a Tic-Tac-Toe game for $${utils.numberWithCommas(bet)}.`, components: [row]}).then((msg) => {
                matches.push({
                    challanger: message.author.id,
                    target: mention.id,
                    accepted: false,
                    money: bet,
                    game_ui: [],
                    waiting: false,
                    turn: message.author.id,
                    page: [],
                    invite_msg: msg,
                    buttons: [new ActionRowBuilder(), new ActionRowBuilder(), new ActionRowBuilder()]
                });      
            });
        });
    }
}