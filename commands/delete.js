const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

require('dotenv').config()

const audit = require('../functions/audit.js')
const resetCat = require('../functions/resetCat.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Deletes the cat assigned to the server/user.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageGuild)
        .setDMPermission(true),

    async execute(interaction, client, mongoClient) {
        if(!interaction.guild){
            const db = mongoClient.db(process.env.personalcatdb)
            const collection = db.collection(process.env.personalcatcollection)
            
            resetCat.execute(interaction, collection, client)
        } else if(interaction.guild){
            const db = mongoClient.db(process.env.db)
            const collection = db.collection(process.env.collection)

            resetCat.execute(interaction, collection, client)
        }
    }
}
