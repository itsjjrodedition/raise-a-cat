const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

require('dotenv').config()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dmexpansion')
        .setDescription('Approve or revoke a user to use the DM expansion')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option.setName('action')
                  .setRequired(true)
                  .setDescription('The action of the command')
                  .addChoices(
                    { name: 'Add user', value: 'add' },
                    { name: 'Remove user', value: 'remove' },
                  ))
        .addUserOption(option =>
          option
              .setName('user')
              .setDescription('The member to add/revoke')
              .setRequired(true)),
    async execute(interaction, client, mongoClient) {
        const db = mongoClient.db(process.env.db)
        const collection = db.collection(process.env.approveduserscollection)
        const query = { userid: interaction.options.getUser('user').id };
        var user = (await collection.distinct("userid", query)).toString()

        if(!user){
            if(interaction.options.getString('action') === 'add'){
                await collection.insertMany([{ userid: interaction.options.getUser('user').id }])
                const query = { userid: interaction.options.getUser('user').id };
                const update = { $set: { tag: interaction.options.getUser('user').tag } };
                collection.updateOne(query, update)
                interaction.reply({
                    content: `User ${interaction.options.getUser('user')} has been granted access to the DM expansion!`,
                    ephemeral:true
                })
            } else if(interaction.options.getString('action') === 'remove'){
                interaction.reply({
                    content: `User ${interaction.options.getUser('user')} does not own the DM expansion.`,
                    ephemeral:true
                })
            }
        } else if(user){
            if(interaction.options.getString('action') === 'add'){
                interaction.reply({
                    content: `User ${interaction.options.getUser('user')} is already approved to use the DM expansion!`,
                    ephemeral:true
                })
            } else if(interaction.options.getString('action') === 'remove'){
                await collection.deleteOne({ userid: interaction.options.getUser('user').id })
                interaction.reply({
                    content: `User ${interaction.options.getUser('user')} has been revoked access.`,
                    ephemeral:true
                })
            }
        }

    }
}