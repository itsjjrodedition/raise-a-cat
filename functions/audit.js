const { EmbedBuilder } = require('discord.js');

async function createAudit(interaction, client, catName) {
    const catCreateAudit = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`Cat created`)
        .setDescription(`Cat name: ${catName}\nCat creator: ${interaction.user.username}\nisServer: ${interaction.guildId ? true : false}\nGuild/Server: ${interaction.guildId ? interaction.guild.name : 'N/A'}\n`)
        .setAuthor({ name: `${interaction.guildId ? interaction.guild.name : interaction.user.username}`, iconURL: `${interaction.guildId ? interaction.guild.iconURL() : interaction.user.displayAvatarURL()}` })
    client.channels.cache.get('1074730218914332683').send({ embeds: [catCreateAudit] });

}
async function deleteAudit(interaction, client){
    const catDeleteAudit = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`Cat deleted`)
        .setDescription(`Cat deleter: ${interaction.user.username}\nGuild/Server: ${interaction.guildId ? interaction.guild.name : 'N/A'}\nisServer: ${interaction.guildId ? true : false}\nRemoved from server?: ${interaction.guildId ? interaction.options.getString('removebot') : 'N/A' }`)
        .setAuthor({ name: `${interaction.guildId ? interaction.guild.name : interaction.user.username}`, iconURL: `${interaction.guildId ? interaction.guild.iconURL() : interaction.user.displayAvatarURL()}` })
    client.channels.cache.get('1074730218914332683').send({ embeds: [catDeleteAudit] });
}


module.exports= { createAudit, deleteAudit }