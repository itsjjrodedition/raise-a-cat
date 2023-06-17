const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, Role } = require('discord.js');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoClient = new MongoClient(process.env.mongodburi, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const changeValue = require("./functions/changeValue.js");
const refresh = require("./functions/refreshMessage.js");
const play = require("./functions/play.js");
const feed = require("./functions/feed.js");
const water = require("./functions/water.js");

var lastInteraction;
var lastInteractionTime;
var lastInteractionUser;

const client = new Client( { intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent], ws: { properties: { browser: 'Discord' } }, });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		client.commands.set(command.data.name, command);
	}
}

client.once(Events.ClientReady, async () => {
	console.log(`Logged in as ${client.user.tag}`);

	const GuildIDs = client.guilds.cache.map(guild => guild.id);
	try{
		const db = mongoClient.db(process.env.db)
		const collection = db.collection(process.env.collection)
		
		for(let i=0; i<GuildIDs.length; i++){
			const filteredDocs = await collection.find({ guildid: GuildIDs[i] }).toArray();
			if(!filteredDocs.length){
				collection.insertMany([{ guildid: GuildIDs[i] }])
			}
		}
    }finally {
        
    }
});

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isChatInputCommand()){
		const command = client.commands.get(interaction.commandName);

		if (!command) return;
		try {
			await command.execute(interaction, client, mongoClient);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command... please report in <#1071633062884036608>', ephemeral: true });
		}
	} else if( interaction.isButton()){
		try{
			if(interaction.customId === 'confirmSubmit' || interaction.customId === 'cancelSubmit' || interaction.customId === 'confirmReset' || interaction.customId === 'cancelReset'){
				return
			}
			interaction.deferReply({ ephemeral: true })
			lastInteraction = interaction.customId
			lastInteractionTime = Date.parse(interaction.createdAt)/1000
			console.log(lastInteractionTime)
			lastInteractionUser = interaction.user.id

			var db = mongoClient.db(process.env.db);
			var collection;
			var query;
			var dmMessage;
			
			if(interaction.message.guild){
				collection = db.collection(process.env.collection)
				query = { guildid: interaction.member.guild.id }
				dmMessage = false
			} else {
				
				collection = db.collection(process.env.personalcatcollection)
				query = { userid: interaction.user.id }
				dmMessage = await client.channels.fetch(interaction.channelId)
				dmMessage = await dmMessage.messages.fetch(interaction.message.id)
			}
			if(interaction.customId != 'refresh'){
				changeValue.execute(interaction, collection, query, lastInteraction, "lastInteraction")
				changeValue.execute(interaction, collection, query, lastInteractionTime, "lastInteractionTime")
				changeValue.execute(interaction, collection, query, lastInteractionUser, "lastInteractionUser")
			}

            if(interaction.customId === 'refresh'){
				refresh.execute(interaction, collection, query) 
        	} else if(interaction.customId === 'play'){
				play.execute(interaction, collection, query)
			} else if(interaction.customId === 'feed'){
				feed.execute(interaction, collection, query)
			} else if(interaction.customId === 'water'){
				water.execute(interaction, collection, query)
			}

		} catch (error) {
			console.error(error);
			await interaction.editReply({ content: 'An error has occurred... please report in <#1071633062884036608>', ephemeral: true });
		} 
	} else if(interaction.isStringSelectMenu()){
		interaction.deferReply({ ephemeral: true })
		var query
		var db
		var collection
		if(interaction.message.guild){
        	collection = db.collection(process.env.collection)
			query = { guildid: interaction.member.guild.id }
		} else {
			collection = db.collection(process.env.personalcatcollection)
			query = { userid: interaction.user.id }
		}
		console.log(interaction.values[0])
		if(interaction.values[0] === 'red'){
			changeValue.execute(interaction, collection, query, '#ff0000', 'color')
		} else if(interaction.values[0] === 'blue'){
			changeValue.execute(interaction, collection, query, '#0000ff', 'color')
		} else if(interaction.values[0] === 'green'){
			changeValue.execute(interaction, collection, query, '#00ff00', 'color')
		} else if(interaction.values[0] === 'yellow'){
			changeValue.execute(interaction, collection, query, '#ffff00', 'color')
		} else if(interaction.values[0] === 'orange'){
			changeValue.execute(interaction, collection, query, '#ffa500', 'color')
		} else if(interaction.values[0] === 'purple'){
			changeValue.execute(interaction, collection, query, '#800080', 'color')
		} else if(interaction.values[0] === 'pink'){
			changeValue.execute(interaction, collection, query, '#ffc0cb', 'color')
		} else if(interaction.values[0] === 'default'){
			changeValue.execute(interaction, collection, query, '#ffffff', 'color', true)
		} else if(interaction.values[0] === 'idontlikecolors'){
			changeValue.execute(interaction, collection, query, '#2C2F33', 'color')
		} else if(interaction.values[0] === 'random'){
			changeValue.execute(interaction, collection, query, '#'+Math.floor(Math.random()*16777215).toString(16), 'color')
		} else if(interaction.values[0] === 'white'){
			changeValue.execute(interaction, collection, query, '#ffffff', 'color')
		} else if(interaction.values[0] === 'black'){
			changeValue.execute(interaction, collection, query, '#000000', 'color')
		}

		interaction.deleteReply()
	}
});
client.on(Events.GuildCreate, async guild => {
	const db = mongoClient.db(process.env.db)
	const collection = db.collection(process.env.collection)
	const filteredDocs = await collection.find({ guildid: guild.id }).toArray();
	if(!filteredDocs.length){
		collection.insertMany([{ guildid: guild.id }])
	}
})

client.on(Events.GuildDelete, async guild => {
	const db = mongoClient.db(process.env.db)
	const collection = db.collection(process.env.collection)
	const filteredDocs = await collection.find({ guildid: guild.id }).toArray();
	if(filteredDocs.length > 0){
		collection.deleteMany({ guildid: guild.id })
	}
});

client.on(Events.GuildMemberAdd, async member => {
	if(member.guild.id === "1070064549178384466"){
		var role = member.guild.roles.cache.find(role => role.name === 'Member')
		member.roles.add(role)
	}

});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.login(process.env.token);
