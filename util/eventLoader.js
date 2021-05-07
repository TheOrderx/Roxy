const reqEvent = (event) => require(`../events/${event}`);

module.exports = client => {
  client.on('ready', () => reqEvent('ready')(client));  
  client.on('message', (message) => reqEvent('message')(client,message));
  client.on('guildCreate', (guild) => reqEvent('guildCreate')(client,guild));
  client.on('guildMemberAdd', (member) => reqEvent('guildMemberAdd')(client,member));
  client.on('guildMemberRemove', (member) => reqEvent('guildMemberRemove')(client,member));
  client.on('guildBanAdd', (guild,member) => reqEvent('guildBanAdd')(client,guild,member));
  client.on("guildMemberUpdate", (oldMember,newMember) => reqEvent('memberUpdate')(client,oldMember,newMember));
};