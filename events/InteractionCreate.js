const { Events, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoClient = new MongoClient(process.env.mongodburi, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const colorConverter = require('@j-dotjs/color-code-converter');

const stats = require(process.cwd() + "/functions/stats.js");
const care = require(process.cwd() + "/functions/care.js");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
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

		if (interaction.isButton()) {
			if (interaction.customId === 'care') {
				care.execute(interaction);
			}
			if (interaction.customId === 'stats') {
				stats.execute(interaction);
			}
		}

		if (interaction.isModalSubmit()) {
			if (interaction.customId === 'catNamer') {
				await interaction.deferReply();

				await mongoClient.connect().then(async () => {
					const query = { guild: interaction.guild.id }
					const db = mongoClient.db(process.env.db)
					const collection = db.collection(process.env.collection)

					collection.updateOne(query, {
						$set: {
							name: interaction.fields.getTextInputValue('name'),
							stats: {
								level: 1,
								hunger: 100,
								thirst: 100,
								hygiene: 100,
								energy: 100,
								happiness: 100,
								bladder: 100,
							},
							location: 'livingroom',
							lastInteraction: { "type": "created cat", "timestamp": Date.now(), "user": interaction.user.id },
						}
					}).then(async () => {
						const license = new EmbedBuilder()
							.setTitle('𝒞𝑒𝓇𝓉𝒾𝒻𝒾𝒸𝒶𝓉𝑒  𝑜𝒻  𝒜𝒹𝑜𝓅𝓉𝒾𝑜𝓃')
							.setColor(colorConverter.getHexStr("blue"))
							.setThumbnail('https://i.imgur.com/BmFjgVm.png')
							.setDescription(`Congratulations on adopting your new cat \`${interaction.fields.getTextInputValue('name')}\`!\n\n\`${interaction.fields.getTextInputValue('name')}\` is waiting for you! Run </cat:1068277148181340170> again to display your new cat!`)

						await interaction.editReply({ embeds: [license], ephemeral: false })
					})
				})

			}
		}
	},
};
