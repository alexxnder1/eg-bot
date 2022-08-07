const userSchema = require('../db/userSchema');
const utils = require('../utils');
const emojis = require('../emojis.json');
const { GlobalFonts }  = require('@napi-rs/canvas');
const Canvas  = require('@napi-rs/canvas');

const { AttachmentBuilder } = require('discord.js');

const { getUsersSorted } = require('./rank.js');
const userModel = require('../db/userSchema');

let applyText = (def=10, canvas, text) => {
    let fontSize = def;
    const context = canvas.getContext('2d');
    do {
        context.font = `${fontSize -= 5}px oswald`;
    } while(context.measureText(text).width > 250)
    
    return context.font;
}

let progressBar = (val, canvas) => {
    let context = canvas.getContext('2d');
    context.fillStyle = "#ffffff";
    context.fillRect(canvas.width / 30.47, 320, val, 12);
    context.strokeRect(canvas.width / 30.47, 320, canvas.width / 4, 12);
}

async function execute(message) {
    const canvas = Canvas.createCanvas(850, 480);
    const context = canvas.getContext('2d');

    const background = await Canvas.loadImage('./assets/cards/1.png');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    GlobalFonts.registerFromPath('./assets/secular.ttf', 'secular');
    GlobalFonts.registerFromPath('./assets/oswald.ttf', 'oswald');
    GlobalFonts.registerFromPath('./assets/mw.ttf', 'mw');
    
    context.beginPath();
    context.arc(125, 125, 80, 0, Math.PI * 2, true);
   
    context.font = applyText(31, canvas, message.author.username);
    context.fillStyle = "#ffffff";
    context.textAlign = "center";
    context.strokeText(message.author.username, (canvas.width / 7),canvas.height / 2);
    context.fillText(message.author.username, (canvas.width / 7),canvas.height / 2);
    
    context.font = "45px mw";
    context.fillStyle = "#00abb8";
    context.textAlign = "right";
    
    userModel.findOne({ discord_id: message.author.id }, (err, res) => {
        if(err) return console.log(err);
        
        let perc = (res.experience / utils.returnLevelUpPoints(res.level)) * 100;
        let val = ((canvas.width / 4)*perc)/100;
        console.log(val);
        progressBar(val, canvas);

        context.font = "bold 30px secular";
        context.fillStyle = "#ffffff";
        context.textAlign = "center";
        context.fillText(`LVL`, (canvas.width / 2),canvas.height / 2.2);    
        context.fillStyle = "#e3be07";
        context.strokeText(`${res.level}`, (canvas.width / 2),canvas.height / 1.95);
        context.fillText(`${res.level}`, (canvas.width / 2),canvas.height / 1.95);    
        
        context.fillStyle = "#ffffff";
        context.fillText(`MONEY`, (canvas.width / 1.5),canvas.height / 2.2);    
        context.fillStyle = "#5ecc04";
        let money = `$${utils.numberWithCommas(res.money)}`;
        context.strokeText(money, (canvas.width / 1.5),canvas.height / 1.95);
        context.fillText(money, (canvas.width / 1.5),canvas.height / 1.95);    

        context.fillStyle = "#ffffff";
        context.fillText(`SHARD`, (canvas.width / 1.15),canvas.height / 2.2);    
        context.fillStyle = "#7904cc";
        let shard = `${utils.numberWithCommas(res.shards)}`;
        context.strokeText(shard, (canvas.width / 1.15),canvas.height / 1.95);
        context.fillText(shard, (canvas.width / 1.15),canvas.height / 1.95);    

        context.fillStyle = "#ffffff";
        context.fillText(`MSG`, (canvas.width / 1.5),canvas.height / 1.6);    
        context.fillStyle = "#cf5d00";
        let msg = `${utils.numberWithCommas(res.messagesWritten)}`;
        context.strokeText(msg, (canvas.width / 1.5),canvas.height / 1.47);
        context.fillText(msg, (canvas.width / 1.5),canvas.height / 1.47);    

        context.font = "20px secular";
        context.fillStyle = "#ffffff";
        let text = `(${utils.numberWithCommas(res.experience)}/${utils.numberWithCommas(utils.returnLevelUpPoints(res.level))} EXP)`;
        context.strokeText(text, (canvas.width / 6.47),canvas.height / 1.36);
        context.fillText(text, (canvas.width / 6.47),canvas.height / 1.36);        
    })

    let users = await getUsersSorted();
    let rank = 0;
    users.forEach((member) => {
        if(member.discord_id == message.author.id) {
            rank = users.indexOf(member) + 1;
        }
    })

    context.font = "bold 45px oswald";
    context.fillStyle = "#e3be07";
    context.strokeText(`#${rank}`,  (canvas.width / 1.1),canvas.height / 7);
    context.fillText(`#${rank}`, (canvas.width / 1.1),canvas.height / 7);

    context.stroke();
    context.closePath();
    context.clip();

    const avatar = await Canvas.loadImage(message.member.displayAvatarURL({ extension: 'jpg'} ));
    context.drawImage(avatar, 25, 30, 200, 200);
    
    const attach = new AttachmentBuilder(await canvas.encode('png'), { name: 'backgrond.jpg' });
    message.channel.send({ files: [attach]});

    // userSchema.findOne({ discord_id: message.author.id }, (err, res) => {
    //     if(err) return console.log(err);

    //     if(!res) 
    //         return message.reply('An error occurred with your database account. Please try again later.');
    
        
    //     message.channel.send('', attach);

    //     var statsFields = [
    //         {
    //             name: `Level ${res.level} ${emojis.xp} `,
    //             value: `(${utils.numberWithCommas(res.experience)}/${utils.numberWithCommas(utils.returnLevelUpPoints(res.level, res.experience))} EXP)`,
    //             inline: false
    //         },

            
    //         {
    //             name: `Money ${emojis.money}`,
    //             value: `$${utils.numberWithCommas(res.money)}`,
    //             inline: false
    //         },

    //         {
            
    //             name: `Shards ${emojis.shard}`,
    //             value: `${utils.numberWithCommas(res.shards)}`,
    //             inline: false
    //         },
            
    //         {
            
    //             name: `Messages ${emojis.message}`,
    //             value: `${utils.numberWithCommas(res.messagesWritten)}`,
    //             inline: false
    //         }
    //     ]

    //     const embed = {
    //         color: 0x3236a8,
    //         title: `📊 ${message.author.tag}'s account statistics`,
    //         thumbnail: {
    //             url: message.author.displayAvatarURL()
    //         },
    
    //         fields: statsFields, 

    //         footer: {
    //             text: 'Eastern Games BOT',
    //             icon_url: "https://imgur.com/1nqnLxd.png"
    //         }
    //     }   

    //     message.reply({ embeds: [embed] });
    // });
}

module.exports = {execute};