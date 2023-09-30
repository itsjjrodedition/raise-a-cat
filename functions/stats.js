const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');

const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoClient = new MongoClient(process.env.mongodburi, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const colorConverter = require('@j-dotjs/color-code-converter');

module.exports = {
    name: 'stats',
    execute: async (interaction) => {

        mongoClient.connect().then(async () => {
            const query = { guild: interaction.guild.id }
            const db = mongoClient.db(process.env.db)
            const collection = db.collection(process.env.collection)

            const catStats = await collection.findOne(query)

            const catStatsEmbed = new EmbedBuilder()
                .setTitle(`${catStats.name} (${catStats.color})`)
                .setColor(colorConverter.getHexStr("green"))

            const statsNext = new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Next')
                .setStyle(ButtonStyle.Secondary)

            const statsPrevious = new ButtonBuilder()
                .setCustomId('previous')
                .setLabel('Previous')
                .setStyle(ButtonStyle.Secondary)

            const statsControls = new ActionRowBuilder().addComponents(statsPrevious, statsNext)
            statsControls.components[0].setDisabled(true)

            catStatsEmbed.setFields([
                { name: 'Hunger', value: `${catStats.hunger}%`, inline: false },
                { name: 'Thirst', value: `${catStats.thirst}%`, inline: false },
                { name: 'Hygiene', value: `${catStats.hygiene}%`, inline: false },
                { name: 'Energy', value: `${catStats.energy}%`, inline: false },
            ])

            interaction.reply({ embeds: [catStatsEmbed], components: [statsControls], ephemeral: true }).then(() => {
                const buttonCollector = interaction.channel.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: 60000,
                    filter: i => i.user.id === interaction.user.id
                })

                buttonCollector.on('collect', async (button) => {
                    if (button.user.id === interaction.user.id) {
                        if (button.customId === 'next') {
                            statsControls.components[0].setDisabled(false)
                            statsControls.components[1].setDisabled(true)

                            catStatsEmbed.setFields([

                            ])
                            button.deferUpdate()
                            interaction.editReply({ embeds: [catStatsEmbed], components: [statsControls], ephemeral: true })

                        } else if(button.customId === 'previous') {
                            statsControls.components[0].setDisabled(true)
                            statsControls.components[1].setDisabled(false)

                            catStatsEmbed.setFields([
                                { name: 'Hunger', value: `${catStats.hunger}%`, inline: false },
                                { name: 'Thirst', value: `${catStats.thirst}%`, inline: false },
                                { name: 'Hygiene', value: `${catStats.hygiene}%`, inline: false },
                                { name: 'Energy', value: `${catStats.energy}%`, inline: false },
                            ])
                            button.deferUpdate()
                            interaction.editReply({ embeds: [catStatsEmbed], components: [statsControls], ephemeral: true })
                        }
                    }
                })

                buttonCollector.on('end', () => {
                    statsControls.components[0].setDisabled(true)
                    statsControls.components[1].setDisabled(true)

                    interaction.editReply({ embeds: [catStatsEmbed], components: [statsControls], ephemeral: true })

                })
            })

        })
    }
}
