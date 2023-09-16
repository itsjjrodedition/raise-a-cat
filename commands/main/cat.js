const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

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
            console.log('Connected to MongoDB');
        })

        if(!interaction.guild){
            return
        } else{
            const query = { guild: interaction.guild.id }
            const db = mongoClient.db(process.env.db)
            const collection = db.collection('cats')

            const cat = await collection.findOne(query)

            if(!cat) createCat(db, collection, interaction)

            return interaction.reply(cat)
        }

        await mongoClient.close();
    },
};

async function createCat(db, collection, interaction) {
    interaction.reply('Creating cat...', { ephemeral: true });
    const modal = new ModalBuilder()
        .setCustomId('catMaker')
        .setTitle('Create a cat!');
        
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