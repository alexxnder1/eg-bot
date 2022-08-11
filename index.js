const Discord = require('discord.js');

const { GatewayIntentBits, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

const path = require('path');
const fs = require('fs');

const eventPath = path.join(__dirname, "src/events");
const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'));

require('dotenv').config();
require('./src/db/main');

var commands = [];

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

        Client.user.setActivity((Client.activityIndex) ? ('use `/help` for more commands') : ('discord.gg/easterngames'));
    }, 30000);

    require('./src/timers/muteTimer').execute();
    require('./src/timers/banTimer').execute();

    // require('./systems/level').generate_roles();
});

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const cmdPath = path.join(__dirname, "src/commands");
const cmdFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'));

for(const file of cmdFiles) {
    const fileCmd = require(`./src/commands/${file}`);
    commands.push(fileCmd.data.toJSON());        
}

const ClientId = "1000077848536678440";
const GuildId = "881118014366445578"; 

(async () => {
    try {
        await rest.put(
            Routes.applicationCommands(ClientId, GuildId),
            { body: commands }
        );

        console.log("Slash commands pushed into Discord API.");
    } catch(err) {
        console.error(err);
    }
})();

for(const file of eventFiles)
{
    Client.on(file.split('.js')[0], arg => {
        const event = require(`./src/events/${file}`);
        event.execute(arg);
    });
}

module.exports = Client;
Client.login(process.env.TOKEN);