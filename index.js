const { GatewayIntentBits } = require('discord.js');
const Discord = require('discord.js');

const path = require('path');
const fs = require('fs');

const cmdPath = path.join(__dirname, "commands");
const files = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'));

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

Client.on('messageCreate', (message) => {
    if(message.author.bot || !message.content.startsWith(process.env.PREFIX))
        return false;

    const messageSplitted = message.content.split(`${process.env.PREFIX} `);
    const cmd = files.filter((file) => file.split('.js')[0] === messageSplitted[1]);
    if(!cmd.length)
        return message.reply("**Beep, boop, beep!** That command doesn't exists! :robot:")

    const fileCmd = require(`./commands/${cmd}`);
    fileCmd.execute(message);
});

Client.login(process.env.TOKEN);