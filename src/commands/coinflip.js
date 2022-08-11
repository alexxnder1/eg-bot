const server_info = require('../db/loadServerInfo');
const userModel = require('../db/schemas/userSchema');
const utils = require('../../utils.js');
const emojis = require('../../emojis.json');

const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

var coinflips = [];

const data = new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Coinflip with a user on a specific amount of money.')
    .addUserOption(option => option.setName('user').setDescription('User you want to challenge').setRequired(true))
    .addNumberOption(option => option.setName('money').setDescription('The amount of money you want to play with.').setRequired(true))

async function execute (int) {
    if(coinflips.find((ch) => ch.challanger_id == int.user.id))
        return int.reply("You already have a coinflip challange active. Disable it by typing " + '/' + "coinflip cancel.");

    if(coinflips.find((ch) => ch.target_id == int.user.id))
        return int.reply(`Somebody already challenged you. Please decline his challenge.`); 

    let user = int.options.getUser('user');
    if(!user)
        return int.reply('You must mention the user you want to challange');    

    if(coinflips.find((ch) => ch.target_id == user.id))
        return int.reply(`This user is already challanged by <@${ch.challanger_id}>.`); 
        const Client = require('../../index');

    const guild = Client.guilds.cache.get(server_info[0].guild_id);
    guild.members.fetch(user).then((member) => {
        var bet = int.options.getNumber('money');  

        if(!bet || Number.isNaN(bet))
            return int.reply("Invalid bet amount.");    

        if(!member)
            return int.reply("Invalid user.");

        if(member.user.id === int.user.id)
            return int.reply("You can not challange yourself.");    

        if(member.user.bot && user.id !== server_info[0].bot_id) {
            return int.reply(`You can not challenge other bots than <@${server_info[0].bot_id}>.`);
        }

        userModel.findOne({ discord_id: int.user.id }, async(err, res) => {   
            if(err) return console.log(err);    
            if(bet > res.money)
                return int.reply("You don't have that amount of money. Please check your balance typing " + '/' + "stats.");

            userModel.findOne({ discord_id: member.user.id }, async(err, res) => { 
                if(err) return console.log(err);    
                if(bet > res.money) {
                    if(member.user.bot) {
                        const botMoney = Math.floor(bet + Math.random() * 500000);
                        await int.reply({ content: `I don't have that amount of money! But, I asked my creator <@${server_info[0].dev_id}> and he gave me +$${utils.numberWithCommas(botMoney)} ${emojis.money}.`, ephemeral: false });

                        userModel.updateOne({ discord_id: server_info[0].bot_id }, { $inc: { money: botMoney } }).then((err) => {
                            if(err) return console.log(err);
                        });
                    }   
                    else {
                        return int.reply(`<@${member.user.id}> doesn't have that amount of money!`);
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
                            .setLabel(`Cancel [${int.user.tag}]`)
                            .setStyle(ButtonStyle.Danger)
                    )   
                const text = `You have been challanged <@${member.user.id}> for a coinflip round. [bet: $${utils.numberWithCommas(bet)}]`;
                (!member.user.bot) ? await int.reply({ content: text, ephemeral: false, components: [row]}) : await int.reply({ content: text, ephemeral: false, components: []});
                    
                coinflips.push({
                    challanger_id: int.user.id,
                    challanger_name: int.user.username,
                    bet: bet,
                    target_id: member.user.id,
                    target_name: member.user.username,
                    target_accepted: false,
                    heads: 0,
                    tails: 0
                }); 
                if(member.user.bot) 
                    require('../events/interactions/coinflip').accept(server_info[0].bot_id, int.channel.id, int.id);
            });
        });
    }); 
}

module.exports = { execute, coinflips, data };