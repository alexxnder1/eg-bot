const userModel = require('../db/schemas/userSchema');
const Canvas  = require('@napi-rs/canvas');
const { numberWithCommas, returnGraduateProgressColor, returnLevelUpPoints } = require('../../utils');

const { createText, createProgressBar, createCanvasImage } = require('../frameworks/canvas');
const { AttachmentBuilder, SlashCommandBuilder, ContextMenuCommandAssertions } = require('discord.js');
const { GlobalFonts }  = require('@napi-rs/canvas');
const { getUsersSorted } = require('./rank.js');

const data = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Shows your account statistics')

async function execute(int) {   
    userModel.findOne({ discord_id: int.user.id }, async(err, res) => {
        if(err) return console.log(err);
        const canvas = Canvas.createCanvas(850, 480);
        const context = canvas.getContext('2d');
        
        GlobalFonts.registerFromPath('./assets/secular.ttf', 'secular');
        GlobalFonts.registerFromPath('./assets/oswald.ttf', 'oswald');
        GlobalFonts.registerFromPath('./assets/mw.ttf', 'mw');
        GlobalFonts.registerFromPath('./assets/paytone.ttf', 'pt');
        GlobalFonts.registerFromPath("./assets/anek.ttf", 'anek');
        GlobalFonts.registerFromPath("./assets/pal.ttf", 'ram');
    
        context.beginPath();
        context.arc(125, 125, 80, 0, Math.PI * 2, true);

        if(!res.wallpapers.length) {
            res.wallpapers.push({ name: 'Default', active: true });
            res.save();
        }

        res.wallpapers.forEach(async wallpaper => {
            if(wallpaper.active) {
                let img = wallpaper.name.toLowerCase().replaceAll(' ', '_');
                await createCanvasImage(Canvas, context, `./assets/cards/${img}.png`, 0, 0, canvas.width, canvas.height);

                // name
                createText(canvas, int.user.username, (canvas.width / 7), (canvas.height / 2), 35, 'anek', '#ffffff', 'center', false);
                
                // lvl
                createText(canvas, `LVL`, (canvas.width / 2), (canvas.height / 2.2), 35, 'ram', '#ffffff', 'center');
                createText(canvas, `${res.level}`, (canvas.width / 2), (canvas.height / 1.95), 35, 'ram', '#e3be07', 'center');
                
                // money
                let money = `$${numberWithCommas(res.money)}`;
                createText(canvas, `MONEY`, (canvas.width / 1.5), (canvas.height / 2.2), 35, 'ram', '#ffffff', 'center');
                createText(canvas, money, (canvas.width / 1.5), (canvas.height / 1.95), 35, 'ram', '#5ecc04', 'center');

                // shards
                let shard = `${numberWithCommas(res.shards)}`;
                createText(canvas, `SHARD`, (canvas.width / 1.15), (canvas.height / 2.2), 35, 'ram', '#ffffff', 'center');
                createText(canvas, shard, (canvas.width / 1.15), (canvas.height / 1.95), 35, 'ram', '#7904cc', 'center');
                
                // msg
                let msg = `${numberWithCommas(res.messagesWritten)}`;
                createText(canvas, `MSG`, (canvas.width / 1.5), (canvas.height / 1.6), 35, 'ram', '#ffffff', 'center');
                createText(canvas, msg, (canvas.width / 1.5), (canvas.height / 1.47), 35, 'ram', '#cf5d00', 'center');

                // progress bar 
                let text = `(${numberWithCommas(res.experience)}/${numberWithCommas(returnLevelUpPoints(res.level + 1))} EXP)`;
                createText(canvas, text, (canvas.width / 6.47), (canvas.height / 1.36), 30, 'secular', '#ffffff', 'center', false);
                
                let dif = res.experience - returnLevelUpPoints(res.level);
                let perc = ( dif / (returnLevelUpPoints(res.level + 1) - returnLevelUpPoints(res.level ))) * 100;
                let val = ((canvas.width / 4) * perc) / 100;
                createProgressBar(canvas, val, 30.47, 320, returnGraduateProgressColor(perc));

                let users = await getUsersSorted();
                let rank = 0;
                users.forEach((member) => {
                    if(member.discord_id == int.user.id) {
                        rank = users.indexOf(member) + 1;
                        createText(canvas, `#${rank}`, (canvas.width / 1.1), (canvas.height / 7), 45, 'oswald', '#e3be07', 'right', false);
                    }
                })

                           
                context.stroke();
                context.closePath();
                context.clip();

                await createCanvasImage(Canvas, context, int.member.displayAvatarURL({ extension: 'jpg' }), 25, 30, 200, 200);
                // 
                const attach = new AttachmentBuilder(await canvas.encode('png'), { name: `${int.user.username}_profile_card.jpg` });
                await int.reply({ files: [attach] });
            }
        })
        
    })
}

module.exports = { execute, data };