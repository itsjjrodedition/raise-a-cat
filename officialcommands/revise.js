const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

require('dotenv').config()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('revise')
        .setDescription('Revise all existing cats')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('function')
                .setRequired(true)
                .setDescription('The function to run')
                .addChoices(
                    { name: 'add', value: 'add' },
                    { name: 'remove', value: 'remove' },
                )
        )
        .addStringOption(option =>
            option.setName('attribute')
                .setRequired(true)
                .setDescription('The attribute to add'),
        )
        .addStringOption(option =>
            option.setName('stringvalue')
                .setRequired(false)
                .setDescription('String value for the attribute'),
        )
        .addIntegerOption(option =>
            option.setName('integervalue')
                .setRequired(false)
                .setDescription('Integer value for the attribute (use string for 0 or decimal values)'),
        ),
    async execute(interaction, client, mongoClient) {
        const perdb = mongoClient.db(process.env.personalcatdb)
        const percollection = perdb.collection(process.env.personalcatcollection)

        const db = mongoClient.db(process.env.db)
        const collection = db.collection(process.env.collection)

        if(interaction.options.getString('function') == 'add'){ 
            if(!interaction.options.getInteger('integervalue') & !interaction.options.getString('stringvalue')){
                interaction.reply({ content: 'Please provide a value for the attribute', ephemeral: true }) 
                return
            } else {
                if(interaction.options.getString('stringvalue') === '0' || interaction.options.getString('stringvalue').indexOf('.') !== -1){
                    var string = parseFloat(interaction.options.getString('stringvalue'))
                }
                const filter = { name: { $exists: true } }
                const updateDoc = {
                    $set: {
                        [interaction.options.getString('attribute')]: interaction.options.getInteger('integervalue') || string
                    }
                }
            
                const result = await collection.updateMany(filter, updateDoc);
                const result2 = await percollection.updateMany(filter, updateDoc);
            
                interaction.reply({ content: `Added \`${interaction.options.getString('attribute')}\` to \`${result.modifiedCount + result2.modifiedCount} documents\``, ephemeral: true }) 
            }
        } else if(interaction.options.getString('function') == 'remove'){
            const filter = { name: { $exists: true } }
                const updateDoc = {
                    $unset: {
                        [interaction.options.getString('attribute')]: ""
                    }
                }
            
                const result = await collection.updateMany(filter, updateDoc);
                const result2 = await percollection.updateMany(filter, updateDoc);
            
                interaction.reply({ content: `Removed \`${interaction.options.getString('attribute')}\` from \`${result.modifiedCount + result2.modifiedCount} documents\``, ephemeral: true }) 
            }
    }
}