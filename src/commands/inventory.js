const userModel = require('../db/schemas/userSchema');
const { numberWithCommas } = require('../../utils');
const { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('All your items are stored here. You can check or use them.');

module.exports = {
    data,
    execute : async int => {
        userModel.findOne({ discord_id: int.user.id }, async(err, res) => {
            if(err) return console.error(err);

            var Wallpapers = [];
            var options = [];

            res.wallpapers.forEach((wallpaper) => {
                Wallpapers.push(`${!wallpaper.link ? 'Default' : `[${wallpaper.name}](${wallpaper.link})`} - active: **${wallpaper.active ? 'yes' : 'no'}**.`);
                options.push({ label: `${wallpaper.name} (wallpaper)`, value: `inv-wallpaper-${res.wallpapers.indexOf(wallpaper)}` });
            });

            let wallpaperValue = Wallpapers.join('\n');
            var wallpapersCategory = { name: 'Profile Wallpapers', value: wallpaperValue };

            let fishValue = [];
            
            if(!res.fishes.length)
                fishValue.push('-');

            res.fishes.forEach((fish) => {      
                let price = fish.price * fish.count;
                fishValue.push(`${fish.name} ${(fish.count) ? `[${fish.count}x]` : ''} - $${numberWithCommas(price)}`);
                options.push({ label: `${fish.name} (fish)`, value: `inv-fish-${res.fishes.indexOf(fish)}` });
            })

            var fishesCategory = { name: 'Fishes', value: fishValue.join('\n') }

            const embed = {
                color: 0x00b6c7,
                title: '🎒 Inventory',
                description: 'All your inventory items are here.',
                fields: [wallpapersCategory, fishesCategory]
            }

            const row = new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId('inventory-use')
                        .setMaxValues(1)
                        .addOptions(options)
                )

            await int.reply({embeds: [embed], components: [row], ephemeral: true});
        });    
    }
}