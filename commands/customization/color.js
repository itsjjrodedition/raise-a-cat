const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoClient = new MongoClient(process.env.mongodburi, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('color')
        .setDescription('Change the color of your cat embed!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('color')
                .setDescription('The color of your desired cat embed')
                .addChoices(
                    { name: 'Blue', value: 'blue' },
                    { name: 'Green', value: 'green' },
                    { name: 'Red', value: 'red' },
                    { name: 'Purple', value: 'purple' },
                    { name: 'Orange', value: 'orange' },
                    { name: 'Yellow', value: 'yellow' },
                    { name: 'Pink', value: 'pink' },
                    { name: 'Brown', value: 'brown' },
                    { name: 'Black', value: 'black' }
                )
                .setRequired(true)),

    async execute(interaction) {

        await mongoClient.connect().then(async () => {

            const query = { guild: interaction.guild.id }
            const db = mongoClient.db(process.env.db)
            const collection = db.collection(process.env.collection)

            const cat = await collection.findOne(query)

            if (!cat) return interaction.reply({ content: 'You have\'t adopted a cat yet', ephemeral: true })

            const color = interaction.options.getString('color')

            await collection.updateOne(query, { $set: { embedColor: color } })
        })

        await interaction.reply({ content: 'Color changed!', ephemeral: true });
    },
}