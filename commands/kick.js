exports.run = async (client, message, args) => {
const member  = message.mentions.users.first() || client.users.resolve(args[0]);
    const reason  = args.slice(1).join(' ') || "Açıklama Bulunamadı!";
    const ModSchema = require('../models/ModerationLogs');
    const Data = await ModSchema.findOne({ serverID: message.guild.id }).exec();

    if(!member || isNaN(member.id) || !reason ){
    	message.channel.send({ embed: {
    		color: `${client.config.Color.Info}`,
    		description: `:warning: Lütfen bir kullanıcı etiketleyin.`
    	}}).catch(err => { client.Error(message,"kick",err); });
    	return;
    }

    if(member.id == message.author.id){
    	message.channel.send({ embed: {
    		color: `${client.config.Color.Error}`,
    		description: `:warning: Kendinizi atamazsınız.`
    	}}).catch(err => { client.Error(message,"kick",err); });
    	return;
    }

    if((message.guild.members.cache.get(member.id).roles.highest.position > message.member.roles.highest.position) == true ) {
    	message.channel.send({ embed: {
    		color: `${client.config.Color.Info}`,
    		description: `:warning: Kendinizden daha üstteki bir kullanıcıyı atamazsınız.`
    	}}).catch(err => { client.Error(message,"kick",err); });
    	return;
    }

    message.guild.members.cache.get(member.id).kick().then( async banUser => {
      message.channel.send(`:ok_hand: Kullanıcı atıldı.`);
      try{
      	message.guild.channels.cache.get(Data.ChannelID).send(`:boot: **${member.tag}** (\`\`${member.id}\`\`) adlı kullanıcı **${message.author.tag}** (\`\`${message.author.id}\`\`) tarafından atıldı. Sebep: \`\`${reason}\`\``);
      }catch(err){}
    }).catch(err => {
      client.Error(message,"kick",err);
    })
}

exports.command = {
    name: "kick",
    aliases: ["at","sunucudan-at"],
    category: "util",
    permission: "KICK_MEMBERS",
    cooldown: 10000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};