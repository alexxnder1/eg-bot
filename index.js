const { GatewayIntentBits } = require('discord.js');
const Discord = require('discord.js');

const path = require('path');
const fs = require('fs');

const eventPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'));

require('./db/main');

require('dotenv').config();

const Client = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildScheduledEvents
    ],

    fetchAllMembers: true,
    partials: [Discord.Partials.Channel, Discord.Partials.Reaction, Discord.Partials.Message, Discord.Partials.User, Discord.Partials.GuildMember],
});

// default
Client.activityIndex = 0;

Client.on('ready', () => {
    console.log("[BOT] Application started.");

    setInterval(() => {
        Client.activityIndex ++;
        if(Client.activityIndex == 2)
            Client.activityIndex = 0;

        Client.user.setActivity((Client.activityIndex) ? ('use `eg! help` for more commands') : ('discord.gg/easterngames'));
    }, 30000);

    require('./timers/muteTimer').execute();
    require('./timers/banTimer').execute();
});

for(const file of eventFiles)
{
    Client.on(file.split('.js')[0], (arg) => {
        const event = require(`./events/${file}`);
        event.execute(arg);
    });
}

module.exports = Client;
Client.login(process.env.TOKEN);