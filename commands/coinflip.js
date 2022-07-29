const Client = require('../index');
const channels = require('../channels.json');
const userModel = require('../db/userSchema');
const utils = require('../utils.js');
const emojis = require('../emojis.json');

require('dotenv').config()

var coinflips = [];

module.exports = {
    execute(message, arg, splitted) {
        switch(splitted[1])
        {
            case 'accept': {
                if(!coinflips.find((ch) => ch.target_id == message.author.id))
                    return message.reply("You don't have a coinflip challange active.");
                
                const challange = coinflips.find((coin) => coin.target_id === message.author.id);
                message.reply(`You accepted <@${challange.challanger_id}>'s challange for a coinflip round. [bet: $${utils.numberWithCommas(challange.bet)}]`);
                
                const chance = Math.floor(Math.random() * 101);
                if(chance <= 50) {
                    challange.tails = challange.challanger_id;
                    challange.heads = challange.target_id;
                }

                else {
                    challange.tails = challange.target_id;
                    challange.heads = challange.challanger_id;
                }

                const embed = {
                    color: 0xfff700,
                    title: 'Coinflip Round #' + (coinflips.length),
                    description: `<@${challange.challanger_id}> - <@${challange.target_id}>`,

                    fields: [
                        {
                            name: 'Bet',
                            value: `**$${utils.numberWithCommas(challange.bet)} ${emojis.money}**`,
                        },
                        
                        {
                            name: `Challanger: ${challange.challanger_name}`,
                            value: `**${(challange.heads === challange.challanger_id) ? ('HEADS') : ('TAILS')}**`,
                            inline: true
                        },
                        
                        {
                            name: `Target: ${challange.target_name}`,
                            value: `**${(challange.heads === challange.target_id) ? ('HEADS') : ('TAILS')}**`,
                            inline: true
                        }
                    ]
                }                

                coinflips[coinflips.indexOf(challange)].target_accepted = true;

                message.channel.send({embeds: [embed]}).then((msg) => {
                    const winChance = Math.floor(Math.random() * 101);

                    var winner = 0;
                    var looser = 0;

                    if(winChance <= 50) {
                        winner = challange.challanger_id;
                        looser = challange.target_id;
                    }
    
                    else {
                        winner = challange.target_id;
                        looser = challange.challanger_id;
                    }

                    setTimeout(() => {
                        const rolling = {
                            color: 0x14ed00,
                            title: '🎲 Coin flipping ... ',
                            image: {
                                url: 'https://media3.giphy.com/media/DHtTmAl1GKdQi3QLK5/giphy.gif?cid=790b761175aebc50962f8340a0ac5c654f14f0eb5a65a035&rid=giphy.gif&ct=s'
                            }
                        }
                        msg.edit({embeds: [rolling]});
                    }, 3500);

                    setTimeout(() => {
                        userModel.updateOne({ discord_id: winner }, { $inc: { money: challange.bet } }, (err, res) => {
                            if(err) return console.log(err);
                        });
    
                        userModel.updateOne({ discord_id: looser }, { $inc: { money: -challange.bet } }, (err, res) => {
                            if(err) return console.log(err);
                        });

                        const guild = Client.guilds.cache.get(channels.guild_id);
                        guild.members.fetch(winner).then((memberWinner) => {
                            guild.members.fetch(looser).then((memberLooser) => {
                                const embeed = {
                                color: 0x14ed00,
                                title: 'Coinflip Round #' + (coinflips.length),
                                thumbnail: {
                                    url: memberWinner.displayAvatarURL()
                                },

                                fields: [
                                    {
                                        name: `${memberWinner.user.tag}`,
                                        value: `+$${utils.numberWithCommas(challange.bet)}`,
                                        inline: true
                                    },
                                    
                                    {
                                        name: `${memberLooser.user.tag}`,
                                        value: `-$${utils.numberWithCommas(challange.bet)}`,
                                        inline: true
                                    }
                                ],
                                description: `${memberWinner} won!`
                                }

                               msg.edit({embeds: [embeed]});
                                coinflips.splice(coinflips.indexOf(challange));
                            });        
                        });
                    }, 7500);
                });

                break;
            }

            case 'cancel': {     
                const a_coin = coinflips.find((ch) => ch.target_id == message.author.id);
                if(!a_coin && !coinflips.find((ch) => ch.challanger_id == message.author.id))
                    return message.reply("You don't have a coinflip challange active.");

                const challange = coinflips.find((coin) => (a_coin) ? coin.target_id : (coin.challanger_id) === message.author.id);
                message.reply((challange.challanger_id == message.author.id) ? `You just cancelled coinflip invitation to <@${challange.target_id}>.` : `You cancelled <@${challange.challanger_id}>'s invitation to coinflip.`);
                coinflips.splice(coinflips.indexOf(challange));
                break;
            }

            default: {
                // challange
                if(coinflips.find((ch) => ch.challanger_id == message.author.id))
                    return message.reply("You already have a coinflip challange active. Disable it by typing " + process.env.PREFIX + " coinflip cancel.");

                if(!message.mentions.users.first())
                    return message.reply('You must mention the user you want to challange');

                if(coinflips.find((ch) => ch.target_id == message.mentions.users.first()))
                    return message.reply(`This user is already challanged by <@${ch.challanger_id}>.`);

                const guild = Client.guilds.cache.get(channels.guild_id);
                guild.members.fetch(message.mentions.users.first()).then((member) => {
                    const bet = parseInt(splitted[2]);
                
                    if(!bet)
                        return message.reply("Invalid bet amount.");

                    if(!member)
                        return message.reply("Invalid user.");
                
                    if(member.user.id === message.author.id)
                        return message.reply("You can not challange yourself.");

                        
                    userModel.findOne({ discord_id: message.author.id }, (err, res) => {
                        if(err) return console.log(err);

                        if(bet > res.money)
                            return message.reply("You don't have that amount of money. Please check your balance typing " + process.env.PREFIX + " stats.");

                        userModel.findOne({ discord_id: member.user.id }, (err, res) => { 
                            if(err) return console.log(err);

                            if(bet > res.money)
                                return message.reply(`<@${member.user.id}> doesn't have that amount of money.`);
                        
                            message.reply(`You have been challanged <@${member.user.id}> for a coinflip round. [bet: $${utils.numberWithCommas(bet)}]`);
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
                        });
                    });
                });
                break;
            }
        }
    }   
}