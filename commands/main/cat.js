const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoClient = new MongoClient(process.env.mongodburi, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

require('dotenv').config()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Display or create your cat can be used in DM\'s and Servers!')
        .setDMPermission(true),
    async execute(interaction) {

        await mongoClient.connect().then(async () => {

            if (!interaction.guild) {
                return
            } else {
                const query = { guild: interaction.guild.id }
                const db = mongoClient.db(process.env.db)
                const collection = db.collection(process.env.collection)

                const cat = await collection.findOne(query)

                if (!cat) return chooseCat(interaction)

                const catEmbed = new EmbedBuilder()
                    .setTitle(`${cat.name} [Level ${cat.level}]`)
                    .setImage("https://i.imgur.com/5QHrYk8.png")

                const statsButton = new ButtonBuilder()
                    .setCustomId('stats')
                    .setLabel('Stats')
                    .setStyle(ButtonStyle.Primary)

                const controlButton = new ButtonBuilder()
                    .setCustomId('control')
                    .setLabel('Control')
                    .setStyle(ButtonStyle.Danger)

                const refreshButton = new ButtonBuilder()
                    .setCustomId('refresh')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🔄')

                const catButtonRow = new ActionRowBuilder().addComponents(statsButton, controlButton)
                const catRefreshButtonRow = new ActionRowBuilder().addComponents(refreshButton)

                interaction.reply({ embeds: [catEmbed], components: [catButtonRow, catRefreshButtonRow] })
            }
        })

    },
};

async function chooseCat(interaction) {
    const shelter = new EmbedBuilder()
        .setTitle('Choose a cat!')
        .setImage('https://i.imgur.com/5QHrYk8.png');

    const beginButton = new ButtonBuilder()
        .setCustomId('begin')
        .setLabel('Begin!')
        .setStyle(ButtonStyle.Primary);

    const beginButtonRow = new ActionRowBuilder().addComponents(beginButton);

    await interaction.reply({ embeds: [shelter], components: [beginButtonRow] });
}