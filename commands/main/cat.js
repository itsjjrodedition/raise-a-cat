const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType, PermissionFlagsBits } = require('discord.js');

const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoClient = new MongoClient(process.env.mongodburi, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const colorConverter = require('@j-dotjs/color-code-converter');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Display or create your cat can be used in DM\'s and Servers!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(true),
    async execute(interaction) {

        await mongoClient.connect().then(async () => {

            if (!interaction.guild) {
                await interaction.deferReply();
                await interaction.editReply({ content: 'Dm cats are a wip' });
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
                    .setTitle(`${cat.name} [Level ${cat.stats.level}]`)
                    .setDescription( `<@${cat.lastInteraction.user}> ${cat.lastInteraction.type} <t:${Math.floor(cat.lastInteraction.timestamp / 1000)}:R>`)
                    .setColor(colorConverter.getHexStr(`${cat.embedColor}`))
                    .setImage("https://i.imgur.com/5QHrYk8.png")

                const careButton = new ButtonBuilder()
                    .setCustomId('care')
                    .setLabel(`Care for ${cat.name}!`)
                    .setStyle(ButtonStyle.Primary)


                const statsButton = new ButtonBuilder()
                    .setCustomId('stats')
                    .setLabel(`${cat.name}\'s Stats`)
                    .setStyle(ButtonStyle.Secondary)

                const catButtonRow = new ActionRowBuilder().addComponents(careButton, statsButton)

                interaction.reply({ embeds: [catEmbed], components: [catButtonRow] })
            }
        })

    },
};

async function chooseCat(interaction) {
    const shelter = require(process.cwd() + "/functions/shelter.js");

    const shelterEmbed = new EmbedBuilder()
        .setImage('https://i.imgur.com/MywcWi0.png');

    const beginButton = new ButtonBuilder()
        .setCustomId('begin')
        .setLabel('Begin!')
        .setStyle(ButtonStyle.Primary);

    const beginButtonRow = new ActionRowBuilder().addComponents(beginButton);

    await interaction.reply({ embeds: [shelterEmbed], components: [beginButtonRow] })

    const buttonCollector = interaction.channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 120000,
        filter: (i) => i.user.id === interaction.user.id
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