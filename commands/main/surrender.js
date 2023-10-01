const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');


const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoClient = new MongoClient(process.env.mongodburi, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('surrender')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(true)
        .setDescription('Surrender your cat :('),
    async execute(interaction) {
        await mongoClient.connect().then(async () => {
            const query = { guild: interaction.guild.id }
            const db = mongoClient.db(process.env.db)
            const collection = db.collection(process.env.collection)

            const cat = await collection.findOne(query)

            if (cat) {
                interaction.reply(`\`${cat.name}\` has been surrendered`)
                collection.deleteOne(query)
            }
            else {
                interaction.reply('You do not have a cat to surrender')
            }
        })
    },
}