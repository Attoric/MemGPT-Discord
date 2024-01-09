import { readdirSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { join, dirname } from 'path';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Require the necessary discord.js classes
import { Client, Collection, Events, GatewayIntentBits, ActivityType, TextInputStyle, Partials } from 'discord.js';
import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType, PermissionsBitField, ModalBuilder, TextInputComponent, StringSelectMenuBuilder, SelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder } from 'discord.js';
import config from './config.json' assert { type: 'json' };

const { discord_token, discord_application_id, channel_id, memgpt_url, agent_id } = config;

// Create a new client instance
const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.DirectMessageTyping
    ],
    partials: [
      Partials.Message,
      Partials.Channel,
      Partials.Reaction
    ],
  });

// Load commands:
client.commands = new Collection();

const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const fileURL = pathToFileURL(filePath);
    const command = await import(fileURL);


    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
    else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, async c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);

    // Set watching status
    client.user.setActivity('for messages to reply to!', { type: ActivityType.Watching });

    // DB Stuff
    // try {
    // 	// to allow alter on sync, add { alter: true } to the sync function
    // 	await sequelize.sync({ alter: true }).then(() => {
    // 		console.log('Database & tables created!');
    // 	});
    // }
    // catch (error) {
    // 	console.error('Failed to create database and tables:', error);
    // }

    //interval to check for scheduled messages, default 1 hr
    // 1000ms * 60s * 60m = 1hr
    const interval = 1000 * 60 * 60; 
    setInterval(() => {
        
    }, interval);
});

//Listen for messages, log them in the console for testing
client.on('messageCreate', async message => {
    var lowercaseMessage = message.content.toLowerCase();
    
    if (((message.channelId === channel_id) && message.author.id !== discord_application_id)  || (message.channel.type === ChannelType.DM && message.author.id !== discord_application_id) ) {
        console.log('AI Reply triggered');
        console.log(lowercaseMessage);
        const agent = agent_id;

        let afterMessage = '';
        //Remove all of the content before the last thought balloon
        afterMessage = message.content.replace(/.*:thought_balloon:/g, '');
        //Remove the thought balloon from the message
        afterMessage = afterMessage.replace(/:thought_balloon:/g, '');
        console.log('afterMessage: ' + afterMessage);

        //if the message starts with # then its a command, so don't reply
        if (message.content.startsWith('#') || afterMessage == '') {

        } else {
            //thinking
            if(message.channel.type != ChannelType.DM) {
                message.react('🤔');    
            }
            message.channel.sendTyping();

            // get the message author
            const author = message.author;

            // get the message content and remove the mention
            var messageContent = message.content.replace('<@' + discord_application_id + '>', '');
            messageContent = messageContent.trim();
            //prepend the user info to the message
            messageContent = 'User: ' + author.username + ' says: ' + messageContent;
            console.log(messageContent);

            try {
                // send the message to the AI
                var json = await generateAIMessage(messageContent, agent);
                // TODO: Refactor the inner monologue and assistant message assignment to be more dynamic, incase the position of the messages changes
                // Lets loop through the messages and find the inner monologue and assistant message
                var innerDialog = '';
                var aiMessage = '';

                // if json.messages is undefined, then we should get the detail from json
                if (!json.messages) {
                    innerDialog = 'There was an error, please try wording your message differently.';
                    // aiMessage = json.detail;
                } else {
                    json.messages.forEach(message => {
                        if (message.internal_monologue) {
                            innerDialog = message.internal_monologue;
                        }
                        if (message.assistant_message) {
                            aiMessage = message.assistant_message;
                        }
                    });
                }

                let finalMessage = '';
                // now lets format the message so the inner dialog is italicized and has thought bubbles around it
                finalMessage = '*(' + agent + ')*:\n:thought_balloon: *' + innerDialog + '* :thought_balloon: \n' + ' ' + aiMessage + ' ';

                //replace the thinking with check on message
                //if its a DM then remove the thinking emoji this way
                if (message.channel.type === ChannelType.DM) {
                    message.react('✅');
                } else {
                    message.reactions.cache.get('🤔').remove();
                }
                message.react('✅');
                // send the message to the channel
                return message.reply(finalMessage);
            } catch (error) {
                // do nothing
                console.log('Error sending message to AI\n' + error);
                message.react('❌');
            }
        }
    }

});


async function saveAIMessages(agent) {
    const url = memgpt_url + '/agents/command';

    const body = {
        user_id: 'null',
        agent_id: agent,
        command: 'save',
    };

    try {
        const response = await fetch(url, {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        });

        const json = await response.json();
        console.log(json);
    } catch {
        console.log('Error saving AI messages');
    }
}

async function checkScheduledMessages() {

}

async function generateAIMessage(prompt, agent) {
    const url = memgpt_url + '/agents/message';

    const body = {
        user_id: 'null',
        agent_id: agent,
        message: prompt,
        stream: false,
    };

    const response = await fetch(url, {
        method: 'post',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    });
    const json = await response.json();
    console.log(json);
    return json;
}

// Login to Discord with the token
client.login(discord_token);