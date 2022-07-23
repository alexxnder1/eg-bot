const { GatewayIntentBits } = require('discord.js');
const Discord = require('discord.js');

const path = require('path');
const fs = require('fs');

const eventPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'));

require('dotenv').config();
const Client = new Discord.Client({
    intents: [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildBans,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Discord.Partials.Channel],
});

Client.on('ready', () => {
    console.log("[BOT] Application started.");
    Client.user.setActivity(`Use 'eg! help' for commands.`);
});

for(const file of eventFiles)
{
    Client.on(file.split('.js')[0], (arg) => {
        const event = require(`./events/${file}`);
        event.execute(arg);
    });
}

Client.login(process.env.TOKEN);