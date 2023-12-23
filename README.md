# MemGPT-Discord
This repo powers a DiscordJS Bot connection to a MemGPT API.

MemGPT - https://github.com/cpacker/MemGPT


# Prerequistes

Using our hosted bot:
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

# Contributing

Feel free to open a PR if you'd like to contribute to the project. We're always looking for more people to help out! 
I am also fairly new to this so if you see something that could be done better please let me know!