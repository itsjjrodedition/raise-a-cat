const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports =
{
    name: 'nameCat',
    execute: async (interaction) => {
        const modal = new ModalBuilder()
            .setCustomId('catMaker')
            .setTitle('Create a cat!');
            
        const nameInput = new TextInputBuilder()
            .setCustomId('name')
            .setLabel('Name:')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter your cat\'s name!')
            .setRequired(true);
        
        const actionRow = new ActionRowBuilder().addComponents(nameInput);
        modal.addComponents(actionRow);
        await interaction.showModal(modal);
    },
}