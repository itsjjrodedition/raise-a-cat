const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoClient = new MongoClient(process.env.mongodburi, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

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
                var query = { name: { $exists: true }}
                const db = mongoClient.db(process.env.db)
                const collection = db.collection(process.env.collection)

                const cat = await collection.findOne(query)

                if (!cat) {
                    query = { guild: interaction.guild.id }
                    collection.deleteOne(query)
                    return chooseCat(interaction)
                } 

                const catEmbed = new EmbedBuilder()
                    .setTitle(`${cat.name} [Level ${cat.level}]`)
                    .setImage("https://i.imgur.com/5QHrYk8.png")

                const statsButton = new ButtonBuilder()
                    .setCustomId('stats')
                    .setLabel('Stats')
                    .setStyle(ButtonStyle.Primary)

                const refreshButton = new ButtonBuilder()
                    .setCustomId('refresh')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🔄')

                const catButtonRow = new ActionRowBuilder().addComponents(statsButton, refreshButton)

                interaction.reply({ embeds: [catEmbed], components: [catButtonRow] })
            }
        })

    },
};

async function chooseCat(interaction) {
    const shelter = require(process.cwd() + "/functions/shelter.js");

    const shelterEmbed = new EmbedBuilder()
        .setTitle('Choose a cat!')
        .setImage('https://i.imgur.com/MywcWi0.png');

    const beginButton = new ButtonBuilder()
        .setCustomId('begin')
        .setLabel('Begin!')
        .setStyle(ButtonStyle.Primary);

    const beginButtonRow = new ActionRowBuilder().addComponents(beginButton);

    await interaction.reply({ embeds: [shelterEmbed], components: [beginButtonRow], ephemeral: true })

    const buttonCollector = interaction.channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 120000
    })

    buttonCollector.on('collect', async (interaction) => {
        if (interaction.customId === 'begin') {
            await interaction.deferUpdate();
            buttonCollector.stop();
        }
    })

    buttonCollector.on('end', async (collected) => {
        shelter.execute(interaction);
        beginButtonRow.components[0].setDisabled(true);
        interaction.editReply({ components: [beginButtonRow] });
    })
}