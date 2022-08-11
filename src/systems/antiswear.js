const axios = require('axios');
const { PermissionFlagsBits } = require('discord.js');
const { muteUser } = require('../commands/mute');

module.exports = {
    check(message) {    
        if(message.member.permissions.has(PermissionFlagsBits.Administrator))
            return false;

        const encodedParams = new URLSearchParams();
        encodedParams.append("content", message.content);
        encodedParams.append("censor-character", "*");
        
        const options = {
            method: 'POST',
            url: 'https://neutrinoapi-bad-word-filter.p.rapidapi.com/bad-word-filter',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': '48b4582ab0mshfd6ad6bb82e8caep19ad28jsnf7647c1bb2f2',
                'X-RapidAPI-Host': 'neutrinoapi-bad-word-filter.p.rapidapi.com'
            },
            data: encodedParams
        }
        
        axios.request(options).then((res) => {
            if(res.data['is-bad']) {
                const Client = require('../../index');
                muteUser(message, message.author.id, `bad language: ${res.data['censored-content'].toString()}`, new Date().getTime() + (5 * 1000), Client.user.id, true);

                message.reply(`<@${message.author.id}> please try to use an appropiate language.`);
        
                setTimeout(() => {
                    message.delete({ timeout: 1000 });
                }, 500);
                return false;
            }
        }).catch((err) => console.error(err));
    }
}