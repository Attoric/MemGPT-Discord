import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import fetch from 'node-fetch';
import config from '../config.json' assert { type: 'json' };

const { memgpt_url, admin_role_id } = config;

export const data = new SlashCommandBuilder()
    .setName('ai')
    .setDescription('ai stuff!')
    .addSubcommandGroup(group => group
        .setName('data')
        .setDescription('agent options stuff and stats!')
        .addSubcommand(subcommand => subcommand
            .setName('agent_list')
            .setDescription('List all the agents')
        )
        .addSubcommand(subcommand => subcommand
            .setName('memory')
            .setDescription('get agent memory')
            .addStringOption(option => option
                .setName('agent')
                .setDescription('agent to get stats for')
                .setRequired(true))
        )
    )
    .addSubcommandGroup(group => group
        .setName('create')
        .setDescription('create agents, personas, and humans!')
        .addSubcommand(subcommand => subcommand
            .setName('agent')
            .setDescription('create an agent')
            .addStringOption(option => option
                .setName('agent')
                .setDescription('agent to create')
                .setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName('persona')
            .setDescription('create a persona')
            .addStringOption(option => option
                .setName('persona')
                .setDescription('persona to create')
                .setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName('human')
            .setDescription('create a human')
            .addStringOption(option => option
                .setName('human')
                .setDescription('human to create')
                .setRequired(true))
        )
    );
export async function execute(interaction, client) {

    //if user is not apart of the admin role tell them they do not have access to this command
    if (!interaction.member.roles.cache.has(admin_role_id)) {
        return interaction.reply('You do not have access to this command.');
    }

    //get subcommand group
    const subcommandGroup = interaction.options.getSubcommandGroup();
    //get subcommand
    const subcommand = interaction.options.getSubcommand();

    console.log(subcommandGroup);
    console.log(subcommand);


    //if subcommand group is data and subcommand is agent list
    if (subcommandGroup === 'data' && subcommand === 'agent_list' ) {
        const url = new URL(MemGPTHost + '/agents');
        url.searchParams.append('user_id', 'null');


        const response = await fetch(url, {
            method: 'get',
            headers: { 'Content-Type': 'application/json' },
        });
        const json = await response.json();
        console.log(json);

        let agentList = '';
        for (let i = 0; i < json.num_agents; i++) {
            agentList += json.agent_names[i] + '\n';
        }
        console.log(agentList);

        //build embed
        const embed = new EmbedBuilder()
            .setTitle('AI stats')
            .setDescription(`List of agents:\n${agentList}`)
            .setColor('#0099ff')
            .setTimestamp();

        //reply with embed
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    //if subcommand group is data and subcommand is stats
    if (subcommandGroup === 'data' && subcommand === 'memory') {
        const agent = interaction.options.getString('agent');
        const url = new URL(MemGPTHost + '/agents/memory');
        url.searchParams.append('user_id', 'null');
        url.searchParams.append('agent_id', interaction.options.getString('agent'));

        const response = await fetch(url, {
            method: 'get',
            headers: { 'Content-Type': 'application/json' },
        });
        const json = await response.json();
        console.log(json);

        let core_memory_human = json.core_memory['human'];
        let core_memory_persona = json.core_memory['persona'];
        let recall_memory = json.recall_memory;
        let archival_memory = json.archival_memory;

        console.log(core_memory_human);
        console.log(core_memory_persona);
        console.log(recall_memory);
        console.log(archival_memory);

        //build embed
        const embed = new EmbedBuilder()
            .setTitle('AI stats')
            .setDescription(`Memory stats for agent ${agent}:\n\nCore Memory:\nHuman: ${core_memory_human}\nPersona: ${core_memory_persona}\n\nRecall Memory: ${recall_memory}\n\nArchival Memory: ${archival_memory}`)
            .setColor('#0099ff')
            .setTimestamp();

        //reply with embed
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    //if subcommand group is create and subcommand is agent
    if (subcommandGroup === 'create' && subcommand === 'agent') {
        const agent = interaction.options.getString('agent');
        const url = new URL(memgpt_url + '/agents');
        //TODO: refactor when storage is implemented per user ID
        const body = {
            "user_id" : 'null',
            "agent_id": agent,
            "command" : 'create'
        }

        const response = await fetch(url, {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        });



        const json = await response.json();
        console.log(json);

        //build embed
        const embed = new EmbedBuilder()
            .setTitle('AI stats')
            .setDescription(`Created agent ${agent}`)
            .setColor('#0099ff')
            .setTimestamp();

        //reply with embed
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

}