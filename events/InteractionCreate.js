const { Events, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const { MongoClient, ServerApiVersion } = require('mongodb');
const { ignoreRoot } = require('nodemon/lib/config/defaults');
const mongoClient = new MongoClient(process.env.mongodburi, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const colorConverter = require('@j-dotjs/color-code-converter');

const nameCat = require(process.cwd() + "/functions/nameCat.js");
const stats = require(process.cwd() + "/functions/stats.js");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand())
		{
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		}

		if(interaction.isButton())
		{
			if(interaction.customId === 'previous' || interaction.customId === 'next' || interaction.customId === 'select' || interaction.customId === 'begin')
			{
				if(interaction.customId != 'select')
				{
					interaction.deferUpdate();
				}

				const shelterCat1 = new EmbedBuilder()
					.setTitle('Cat 1')
					.setImage('https://i.imgur.com/5QHrYk8.png');
					
				const shelterCat2 = new EmbedBuilder()
					.setTitle('Cat 2')
					.setImage('https://i.imgur.com/5QHrYk8.png');
				
				const shelterCat3 = new EmbedBuilder()
					.setTitle('Cat 3')
					.setImage('https://i.imgur.com/5QHrYk8.png');
				
				const shelterCat4 = new EmbedBuilder()
					.setTitle('Cat 4')
					.setImage('https://i.imgur.com/5QHrYk8.png');

				const shelterCat5 = new EmbedBuilder()
					.setTitle('Cat 5')
					.setImage('https://i.imgur.com/5QHrYk8.png');

    			const selectButton = new ButtonBuilder()
    			    .setCustomId('select')
    			    .setLabel('Select')
    			    .setStyle(ButtonStyle.Secondary);

    			const activePreviousButton = new ButtonBuilder()
    			    .setCustomId('previous')
    			    .setLabel('Previous')
    			    .setStyle(ButtonStyle.Primary);

    			const activeNextButton = new ButtonBuilder()
    			    .setCustomId('next')
    			    .setLabel('Next')
    			    .setStyle(ButtonStyle.Primary);

    			const activeButtonRow = new ActionRowBuilder().addComponents(activePreviousButton, selectButton, activeNextButton);

    			const deactivePreviousButton = new ButtonBuilder()
    			    .setCustomId('previous')
    			    .setLabel('Previous')
    			    .setStyle(ButtonStyle.Primary)
    			    .setDisabled(true);

    			const deactiveNextButton = new ButtonBuilder()
    			    .setCustomId('next')
    			    .setLabel('Next')
    			    .setStyle(ButtonStyle.Primary)
    			    .setDisabled(true);

    			const deactivePreviousButtonRow = new ActionRowBuilder().addComponents(deactivePreviousButton, selectButton, activeNextButton);

    			const deactiveNextButtonRow = new ActionRowBuilder().addComponents(activePreviousButton, selectButton, deactiveNextButton);		

				if(interaction.customId === 'begin')
				{
					interaction.message.edit({ embeds: [shelterCat1], components: [deactivePreviousButtonRow] });
				}

				if(interaction.message.embeds[0].title == shelterCat1.data.title)
				{
					if(interaction.customId === 'next')
					{
						interaction.message.edit({ embeds: [shelterCat2], components: [activeButtonRow] });
					}
				} 
				else if(interaction.message.embeds[0].title == shelterCat2.data.title)
				{
					if(interaction.customId === 'next')
					{
						interaction.message.edit({ embeds: [shelterCat3], components: [activeButtonRow] });
					}
					else if(interaction.customId === 'previous')
					{
						interaction.message.edit({ embeds: [shelterCat1], components: [deactivePreviousButtonRow] });
					}
				} 
				else if(interaction.message.embeds[0].title == shelterCat3.data.title)
				{
					if(interaction.customId === 'next')
					{
						interaction.message.edit({ embeds: [shelterCat4], components: [activeButtonRow] });
					}
					else if(interaction.customId === 'previous')
					{
						interaction.message.edit({ embeds: [shelterCat2], components: [activeButtonRow] });
					}
				} 
				else if(interaction.message.embeds[0].title == shelterCat4.data.title)
				{
					if(interaction.customId === 'next')
					{
						interaction.message.edit({ embeds: [shelterCat5], components: [deactiveNextButtonRow] });
					}
					else if(interaction.customId === 'previous')
					{
						interaction.message.edit({ embeds: [shelterCat3], components: [activeButtonRow] });
					}
				}
				else if(interaction.message.embeds[0].title == shelterCat5.data.title)
				{
					if(interaction.customId === 'previous')
					{
						interaction.message.edit({ embeds: [shelterCat4], components: [activeButtonRow] });
					}
				}

				if(interaction.customId === 'select')
				{
					mongoClient.connect().then(async () => {
						const query = { guild: interaction.guild.id }
						const db = mongoClient.db(process.env.db)
						const collection = db.collection(process.env.collection)

						collection.insertOne({
							guild: interaction.guild.id,
							color: interaction.message.embeds[0].title
						})
					}).finally(() => {
						nameCat.execute(interaction);
					})
				}
			}
			if(interaction.customId === 'refresh')
			{
				
			}
			if(interaction.customId === 'stats')
			{
				stats.execute(interaction);
			}
		}

		if(interaction.isModalSubmit())
		{
			if(interaction.customId === 'catMaker'){
				await interaction.deferReply();

				await mongoClient.connect().then(async () => {
					const query = { guild: interaction.guild.id }
            		const db = mongoClient.db(process.env.db)
            		const collection = db.collection(process.env.collection)

					collection.updateOne(query, {
						$set: {
							name: interaction.fields.getTextInputValue('name'),
							hunger: 100,
							thirst: 100,
							hygiene: 100,
							energy: 100,
							level: 1,
					}
					}).then(async () => {
						const license = new EmbedBuilder()
							.setTitle('𝒞𝑒𝓇𝓉𝒾𝒻𝒾𝒸𝒶𝓉𝑒  𝑜𝒻  𝒜𝒹𝑜𝓅𝓉𝒾𝑜𝓃')
							.setColor(colorConverter.getHexStr("blue"))
							.setThumbnail('https://cdn.discordapp.com/attachments/1153154274822467715/1153156391612203078/IMG_1484.png')
							.setDescription(`Congratulations on adopting your new cat \`${interaction.fields.getTextInputValue('name')}\`!\n
							\`${interaction.fields.getTextInputValue('name')}\` is waiting for you! Run </cat:1068277148181340170> again to display your new cat!`)

						await interaction.editReply({ embeds: [license], ephemeral: false })
					})
				})
			}
		}
	},
};
