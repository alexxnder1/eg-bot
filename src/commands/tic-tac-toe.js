const userModel = require('../db/schemas/userSchema');
const utils = require('../../utils');

const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

var matches = []; 

const data = new SlashCommandBuilder()
    .setName('tic-tac-toe')
    .setDescription('Play tic-tac-toe with a people.')
    .addUserOption(option => option.setName('user').setDescription('The user you want to play tic-tac-toe with.').setRequired(true))
    .addNumberOption(option => option.setName('money').setDescription('The amount of money you want to play with.').setRequired(true))

async function execute(int) {
    if(matches.some(match => match.challanger === int.user.id) || matches.some(match => match.target === int.user.id))
        return int.reply(`You are in a challange with somebody.`);

    const mention = int.options.getUser('user');
    const bet = int.options.getNumber('money');
    if(matches.some(match => match.target === mention) || matches.some(match => match.challanger === mention))
        return int.reply({ content: "That user is already in a tic-tac-toe challange with somebody.", ephemeral: true});

    if(mention.id === int.user.id)
        return int.reply({ content: "You can not challange yourself.", ephemeral: true });

    userModel.findOne({ discord_id: int.user.id }, (err, res) => {
        if(err) return console.log(err);

        if(bet > res.money) 
            return int.reply("You don't have that amount of money.");

        userModel.findOne({ discord_id: mention.id }, (err, res) => {
            if(err) return console.log(err);
        
            if(bet > res.money)
                return int.reply(`<@${mention.id}> don't have that amount of money.`);
              
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
                        .setLabel(`Cancel ${int.user.tag}`)
                        .setCustomId('ttt-cancel')
                        .setStyle(ButtonStyle.Secondary)
                )
    
            int.channel.send({ content: `<@${int.user.id}> challanged <@${mention.id}> at a Tic-Tac-Toe game for $${utils.numberWithCommas(bet)}.`, components: [row]}).then((msg) => {
                matches.push({
                    challanger: int.user.id,
                    target: mention.id,
                    accepted: false,
                    money: bet,
                    game_ui: [],
                    waiting: false,
                    turn: int.user.id,
                    page: [],
                    invite_msg: msg,
                    buttons: [new ActionRowBuilder(), new ActionRowBuilder(), new ActionRowBuilder()]
                });      
            });
        });
    });   
}

module.exports = { execute, matches, data };