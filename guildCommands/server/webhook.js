const webhook = require("webhook-discord");
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const {EOL} = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('webhook')
        .setDescription('Send a changelog webhook!')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('whatsnew')
                .setRequired(true)
                .setDescription('Whats new?')
        )
        .addStringOption(option =>
            option.setName('bugfixes')
                .setRequired(true)
                .setDescription('Bug fixes?')
        )
        .addStringOption(option =>
            option.setName('color')
                .setRequired(false)
                .setDescription('The color of the embed (hex) (default: #0099FF)')
                .addChoices(
                    { name: 'Red', value: '#ff0000' },
                    { name: 'Green', value: '#00ff00' },
                    { name: 'Blue', value: '#0000ff' },
                    { name: 'Yellow', value: '#ffff00' },
                    { name: 'Purple', value: '#ff00ff' },
                    { name: 'Cyan', value: '#00ffff' },
                    { name: 'White', value: '#ffffff' },
                    { name: 'Black', value: '#000000' },
                    { name: 'Orange', value: '#ff7f00' },
                    { name: 'Pink', value: '#ff1493' },
                    { name: 'Brown', value: '#a52a2a' },
                    { name: 'Grey', value: '#808080' },
                    { name: 'Light Grey', value: '#d3d3d3' },
                    { name: 'Dark Grey', value: '#a9a9a9' },
                )
        )
        .addStringOption(option =>
            option.setName('name')
                .setRequired(false)
                .setDescription('The name of the webhook (default: General Update)')
        ),
    async execute(interaction, client, mongoClient) {
        interaction.deferReply({ ephemeral: true })

        const Hook = new webhook.Webhook("https://discord.com/api/webhooks/1076627782190235700/um_dTgyIz7_uIo5DsO6ucjphxEKwVFfB4cjj_NfwSH7m5PeaMJBT48L68DwsyeOjiA1C");

        var color = interaction.options.getString('color') || "#0099FF"
        var name = interaction.options.getString('name') || "General Update"

        var whatsnew = interaction.options.getString('whatsnew').replace('EOL', '\n')
        var bugfixes = interaction.options.getString('bugfixes').replace('EOL', '\n')

        const msg = new webhook.MessageBuilder()
            .setName(name)
            .setColor(color)
            .setDescription(`__**What's new?**__\n${whatsnew}\n\n__**Bug fixes**__\n${bugfixes}`);
        await Hook.send(msg);

        interaction.editReply({ content: 'Sent webhook message!', ephemeral: true })
    },
};