# MemGPT-DiscordJS
MemGPT - [Website](https://memgpt.ai/) | [Docs](https://memgpt.readme.io/docs) | [Github](https://github.com/cpacker/MemGPT)

Disclaimer: This is not the bot used in the official MemGPT Discord Server.

This project is maintained by Sane from Attoric Games.

Attoric - [Website](https://attoric.net) | [Discord](https://discord.gg/attoric)

# Features
Current:
- Multi-turn conversation in one discord channel, and using one agent_id reply to any messages posted by any user or bot in that channel except for itself.
- You can also use the prefix # to your message in the channel so the bot does not reply to it.
![img](https://i.gyazo.com/f196ae7a40517e80a565596b6d58ffaf.png)

Coming soon:
- Per user agents
- Changing the channel wide agent on the fly
- Editing memory and more.

I plan on enabling this bot to perform all functions available via the MemGPT API.

# Prerequistes

Using our hosted bot: (Coming soon)
- A MemGPT endpoint to connect to

For self hosting: 

(If you'd like to self-host to modify the bot and need a host Attoric also offers custom bot-hosting)
- A MemGPT endpoint to connect to
- A discord bot (for tokens and such)
    - Must enable the following:
        - Message Content Intent
        - Scopes: applications.commands, bot
        - Bot permissions: Send Messages, Manage Messages, Read Message History, Embed Links, Attach Files, Add Reactions
- NodeJS
- NPM

# Setup Guide

1. Clone the repo
2. Run `npm ci`
3. copy `example-config.json` to  `config.json` and fill in the variables for your environment 
4. Run `node index.js`

# Support

If you need help with the bot or have any questions feel free to join:
- Attoric discord server for direct bot support: https://discord.gg/attoric
- MemGPT support join the MemGPT discord server: https://discord.gg/wuQuyZ8dR6

# Contributing

Feel free to open a PR if you'd like to contribute to the project. We're always looking for more people to help out! 
I am also fairly new to this so if you see something that could be done better please let me know!
