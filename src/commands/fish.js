const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { numberWithCommas, returnSkillUpPoints } = require('../../utils');
const userModel = require('../db/schemas/userSchema');
const fs = require('fs');
const path = require('path');

const data = new SlashCommandBuilder()
    .setName('fish')
    .setDescription('You can start fishing and get your big prizes by typing this command.')

const fishes = {
    names: [],
    phase: [],
    prices: [] 
}

var fishingUsers = [];

const fishPath = path.join(__dirname, "../../assets/fishes/");
const files = fs.readdirSync(fishPath).filter(file => file.endsWith('.png'));
for(const file of files) {
    let name = file.split('.png')[0].replaceAll('_', ' ');
    let price = name.split('-')[1];
    name = name.split('-')[0];
    name = name.charAt(0).toUpperCase() + name.slice(1);

    fishes.names.push(name);
    fishes.prices.push(price);
}

fishes.prices.forEach((price) => {
    let id = fishes.prices.indexOf(price);
    fishes.phase.push(Math.round(id / 5));
});

async function execute(int) {
    if(fishingUsers.find((user) => user == int.user.id))
        return int.reply({ content: 'You already have thrown the fishing rod.', ephemeral: true });
    
    const embed = {
        color: 0x3297a8,
        title: '🐟 Throwing the fishing rod ...',
        description: 'Please wait.',
        author: {
            name: int.user.username,
            icon_url: int.user.displayAvatarURL()
        }
    }

    fishingUsers.push(int.user.id);

    await int.reply({ embeds: [embed], ephemeral: true });
    setTimeout(() => {
        userModel.findOne({ discord_id: int.user.id }, (err, res) => {
            if(err) return console.log(err);

            if(!res.skills.length)
                res.skills.push({ name: 'Fisherman', points: 0, skill: 1 });

            // skill + rand(10) = 20
            var fishes_with_phase = [];
            const phase = Math.round((Math.floor(Math.random() * 101)) / 25);
            fishes.phase.forEach((p) => {
                if(p == phase)
                    fishes_with_phase.push(fishes.phase.indexOf(p));
            });

            const randomFish = fishes_with_phase[Math.floor(Math.random() * fishes_with_phase.length)];
            const fishName = fishes.names[randomFish];
            const fishPrice = fishes.prices[randomFish];

            res.skills[0].points++;

            let points = res.skills[0].points;
            if(points >= returnSkillUpPoints(res.skills[0].skill)) {
                res.skills[0].skill ++;
            }

            let skill = res.skills[0].skill;
            res.money = res.money + parseInt(fishPrice);
            
            let id = res.fishes.find((f) => f.name === fishName);
            if(id) {
                res.fishes[res.fishes.indexOf(id)].count ++;
            }

            else {
                res.fishes.push({
                    name: fishName,
                    price: fishPrice,
                    date: new Date().toUTCString(),
                    count: 1
                });
            }
            
            fishingUsers.splice(fishingUsers.indexOf(int.user.id));

            console.log(__dirname);
            var fishNameFormatted = '';
            const splitted = __dirname.split('src\\commands')[0];
            fishes.names.forEach((f) => {
                if(f === fishName) {
                    f = f.replace(' ', '_');
                    f += `-${fishPrice}.png`
                    fishNameFormatted = f;
                }
            });

            const fishPath = path.join(splitted, `assets/fishes/${fishNameFormatted}`);
            const attachment = new AttachmentBuilder(fishPath, fishNameFormatted);
            
            var skbonus = 0;
            if(skill > 1) 
                skbonus = skill * (parseInt(fishPrice) / 10);  

            const embed = {
                color: 0x4287f5,
                title: `${int.user.tag} caught ${fishName}!`,
                files: [
                    attachment
                ],
                thumbnail: {
                    url: `attachment://${fishNameFormatted}`
                },
                fields: [
                    {
                        name: `Earnings $${numberWithCommas(parseInt(fishPrice) + skbonus)}`,
                        value: `Base Price: $${numberWithCommas(fishPrice)}`
                    },

                    {
                        name: `Skill ${skill}`,
                        value: `${numberWithCommas(points)}/${numberWithCommas(returnSkillUpPoints(skill))} points`
                    },
                ]
            }

            if(skill > 1) {
                res.money = res.money + skbonus;
                embed.fields[0].value += `\nSkill Bonus: $${numberWithCommas(skbonus)}`;
            }
            
            int.followUp({ embeds: [embed], files: [fishPath] });
            res.save();
        })
    }, 5000);
}

module.exports = { execute, data };