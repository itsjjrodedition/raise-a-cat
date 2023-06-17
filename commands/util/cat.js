const { SlashCommandBuilder } = require('discord.js');

require('dotenv').config()

const catShowCreate = require('../../functions/createCat.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Display or create your cat can be used in DM\'s and Servers!')
        .setDMPermission(true),
    async execute(interaction, client, mongoClient) {

        if(!interaction.guild){
            const perdb = mongoClient.db(process.env.db)
            var percollection = perdb.collection(process.env.approveduserscollection)
            var perquery = { userid: interaction.user.id }
            var user = (await percollection.distinct("userid", perquery)).toString()

            if(user){
                percollection = perdb.collection(process.env.personalcatcollection)
                perquery = { userid: interaction.user.id }
               
                var guild = false
                
                catShowCreate.execute(interaction, percollection, perquery, guild, client, mongoClient)

            } else{
                interaction.reply({
                    content: "You do not own the personal cat expansion, you can buy it in the official discord!"
                })
            }
        }else if(interaction.guild){
            const db = mongoClient.db(process.env.db)
            const collection = db.collection(process.env.collection)
            const query = { guildid: interaction.member.guild.id }

            var guild = true
            
            catShowCreate.execute(interaction, collection, query, guild, client, mongoClient)
        }
    },
};
