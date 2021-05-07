const moment = require("moment-timezone");

exports.run = async (client, message, args) => {
    const member  = message.mentions.users.first() || client.users.resolve(args[0]);
    const reason  = args.slice(1).join(' ') || "No Reason!";
    const ModSchema = require('../models/ModerationLogs');
    const Data = await ModSchema.findOne({ serverID: message.guild.id }).exec();

    let Turkiye = moment.tz(moment(), 'Europe/Istanbul').format('HH:mm:ss');
     if(!member || isNaN(member.id) || !reason ) return message.channel.send({ embed: { color: "RANDOM", description: `:warning: Lütfen bir kullanıcı etiketleyin.`}});
    if(member.id == message.author.id) return message.channel.send(` :warning: kendinizi banlayamazsınız`); 
    if((message.guild.members.cache.get(member.id).roles.highest.position > message.member.roles.highest.position) == true ) return message.channel.send(`:warning: bot ile kendinden üstteki birisini banlayamazsın.`).catch(err => { return; });
    if(message.guild.members.cache.get(client.user.id).hasPermission("BAN_MEMBERS") == false ) return message.channel.send(`:x: botun ban atmak için gerekli yetkisi yok.`);
    message.guild.members.ban(member.id).then( async banUser => {
      message.channel.send(`${banUser.username}#${banUser.discriminator} banlandı.`);
      try{
       message.guild.channels.cache.get(Data.ChannelID).send(`:rotating_light: **${member.tag}** (\`\`${member.id}\`\`) adlı kullanıcı **${message.author.tag}** (\`\`${message.author.id}\`\`) tarafından banlandı. Sebep: \`\`${reason}\`\``);
      }catch(err){}
      return;
    }).catch(err => {
      client.Error(message,"ban",err);
      return;
    })
}

exports.command = {
    name: "ban",
    aliases: ["yasakla","banla"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 10000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};