const { REST, Routes } = require('discord.js');
require('dotenv').config()
const fs = require('node:fs');

const globalCommands = [];
const globalCommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const officialCommands = [];
const officialCommandFiles = fs.readdirSync('./officialcommands').filter(file => file.endsWith('.js'));

for (const file of globalCommandFiles) {
	const command = require(`./commands/${file}`);
	globalCommands.push(command.data.toJSON());
}

for (const file of officialCommandFiles) {
	const command = require(`./officialcommands/${file}`);
	officialCommands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.token);

(async () => {
	try {
		console.log(`Started refreshing ${globalCommands.length} global (/) command(s).`);

		const globaldata = await rest.put(
			Routes.applicationCommands(process.env.clientId),
			{ body: globalCommands },
		);

		console.log(`Successfully reloaded ${globaldata.length} global (/) command(s).`);

		console.log(`Started refreshing ${officialCommands.length} official guild (/) command(s).`);

		const officialdata = await rest.put(
			Routes.applicationGuildCommands(process.env.clientId, process.env.officialguildid),
			{ body: officialCommands },
		);

		console.log(`Successfully reloaded ${officialdata.length} official guild (/) command(s).`);
        if(process.env.privateguildid){
			const privateguilddata = await rest.put(
				Routes.applicationGuildCommands(process.env.clientId, process.env.privateguildid),
				{ body: officialCommands },
			);

			console.log(`Successfully reloaded ${privateguilddata.length} private guild (/) command(s).`);
        }
	} catch (error) {
		console.error(error);
	}
})();
