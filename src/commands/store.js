const utils = require('../../utils');
const userModel = require('../db/schemas/userSchema');
const { SelectMenuBuilder, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('store')
    .setDescription('Access the bot store.')

const wallpapers = {
    fields: [],
    data: [
        {
            name: 'RGB Hexagonal Architecture',
            link: 'https://imgur.com/uOqgThE.png', 
            shard: 1000,
            money: 100000000,
            active: false
        },
        
        {
            name: 'Tree Portal',
            link: 'https://imgur.com/RUxJvlw.png',
            shard: 150,
            money: 15000000,
            active: false
        },

        {
            name: 'Glowing Deer',
            link: 'https://imgur.com/SC8udeK.png',
            shard: 100,
            money: 10000000,
            active: false
        },

        
        {
            name: 'Nighttime',
            link: 'https://imgur.com/yEJjs3M.png',
            shard: 70,
            money: 7000000,
            active: false
        },
        
        {
            name: 'Mountain Panorama',
            link: 'https://imgur.com/AUy53GE.png',
            shard: 40,
            money: 4000000,
            active: false
        },

        {
            name: 'Green Mars',
            link: 'https://imgur.com/1Hr5efE.png',
            shard: 27,
            money: 2500000,
            active: false
        },
                
        {
            name: 'Destroyed Planet',
            link: 'https://imgur.com/j0OQAF4.png',
            shard: 20,
            money: 2000000,
            active: false
        },

        {
            name: 'Park Alley',
            link: 'https://imgur.com/t4l2H07.png',
            shard: 12,
            money: 1200000,
            active: false
        },

        {
            name: 'Pink Planet Collapse',
            link: 'https://imgur.com/hupoCOh.png',
            shard: 8,
            money: 800000,
            active: false
        },

        {
            name: 'Night Mountains Sky',
            link: 'https://imgur.com/Na29EW8.png',
            shard: 3.5,
            money: 350000,
            active: false
        },
        
        {
            name: 'Zombie Graveyard',
            link: 'http://imgur.com/n4kfOZA.png',
            shard: 1,
            money: 100000,
            active: false
        },

        {
            name: 'Warm Colors',
            link: 'https://imgur.com/LYJCGmx.png',
            shard: 0.5,
            money: 50000,
            active: false
        }
    ]
}

var options = [];

wallpapers.data.forEach((wallpaper) => {
    let currencies = `$${utils.numberWithCommas(wallpaper.money)} / ${wallpaper.shard} shards`;
    let id = wallpapers.data.indexOf(wallpaper) + 1;
    wallpapers.fields.push(`${id}. [${wallpaper.name}](${wallpaper.link}) - ${currencies}`);
    options.push({
        label: wallpaper.name,
        description: currencies,
        value: `shop_wallpapers_${id}`
    })    
});

const wallpaperCategory  = {
    name: 'Profile Wallpapers',
    value: wallpapers.fields.join('\n')
}

const embed = {
    title: `Store`,
    color: 0x2cde00,
    fields: [wallpaperCategory]
}

module.exports = {
    wallpapers,
    embed,
    data,
    execute : int => {
        const row = new ActionRowBuilder()  
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('store-select')
                    .setPlaceholder('Nothing')
                    .addOptions(options)
                    .setMinValues(1)
                    .setMaxValues(wallpapers.data.length)
            )

        int.reply({ embeds: [embed], components: [row], ephemeral: true});
    } 
}