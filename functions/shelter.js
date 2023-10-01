const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoClient = new MongoClient(process.env.mongodburi, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

module.exports =
{
    name: 'shelter',
    execute: async (interaction) => {

        const shelterCat1 = new EmbedBuilder()
            .setTitle('Silver Tabby')
            .setImage('https://i.imgur.com/pTzTexP.png');

        const shelterCat2 = new EmbedBuilder()
            .setTitle('Orange Tabby')
            .setImage('https://i.imgur.com/L6CLrud.png');

        const shelterCat3 = new EmbedBuilder()
            .setTitle('White Tabby')
            .setImage('https://i.imgur.com/LPdrkI8.png');

        const shelterCat4 = new EmbedBuilder()
            .setTitle('Black Tabby')
            .setImage('https://i.imgur.com/seh8C4e.png');

        const shelterCat5 = new EmbedBuilder()
            .setTitle('Brown Tabby')
            .setImage('https://i.imgur.com/gCWPwhy.png');

        const selectButton = new ButtonBuilder()
            .setCustomId('select')
            .setLabel('Select')
            .setStyle(ButtonStyle.Secondary);

        const previousButton = new ButtonBuilder()
            .setCustomId('previous')
            .setLabel('Previous')
            .setStyle(ButtonStyle.Primary);

        const nextButton = new ButtonBuilder()
            .setCustomId('next')
            .setLabel('Next')
            .setStyle(ButtonStyle.Primary);

        const shelterButtonRow = new ActionRowBuilder().addComponents(previousButton, selectButton, nextButton);

        const buttonCollector = interaction.channel.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 300000,
            filter: (i) => i.user.id === interaction.user.id
        })

        shelterButtonRow.components[0].setDisabled(true);
        var message = await interaction.followUp({ embeds: [shelterCat1], components: [shelterButtonRow] })

        buttonCollector.on('collect', async (interaction) => {

            if (interaction.customId != 'select') {
                interaction.deferUpdate();
            }

            if (interaction.message.embeds[0].title == shelterCat1.data.title) {
                if (interaction.customId === 'next') {
                    shelterButtonRow.components[0].setDisabled(false);
                    interaction.message.edit({ embeds: [shelterCat2], components: [shelterButtonRow] });
                }
            }
            else if (interaction.message.embeds[0].title == shelterCat2.data.title) {
                if (interaction.customId === 'next') {
                    interaction.message.edit({ embeds: [shelterCat3], components: [shelterButtonRow] });
                }
                else if (interaction.customId === 'previous') {
                    shelterButtonRow.components[0].setDisabled(true);
                    interaction.message.edit({ embeds: [shelterCat1], components: [shelterButtonRow] });
                }
            }
            else if (interaction.message.embeds[0].title == shelterCat3.data.title) {
                if (interaction.customId === 'next') {
                    interaction.message.edit({ embeds: [shelterCat4], components: [shelterButtonRow] });
                }
                else if (interaction.customId === 'previous') {
                    interaction.message.edit({ embeds: [shelterCat2], components: [shelterButtonRow] });
                }
            }
            else if (interaction.message.embeds[0].title == shelterCat4.data.title) {
                if (interaction.customId === 'next') {
                    shelterButtonRow.components[2].setDisabled(true);
                    interaction.message.edit({ embeds: [shelterCat5], components: [shelterButtonRow] });
                }
                else if (interaction.customId === 'previous') {
                    interaction.message.edit({ embeds: [shelterCat3], components: [shelterButtonRow] });
                }
            }
            else if (interaction.message.embeds[0].title == shelterCat5.data.title) {
                if (interaction.customId === 'previous') {
                    shelterButtonRow.components[2].setDisabled(false);
                    interaction.message.edit({ embeds: [shelterCat4], components: [shelterButtonRow] });
                }
            }
    
            if (interaction.customId === 'select') {
                mongoClient.connect().then(async () => {
                    const query = { guild: interaction.guild.id }
                    const db = mongoClient.db(process.env.db)
                    const collection = db.collection(process.env.collection)
    
                    collection.insertOne({
                        guild: interaction.guild.id,
                        color: interaction.message.embeds[0].title
                    })
                }).finally(() => {
                    buttonCollector.stop();
                    nameCat(interaction);
                })
            }
        })

        buttonCollector.on('end', (interaction) => {
            shelterButtonRow.components[0].setDisabled(true);
            shelterButtonRow.components[1].setDisabled(true);
            shelterButtonRow.components[2].setDisabled(true);
            message.edit({ components: [shelterButtonRow] }).then(() => {
                setTimeout(() => {
                    message.delete()
                }, 5000)
            })
        })
    },
};

async function nameCat(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('catNamer')
        .setTitle('Name your new cat!');

    const nameInput = new TextInputBuilder()
        .setCustomId('name')
        .setLabel('Name:')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Enter your cat\'s name!')
        .setRequired(true);

    const actionRow = new ActionRowBuilder().addComponents(nameInput);
    modal.addComponents(actionRow);
    await interaction.showModal(modal);
}