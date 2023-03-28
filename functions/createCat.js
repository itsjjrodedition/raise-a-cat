const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

require('dotenv').config()

const audit = require('../functions/audit.js')
const catData = require('../functions/catData.js')

async function execute(interaction, collection, query, guild, client) {
    let { catDisplayEmbed, buttons1, buttons2, buttons3, catName, age, hunger, thirst, rest, bladder, mood, cleanliness } = await catData.execute(collection, query, interaction)
    if(catName){
            interaction.reply({
                embeds: [catDisplayEmbed], 
                components: [buttons1, buttons2, buttons3]
            })
    }else{
        var filteredDocs;
        const modal = new ModalBuilder()
        .setCustomId('catMaker')
        .setTitle('Make your cat!');
        const catNameInput = new TextInputBuilder()
            .setCustomId('catNameSub')
            .setLabel("Name")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Enter cat's name here!")
            .setRequired(true);
        const firstActionRow = new ActionRowBuilder().addComponents(catNameInput);
        modal.addComponents(firstActionRow);
        await interaction.showModal(modal);
        await interaction.awaitModalSubmit({
            time: 8000,
            filter: i => i.user.id === interaction.user.id,
        }).then(async submitted => {
            await submitted.deferReply({ ephemeral: true });
            const confirmSubmit = new EmbedBuilder()
                .setTitle('Confirm Submission')
                .setDescription(`Are you sure you want to submit \`${submitted.fields.getTextInputValue('catNameSub')}\` as your cat's name?`)
                .setColor(0x00ff00)

            const confirmedEmbed = new EmbedBuilder()
                .setTitle('Submission Confirmed')
                .setDescription(`\`${submitted.fields.getTextInputValue('catNameSub')}\` has been submitted as your cat's name.`)
                .setColor(0x00ff00)


            const confirmButton = new ButtonBuilder()
                .setCustomId('confirmSubmit')
                .setLabel('Confirm')
                .setEmoji('✅')
                .setStyle(ButtonStyle.Success)
            const cancelButton = new ButtonBuilder()
                .setCustomId('cancelSubmit')
                .setLabel('Cancel')
                .setEmoji('❌')
                .setStyle(ButtonStyle.Danger)

            const disabledConfirmButton = new ButtonBuilder()
                .setCustomId('confirmSubmit')
                .setLabel('Confirm')
                .setEmoji('✅')
                .setStyle(ButtonStyle.Success)
                .setDisabled(true)
            const disabledCancelButton = new ButtonBuilder()
                .setCustomId('cancelSubmit')
                .setLabel('Cancel')
                .setEmoji('❌')
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true)

            const disabledActionRow = new ActionRowBuilder().addComponents(disabledConfirmButton, disabledCancelButton);
            const confirmActionRow = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

            const reply = await submitted.editReply({
                embeds: [confirmSubmit],
                components: [confirmActionRow],
                ephemeral: true
            })

            const collector = reply.createMessageComponentCollector({ time: 3500 });

            var confirmed = false;

            collector.on('collect', async i => {
                if (i.customId === 'confirmSubmit') {
                    await i.update({
                        embeds: [confirmedEmbed],
                        components: [disabledActionRow],
                        ephemeral: true
                    })
                    confirmed = true;
                    collector.stop()
                } else if (i.customId === 'cancelSubmit') {
                    await i.update({
                        embeds: [confirmedEmbed],
                        components: [disabledActionRow],
                        ephemeral: true
                    })
                    collector.stop()
                }
            })

            const catNameSub = submitted.fields.getTextInputValue('catNameSub');

            collector.on('end', async collected => {
                if(guild){
                    if(!confirmed){
                        return
                    }
                    filteredDocs = await collection.find({ guildid: interaction.member.guild.id }).toArray();
                    if(filteredDocs.length){
                        collection.updateOne({ guildid: interaction.member.guild.id }, { $set: { name: catNameSub } })
                        collection.updateOne({ guildid: interaction.member.guild.id }, { $set: { age: 0.0 } })
                        collection.updateOne({ guildid: interaction.member.guild.id }, { $set: { hunger: 100 } })
                        collection.updateOne({ guildid: interaction.member.guild.id }, { $set: { thirst: 100 } })
                        collection.updateOne({ guildid: interaction.member.guild.id }, { $set: { rest: 100 } })
                        collection.updateOne({ guildid: interaction.member.guild.id }, { $set: { bladder: 0 } })
                        collection.updateOne({ guildid: interaction.member.guild.id }, { $set: { mood: 4 } })
                        collection.updateOne({ guildid: interaction.member.guild.id }, { $set: { cleanliness: 100 } })
                        audit.createAudit(interaction, client, catNameSub)
                    }
                } else {
                    if(!confirmed){
                        return
                    }
                    filteredDocs = await collection.find({ userid: interaction.user.id }).toArray();
                    if(filteredDocs.length === 0){
                       await collection.insertMany([{ userid: interaction.user.id }])
                       filteredDocs = await collection.find({ userid: interaction.user.id }).toArray();
                    }
                    if(filteredDocs.length){
                        collection.updateOne({ userid: interaction.user.id }, { $set: { name: catNameSub } })
                        collection.updateOne({ userid: interaction.user.id }, { $set: { age: 0 } })
                        collection.updateOne({ userid: interaction.user.id }, { $set: { hunger: 100 } })
                        collection.updateOne({ userid: interaction.user.id }, { $set: { thirst: 100 } })
                        collection.updateOne({ userid: interaction.user.id }, { $set: { rest: 100 } })
                        collection.updateOne({ userid: interaction.user.id }, { $set: { bladder: 0 } })
                        collection.updateOne({ userid: interaction.user.id }, { $set: { mood: "happy" } })
                        collection.updateOne({ userid: interaction.user.id }, { $set: { cleanliness: 100 } })
                        audit.createAudit(interaction, client, catNameSub)
                    }
                }
            })


        }).catch(error => {
            console.error(error)
            interaction.followUp({ content: 'No input received.', ephemeral: true })
            return null
        })
    }
}


module.exports = { execute };
