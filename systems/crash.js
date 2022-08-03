const Client = require('../index');
const channels = require('../channels.json');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed } = require('discord.js');
const userModel = require('../db/userSchema');

require('dotenv').config();

var crash_info = {
    startingIn: new Date().getTime() + 30000,
    players: [],
    value: 0,
    waiting: false,
    last_value: 0,
    runningText: false,
    message: 0
}

module.exports = {
    crash_info,
    execute() {
        const guild = Client.guilds.cache.get(channels.guild_id);
        const crash_channel = guild.channels.cache.get(channels.crash_channel);
        
        const embed = {
            color: 0x32a852,
            title: '📉 Crash',
            description: `Please enter a bet (**${process.env.PREFIX} bet <$amount>**) then please join button when round starts.`,
            fields: [
                {
                    name: 'Value',
                    value: '0.0x',
                    inline: true
                },

                
                {
                    name: 'Last Value',
                    value: '0.0x',
                    inline: true
                },

                
                {
                    name: 'Players',
                    value: '0',
                    inline: true
                }
            ]               
        }
        
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel((crash_info.startingIn) ? 'Join' : 'Join Next Round')
            .setCustomId('crash-join')
            .setStyle(ButtonStyle.Success)
        )

        const recharge_crash = (embed, msg) => {
            embed.title = `📉 Crash`;
            embed.color = 0x32a852;
            embed.description = `Please enter a bet (**${process.env.PREFIX} bet <$amount>**) then please join button when round starts.`;
            embed.fields[1].value = `${crash_info.last_value}x`;
            embed.fields[0].value = `0.0x`;

            msg.edit({ embeds: [embed], components: [row] });

            crash_info.waiting = false;
            crash_info.players = [];
        }

        const crash_execution = (mes) => {
            setInterval(() => {
                crash_channel.messages.fetch().then((messages) => {
                        messages.forEach((msg) => {
                            if(mes.id === msg.id) {
                                if((crash_info.startingIn - new Date().getTime()) > 0 && !crash_info.waiting) {
                                    crash_info.startingIn -= 700;
                                }

                                else if(!crash_info.waiting) {
                                    const cashout_button = new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setLabel('Cash Out')
                                        .setCustomId('crash-cashout')
                                        .setStyle(ButtonStyle.Primary)
                                    )

                                    crash_info.value += 1;                                   
                                    embed.fields[0].value = `${crash_info.value}x`;
                                        
                                    if(!crash_info.runningText) {
                                        embed.title = '📊 Crash - Running',
                                        embed.description = `The graph is increasing its size... Please cash out when you feel safe to do it.`;
                                        embed.color = 0xe3b600;
                                        embed.fields[1].value = `${crash_info.last_value.toFixed(1)}x`;
                                        embed.fields[2].value = crash_info.players.length;
                                        
                                        crash_info.runningText =  true;
                                    }

                                    msg.edit({ embeds: [embed], components: [cashout_button]});

                                    var cap = 0;
                                    const chance = Math.floor(1 + Math.random() * 10);

                                    if(chance > 8)
                                        cap = Math.floor(1 + Math.random() * 40);

                                    else cap = Math.floor(1 + Math.random() * 10);                                        

                                    if(crash_info.value >= cap) {                                       
                                        // stop crash
                                        embed.title = `🛑 Crash - Stopped ${crash_info.value.toFixed(1)}x`;
                                        embed.color = 0xff0d00;
                                        msg.edit({ embeds: [embed], components:[] });

                                        crash_info.waiting = true;
                                        crash_info.last_value = crash_info.value;
                                        crash_info.value = 0;
                                        crash_info.startingIn = new Date().getTime() + 30000;

                                        setTimeout(() => { recharge_crash(embed, msg) }, 10000);       

                                        crash_info.players.forEach((player) => {
                                            userModel.updateOne({ discord_id: player.id }, { $inc: { money: -player.bet } }, (err) => {
                                                if(err) return console.log(err);
                                            });
                                        });                              
                                        return false;
                                    }
                                }
                            }
                        });
                    });
            }, 1000);   
        }

        crash_channel.bulkDelete(5).then(() => {
            crash_channel.send({ embeds: [embed], components: [row] }).then((mes) => {
                crash_execution(mes); 
                crash_info.embed = mes;
            });  
        });
     }
}