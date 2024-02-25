const { ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');

const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoClient = new MongoClient(process.env.mongodburi, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const playFunction = require('./CareFunctions/play.js');
const feedFunction = require('./CareFunctions/feed.js');
const waterFunction = require('./CareFunctions/water.js');
const petFunction = require('./CareFunctions/pet.js');

module.exports = {
    name: 'care',
    execute: async (interaction) => {

        mongoClient.connect().then(async () => {
            const query = { guild: interaction.guild.id }
            const db = mongoClient.db(process.env.db)
            const collection = db.collection(process.env.collection)

            const cat = await collection.findOne(query)

            const feed = new ButtonBuilder()
                .setCustomId('feed')
                .setLabel(`Feed ${cat.name}`)
                .setStyle(ButtonStyle.Success)

            const water = new ButtonBuilder()
                .setCustomId('water')
                .setLabel(`Give ${cat.name} water`)
                .setStyle(ButtonStyle.Primary)

            const play = new ButtonBuilder()
                .setCustomId('play')
                .setLabel(`Play with ${cat.name}`)
                .setStyle(ButtonStyle.Secondary)

            const pet = new ButtonBuilder()
                .setCustomId('pet')
                .setLabel(`Pet ${cat.name}`)
                .setStyle(ButtonStyle.Secondary)

            if(cat.location === 'livingroom') {
                feed.setDisabled(true)
                water.setDisabled(true)
            } else if(cat.location === 'kitchen') {
                play.setDisabled(true)
                pet.setDisabled(true)
            } else if(cat.location === 'bedroom') {
                water.setDisabled(true)
                feed.setDisabled(true)
            }

            const careControls = new ActionRowBuilder().addComponents(feed, water, play, pet)

            await interaction.reply({ components: [careControls], ephemeral: true }).then(() => {
                const buttonCollector = interaction.channel.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: 60000
                })

                buttonCollector.on('collect', async (button) => {
                    if (button.user.id === interaction.user.id) {
                        if (button.customId === 'feed') {
                            await feedFunction.execute(interaction, cat)
                            buttonCollector.stop()
                        }
                        if (button.customId === 'water') {
                            await waterFunction.execute(interaction, cat)
                            buttonCollector.stop()
                        }
                        if (button.customId === 'play') {
                            await playFunction.execute(interaction, cat)
                            buttonCollector.stop()
                        }
                        if (button.customId === 'pet') {
                            await petFunction.execute(interaction, cat)
                            buttonCollector.stop()
                        }
                        button.deferUpdate()
                        interaction.editReply({ components: [careControls], ephemeral: true })
                    }
                })

                buttonCollector.on('end', async (collected) => {
                    careControls.components[0].setDisabled(true)
                    careControls.components[1].setDisabled(true)
                    careControls.components[2].setDisabled(true)
                    careControls.components[3].setDisabled(true)

                    await interaction.editReply({ components: [careControls], ephemeral: true })
                })
            })
        })
    }
}