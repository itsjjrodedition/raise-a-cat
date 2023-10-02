const { ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');

const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoClient = new MongoClient(process.env.mongodburi, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

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
                .setLabel(`Feed ${cat.name}!`)
                .setStyle(ButtonStyle.Success)

            const water = new ButtonBuilder()
                .setCustomId('water')
                .setLabel(`Give ${cat.name} a drink!`)
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
                            await care.feed(interaction, cat)
                        }
                        if (button.customId === 'water') {
                            await care.water(interaction, cat)
                        }
                        if (button.customId === 'play') {
                            await care.play(interaction, cat)
                        }
                        if (button.customId === 'pet') {
                            await care.pet(interaction, cat)
                        }
                        button.deferUpdate()
                        interaction.editReply({ components: [careControls], ephemeral: true })
                    }
                })
            })
        })
    }
}