const { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');

require('dotenv').config()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('color')
        .setDescription('Change the color of the embed message!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageGuild)
        .setDMPermission(true),
    async execute(interaction, client, mongoClient) {
        const selectMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('color')
                    .setPlaceholder('Select a color')
                    .addOptions([
                        {
                            label: 'Red',
                            value: 'red',
                        },
                        {
                            label: 'Green',
                            value: 'green',
                        },
                        {
                            label: 'Blue',
                            value: 'blue',
                        },
                        {
                            label: 'Yellow',
                            value: 'yellow',
                        },
                        {
                            label: 'Purple',
                            value: 'purple',
                        },
                        {
                            label: 'Orange',
                            value: 'orange',
                        },
                        {
                            label: 'Pink',
                            value: 'pink',
                        },
                        {
                            label: 'White',
                            value: 'white',
                        },
                        {
                            label: 'Black',
                            value: 'black',
                        },
                        {   label: 'Default',
                            value: 'default',
                        },
                        {
                            label: "I don't like colors",
                            value: 'idontlikecolors',
                        },
                        {
                            label: 'Random',
                            value: 'random',
                        },
                    ]),
            );
        await interaction.reply({ content: 'Select a color', components: [selectMenu], ephemeral: true });
    },
};