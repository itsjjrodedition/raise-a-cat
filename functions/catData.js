const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

require('dotenv').config()

async function execute(collection, query, interaction) {
    var catName = (await collection.distinct("name", query)).toString()
    var age = (await collection.distinct("age", query)).toString()
    var hunger = (await collection.distinct("hunger", query)).toString()
    var thirst = (await collection.distinct("thirst", query)).toString()
    var rest = (await collection.distinct("rest", query)).toString()
    var bladder = (await collection.distinct("bladder", query)).toString()
    var mood = (await collection.distinct("mood", query)).toString()
    var cleanliness = (await collection.distinct("cleanliness", query)).toString()
    var lastInteraction = (await collection.distinct("lastInteraction", query)).toString()
    var lastInteractionTime = (await collection.distinct("lastInteractionTime", query)).toString()
    var lastInteractionUser = (await collection.distinct("lastInteractionUser", query)).toString()
    var embedColor = (await collection.distinct("color", query)).toString() || "0x0099FF"
    
    if(lastInteraction === 'play'){
        lastInteraction = `played with \`${catName}\``
    } else if(lastInteraction === 'pet'){
        lastInteraction = `pat \`${catName}\``
    } else if(lastInteraction === 'feed'){
        lastInteraction = `fed \`${catName}\``
    } else if(lastInteraction === 'water'){
        lastInteraction = `gave water to \`${catName}\``
    } else if(lastInteraction === 'clean'){
        lastInteraction = `cleaned \`${catName}\``
    } 

    const buttons1 = new ActionRowBuilder()
        .addComponents(
        	new ButtonBuilder()
        		.setCustomId('play')
        		.setStyle(ButtonStyle.Success)
                .setLabel('Play'),
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('pet')
                .setStyle(ButtonStyle.Success)
                .setLabel('Pet'),
        );
    const buttons2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('feed')
                .setStyle(ButtonStyle.Primary)
                .setLabel('Feed'),
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('water')
                .setStyle(ButtonStyle.Primary)
                .setLabel('Give water'),
        );
        
    const buttons3 = new ActionRowBuilder()
        .addComponents(
        	new ButtonBuilder()
        		.setCustomId('refresh')
                .setEmoji('🔄')
        		.setStyle(ButtonStyle.Secondary),
        );
    
    const disabledButtons1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('play')    
                .setStyle(ButtonStyle.Success)
                .setLabel('Play')
                .setDisabled(true),
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('pet')
                .setStyle(ButtonStyle.Success)
                .setLabel('Pet')
                .setDisabled(true),
        );
    
    const disabledButtons2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('feed')
                .setStyle(ButtonStyle.Primary)
                .setLabel('Feed')
                .setDisabled(true),
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('water')
                .setStyle(ButtonStyle.Primary)
                .setLabel('Give water')
                .setDisabled(true),
        );

    const disabledButtons3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('refresh')
                .setEmoji('🔄')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),
        );
        
    if(!catName){
        const catDisplayEmbed = new EmbedBuilder()
        return { catDisplayEmbed, buttons1, buttons2, buttons3, catName, age, hunger, thirst, rest, bladder, mood, cleanliness, disabledButtons1, disabledButtons2, disabledButtons3 }
    }

    const catDisplayEmbed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle(`**${catName}**`)

        .addFields(
            { name: '__Age__', value: `${age}`, inline: true },
            { name: '__Hunger__', value: `${hunger}/100`, inline: true },
            { name: '__Thirst__', value: `${thirst}/100`, inline: true },
        )
        .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: '__Rest__', value: `${rest}/100`, inline: true},
            { name: '__Bladder__', value: `${bladder}/100`, inline: true },
            { name: '__Mood__', value: `${mood}`, inline: true },
        )
        .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: '__Cleanliness__', value: `${cleanliness}/100`, inline: true },
        )

        if(interaction.guildId === process.env.officialguildid){
            catDisplayEmbed.setImage('https://i.imgur.com/GS9TBbK.png')
        } else {
            catDisplayEmbed.setImage('https://i.imgur.com/dkG5D8n.png')
        }

        if(lastInteraction){
            catDisplayEmbed.setDescription(`<@${lastInteractionUser}> ${lastInteraction} <t:${lastInteractionTime}:R>`)
        }

    return { catDisplayEmbed, buttons1, buttons2, buttons3, catName, age, hunger, thirst, rest, bladder, mood, cleanliness, disabledButtons1, disabledButtons2, disabledButtons3 }
}

module.exports = { execute }
