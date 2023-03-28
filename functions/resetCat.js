
require('dotenv').config()
const audit = require('../functions/audit.js')

const catData = require('../functions/catData.js')

const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

async function execute(interaction, collection, client) {

    if(!interaction.guild){
        var query = { userid: interaction.user.id };
    } else if(interaction.guild){
        var query = { guildid: interaction.member.guild.id };
    }

    const { catDisplayEmbed, buttons1, buttons2, buttons3, catName, age, hunger, thirst, rest, bladder, mood, cleanliness } = await catData.execute(collection, query, interaction)

    if(!catName){
        await interaction.reply({
            content: `No cat found! Run </cat:1068277148181340170> to create one :)`,
            embeds: [],
            components: [],
            ephemeral: true
        })
        return
    } else {

        const confirmEmbed = new EmbedBuilder()
            .setTitle('Confirm Deletion')
            .setDescription(`Are you sure you want to delete \`${catName}\`? This action cannot be undone.\nInfo: \nAge: \`${age}\` \nHunger: \`${hunger}\` \nThirst: \`${thirst}\` \nRest: \`${rest}\` \nBladder: \`${bladder}\` \nMood: \`${mood}\` \nCleanliness: \`${cleanliness}\``)
            .setColor(0xff0000)

        const confirmedEmbed = new EmbedBuilder()
            .setTitle('Deletion Confirmed')
            .setDescription(`\`${catName}\` has been deleted.`)
            .setColor(0xff0000)

        const confirmButton = new ButtonBuilder()
            .setCustomId('confirmReset')
            .setLabel('Confirm')
            .setEmoji('✅')
            .setStyle(ButtonStyle.Success)
        const cancelButton = new ButtonBuilder()
            .setCustomId('cancelReset')
            .setLabel('Cancel')
            .setEmoji('❌')
            .setStyle(ButtonStyle.Danger)

        const disabledConfirmButton = new ButtonBuilder()
            .setCustomId('confirmReset')
            .setLabel('Confirm')
            .setEmoji('✅')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true)
        const disabledCancelButton = new ButtonBuilder()
            .setCustomId('cancelReset')
            .setLabel('Cancel')
            .setEmoji('❌')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)

        const confirmRow = new ActionRowBuilder()
            .addComponents(confirmButton, cancelButton)

        const disabledActionRow = new ActionRowBuilder()
            .addComponents(disabledConfirmButton, disabledCancelButton)
        

        const confirmMessage = await interaction.reply({
            embeds: [confirmEmbed],
            components: [confirmRow],
            ephemeral: true
        })

        const filter = i => i.customId === 'confirmReset' || i.customId === 'cancelReset';

        // collector for the confirm/cancel buttons
        const collector = confirmMessage.createMessageComponentCollector({ filter, time: 15000 });

        var confirmed = false;

        collector.on('collect', async i => {
            if (i.customId === 'confirmReset') {
                await i.update({
                    embeds: [confirmedEmbed],
                    components: [disabledActionRow],
                    ephemeral: true
                })
                confirmed = true;
                collector.stop()
            } else if (i.customId === 'cancelReset') {
                await i.update({
                    embeds: [confirmedEmbed],
                    components: [disabledActionRow],
                    ephemeral: true
                })
                collector.stop()
            }
        })

        collector.on('end', async collected => {

            if(!confirmed){
                await interaction.editReply({
                    content: `Reset canceled.`,
                    embeds: [confirmEmbed],
                    components: [disabledActionRow],
                    ephemeral: true
                })
                return
            } else if(confirmed){
                if(!interaction.guild){
                    const userQuery = { userid: interaction.user.id };
                    await collection.deleteOne(userQuery);
                    audit.deleteAudit(interaction, client)
                } else if(interaction.guild){
                    const guildQuery = { guildid: interaction.member.guild.id };
                    await collection.deleteOne(guildQuery);
                    await collection.insertMany([{ guildid: interaction.member.guild.id }])
                    audit.deleteAudit(interaction, client)
                }
            }
        })
    }
}

module.exports = { execute };