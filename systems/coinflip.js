const Client = require('../index');
const channels = require('../channels.json');
const emojis = require('../emojis.json');
const utils = require('../utils');
const userModel = require('../db/userSchema');

const { coinflips } = require('../commands/coinflip');

module.exports = {
    accept(memberid, channelid, messageid) {
        const guild = Client.guilds.cache.get(channels.guild_id);
        const channel = guild.channels.cache.get(channelid);
        const message = channel.messages.cache.find((msg) => msg.id === messageid);

        if(!coinflips.find((ch) => ch.target_id == memberid))
            return channel.send(`<@${memberid}> you don't have a coinflip challenge active.`);
        
        const challange = coinflips.find((coin) => coin.target_id === memberid);
        channel.send(`${(memberid === channels.bot_id) ? ("I") : (`<@${challange.target_id}>`)} accepted <@${challange.challanger_id}>'s challange for a coinflip round. [bet: $${utils.numberWithCommas(challange.bet)}]`);
        
        if(memberid !== channels.bot_id) 
            message.edit({ components: [] });

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
                    name: `Challenger: ${challange.challanger_name}`,
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

        channel.send({embeds: [embed]}).then((msg) => {
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
                        
                       if(winner === channels.bot_id)
                        message.channel.send("Bruuh.. i'm a pro gambler.");
                    
                       else if(looser === channels.bot_id)
                        message.channel.send("Neah... Not was my good time.");
                    });        
                });
            }, 7500);

        });
    },

    decline(int) {
        if(int.customId !== 'coinflip-decline') 
            return false;

        const guild = Client.guilds.cache.get(channels.guild_id);
        
        const channel = guild.channels.cache.get(int.message.channelId);
        const message = channel.messages.cache.find((msg) => msg.id === int.message.id);

        const received = coinflips.find((ch) => ch.target_id == int.member.id);
        if(!received)
            return channel.send(`<@${int.member.id}> you don't have a coinflip challenge active.`);

        message.edit({components: []});

        const challange = coinflips.find((coin) => (received) ? coin.target_id : (coin.challanger_id) === message.author.id);
        channel.send((challange.challanger_id == message.author.id) ? `You just cancelled coinflip invitation to <@${challange.target_id}>.` : `You cancelled <@${challange.challanger_id}>'s invitation to coinflip.`);
        coinflips.splice(coinflips.indexOf(challange));
    }
}