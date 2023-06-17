const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

require('dotenv').config()

const changeValue = require('../../functions/changeValue.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('name')
        .setDescription('Change your cats name')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The new name you want to give your cat')
                .setRequired(true)
        ),
    async execute(interaction, client, mongoClient) {
        const db = mongoClient.db(process.env.db)
        const collection = db.collection(process.env.collection)
        const query = { guildid: interaction.guild.id }

        changeValue.execute(interaction, collection, query, interaction.options.getString('name'), "name")

        await interaction.reply({
            content: `Your cat's name has been changed to \`${interaction.options.getString('name')}\``,
            ephemeral: true
        })
    }
};