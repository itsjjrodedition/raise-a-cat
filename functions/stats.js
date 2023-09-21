const { Events, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

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
                .setTitle(`${catStats.name} Stats`)
                .setColor(colorConverter.getHexStr("purple"))
                .addFields(
                    { name: 'Hunger', value: `${catStats.hunger}`, inline: true },
                    { name: 'Thirst', value: `${catStats.thirst}`, inline: true },
                    { name: 'Hygiene', value: `${catStats.hygiene}`, inline: true },
                    { name: 'Energy', value: `${catStats.energy}`, inline: true }
                )
            interaction.reply({ embeds: [catStatsEmbed], ephemeral: true })

        })
    }
}