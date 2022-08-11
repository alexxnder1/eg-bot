const { matches } = require('../../commands/tic-tac-toe');
const server_info = require('../../db/loadServerInfo');
const Client = require('../../../index');
const { ButtonBuilder, ButtonStyle, ActionRow, ActionRowBuilder } = require('discord.js');
const userModel = require('../../db/schemas/userSchema');
const utils = require('../../../utils');

const getButtonPageById = (i) => {
    var id = 0;
    if(i <= 2) {
        id = 0;
    }

    else if(i > 2 && i <= 5) {
        id = 1;
    }

    else if( i > 5 && i <= 8) {
        id = 2;
    }

    return id;
}

const getbuttonid = (i) => {
    var id = 0;
    if(i < 3)
        id = i;

    else if(i > 2 && i < 6)
        id = i - 3;
    
    else if(i > 5 && i < 9)
        id = i - 6;

    
    return id;
}

const winAlgorithm = (match) => {
    for(var i = 0; i < 9; i++) {
        if(i < 3) {
            if(match.game_ui[i] === 'X' && match.game_ui[i + 3] === 'X' && match.game_ui[i + 6] === 'X') {
                return 0;
            }

            else if(match.game_ui[i] === '0' && match.game_ui[i + 3] === '0' && match.game_ui[i + 6] === '0') {
                
                return 1;
            }
        }
        
        if(i == 0 || i == 3 || i == 5) {
            if(match.game_ui[i] === 'X' && match.game_ui[i + 1] === 'X' && match.game_ui[i + 2] === 'X')
                return 0;

            else if(match.game_ui[i] === '0' && match.game_ui[i + 1] === '0' && match.game_ui[i + 2] === '0')
                return 1;
        }            
        
        if(i == 0) {
            if(match.game_ui[i] === 'X' && match.game_ui[i + 4] === 'X' && match.game_ui[i + 8] === 'X')
                return 0;

            else if(match.game_ui[i] === '0' && match.game_ui[i + 4] === '0' && match.game_ui[i + 8] === '0')
                return 1;
        }

        if(i == 2) {
            if(match.game_ui[i] === 'X' && match.game_ui[i + 2] === 'X' && match.game_ui[i + 4] === 'X')
                return 0;

            else if(match.game_ui[i] === '0' && match.game_ui[i + 2] === '0' && match.game_ui[i + 4] === '0')
                return 1;
        }
    }

    return -1;
};


const resetMatchVars = (match) => {
    match.invite_msg.delete({ timeout: 1000 });
    
    for(var i = 0; i < 3; i++)
        match.page[i].delete();

    matches.splice(match);
}

module.exports = {
    execute(int) {
        var match = matches.find(match => match.target === int.member.id);
        
        if(!match)
            match = matches.find(match => match.challanger === int.member.id);
        
        if(!match)
            return false;

        const guild = Client.guilds.cache.get(server_info[0].guild_id);
        const channel = guild.channels.cache.get(int.channel.id);
        const target_member = guild.members.cache.get(match.target);
        const challanger_member = guild.members.cache.get(match.challanger);
        var message = channel.messages.cache.get(match.messageid);       

        const challangerTurn = (match.turn === match.challanger) ? ('[turn]') : ('');
        const targetTurn = (match.turn === match.target) ? ('[turn]') : ('');

        if(match.waiting)
            return false;

        for(var i = 0; i < 9; i++) {
            if(int.customId === `ttt-${i}`) {
                if(int.member.id !== match.turn)
                    return false;

                // this means that the slot is occupied
                if(!match.game_ui[i].includes('-')) {
                    return false;
                }

                // challanger (x)
                if(match.challanger === int.member.id) {
                    match.game_ui[i] = 'X';
                    match.turn = match.target;
                }

                // target (0)
                else {
                    match.game_ui[i] = '0';
                    match.turn = match.challanger;
                }

                (match.challanger === int.member.id) ? match.buttons[getButtonPageById(i)].components[getbuttonid(i)].data.label = 'X' : match.buttons[getButtonPageById(i)].components[getbuttonid(i)].data.label = 'O'
                match.buttons[getButtonPageById(i)].components[getbuttonid(i)].data.style = (match.challanger === int.member.id) ? ButtonStyle.Danger : ButtonStyle.Success; 

                match.embed.description = `${challanger_member.user.tag} [X] ${targetTurn} - ${target_member.user.tag} [0] ${challangerTurn}`;
                match.page[getButtonPageById(i)].edit({components: [match.buttons[getButtonPageById(i)]]});
                message.edit({ embeds: [match.embed] });

                // 0 = x | 1 = o
                var winner = winAlgorithm(match) == 0 ? match.challanger : match.target;
                var looser = (winner == match.challanger) ? match.target : match.challanger;

                let count = 0;
                for(var i = 0; i < 9; i++) {
                    if(!match.game_ui[i].includes('-')) {
                        count ++;
                    }
                }

                userModel.findOne({ discord_id: match.challanger }, (err, res) => {
                    userModel.findOne({ discord_id: match.target }, (err, _res) => {
                        if(err) return console.log(err);
                        if(res.money < match.money || _res.money < match.money) {
                            message.channel.send(`<@${int.member.id}>-<@${match.challanger}> tic-tac-toe challange was canceled because one of them doesn't have money.`).then((msg) => {
                                setTimeout(() => {
                                    msg.delete({timeout: 1000});
                                    message.delete();
                                }, 4000);
                            });
                            return resetMatchVars(match);
                        }
                    });
                });

                if(winAlgorithm(match) != -1) {
                    match.waiting = true;
                    setTimeout(() => {   
                        match.embed.description = `${challanger_member.user.tag} [X] - ${target_member.user.tag} [0]`;
                        match.embed.fields.push(
                            {
                                name: 'Winner',
                                value: `<@${winner}> [+$${utils.numberWithCommas(match.money)}]`
                            },
    
                            {
                                name: 'Looser',
                                value: `<@${looser}> [-$${utils.numberWithCommas(match.money)}]`
                            },
                        );
    
                        message.edit({ embeds: [match.embed] });
    
                        userModel.updateOne({ discord_id: winner }, { $inc: { money: match.money } }, (err) => {
                            if(err) return console.log(err);
                        });
    
                        userModel.updateOne({ discord_id: looser }, { $inc: { money: -match.money } }, (err) => {
                            if(err) return console.log(err);
                        });
    
                        setTimeout(() => {
                            resetMatchVars(match);         
                        }, 10000);
                    }, 2500);
                }

                else if(count === 9){
                    match.waiting = true;
                    setTimeout(() => {
                        for(var i = 0; i < 3; i++)
                            match.page[i].delete();
     
                        match.embed.description = `${challanger_member.user.tag} [X] - ${target_member.user.tag} [0]`;
                        match.embed.fields.push(
                            {
                                name: 'Draw',
                                value: `<@${match.challanger}>\n<@${match.target}>`
                            }
                        );

                        message.edit({ embeds: [match.embed] });;

                        setTimeout(() => {
                            resetMatchVars(match);           
                        }, 10000);
                    }, 2500);
                }
            }                
        }   

        switch(int.customId) {   
            case 'ttt-accept': {
                match = matches.find(match => match.target === int.member.id);
                message = channel.messages.cache.get(int.message.id);      

                if(!match)
                    return false;

                message.edit({ components: [] });

                for(var i = 0; i < 9; i++)
                    match.game_ui.push('-');

                const embed = {
                    title: `Tic-Tac-Toe Challange #${matches.length}`,
                    description: `${challanger_member.user.tag} [X] ${challangerTurn} - ${target_member.user.tag} [0] ${targetTurn}`,
                    color: 0x5834eb,
                    fields: []
                }

                match.accepted = true;
                match.embed = embed;

                for(var i = 0 ; i < 9; i++)
                {
                    match.buttons[getButtonPageById(i)].addComponents(
                        new ButtonBuilder()
                        .setLabel(`-`)
                        .setCustomId(`ttt-${i}`)
                        .setStyle(ButtonStyle.Primary)
                    )
                }

                message.channel.send({ embeds: [embed] }).then((msg) => {
                    match.messageid = msg.id;  
                });

                for(var i = 0; i < 3; i++) {
                    message.channel.send({ components: [match.buttons[i]] }).then((msg) => {
                        match.page.push(msg);
                    });
                }
                break;  
            }

            case 'ttt-decline': {
                match = matches.find(match => match.target === int.member.id);
                message = channel.messages.cache.get(int.message.id);      

                if(!match)
                    return false;

                match.invite_msg.delete({ timeout: 1000 });

                message.channel.send(`<@${int.member.id}> decline <@${match.challanger}> tic-tac-toe challange.`).then((msg) => {
                    setTimeout(() => {
                        msg.delete({timeout: 1000});
                    }, 4000);
                });
                matches.splice(match);
                break;
            }

            case 'ttt-cancel': {
                match = matches.find(match => match.challanger === int.member.id);
                message = channel.messages.cache.get(int.message.id);      

                if(!match)
                    return false;
    
                match.invite_msg.delete({ timeout: 1000 });

                message.channel.send(`<@${int.member.id}> canceled his tic-tac-toe challange for <@${match.target}>.`).then((msg) => {
                    setTimeout(() => {
                        msg.delete({timeout: 1000});
                    }, 4000);
                });
                matches.splice(match);
                break;
            }
        }

    }
}