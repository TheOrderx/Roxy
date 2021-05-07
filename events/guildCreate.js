module.exports = async (client,guild) => {
	const owner = client.users.resolve(client.config.Bot.Owners[0]);
	const prefix = await client.Prefix(guild.id);

	guild.members.cache.get(guild.owner.id).send({ embed: {
		color: `RANDOM`,
		description: `**Beni eklediğin için teşekkürler!\nYapımcım: ${owner.username}#${owner.discriminator}\nTüm komutları görmek için -> \`\`${prefix}yardım\`\`\nDestek sunucusu için [TIKLA](https://discord.gg/hd4V65b)**`,
		thumbnail: `${guild.iconURL()}`,
		title: `Merhaba!`
	}}).catch(err => { console.log(err); });
}