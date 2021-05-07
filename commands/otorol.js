exports.run = async (client, message, args) => {
   const prefix = await client.Prefix(message.guild.id);
   const Schema = require('../models/AutoRole');
   const Role = message.mentions.roles.first();
   const Channel = message.mentions.channels.first();

   if(args[0] == "kapat"){
    await Schema.findOneAndDelete({ serverID: message.guild.id }).exec();
    message.channel.send({ embed: {
        color: `${client.config.Color.Success}`,
        description: `:white_check_mark: Otorol rol ve kanal ayarı başarı ile sıfırlandı.`
    }}).catch(err => { client.Error(message,"otorol",err); });
    return;
   }

   if(!Role || !Channel){
    message.channel.send({ embed: {
        color: `${client.config.Color.Error}`,
        description: `:warning: Lütfen bir kanal ve rol etiketleyerek tekrar deneyin.`
    }}).catch(err => { client.Error(message,"otorol",err); });
    return;
   }

   try{
    const Data = await Schema.findOne({ serverID: message.guild.id }).exec();
     Data.RoleID = Role.id
     Data.ChannelID = Channel.id
      Data.save((err,doc) => {
        if(err){
            client.Error(message,"otorol",err);
            return;
        }

        if(doc){
            message.channel.send({ embed: {
                color: `${client.config.Color.Success}`,
                description: `:white_check_mark: Otorol ayarı başarı ile güncellendi. Sunucuya yeni giriş yapan kullanıcılara **${Role.name}** rolü verilecek ve bilgilendirme mesajları **#${Channel.name}** kanalına gönderilecek.`
            }}).catch(err => { client.Error(message,"otorol",err); });
            return;
        }
      });
   }catch(err){
    const obj = { serverID: message.guild.id, RoleID: Role.id, ChannelID: Channel.id };
    const push = new Schema(obj);
    push.save((err,doc) => {
        if(err){
            client.Error(message,"otorol",err);
            return;
        }

        if(doc){
            message.channel.send({ embed: {
                color: `${client.config.Color.Success}`,
                description: `:white_check_mark: Otorol ayarı başarı ile açıldı. Sunucuya yeni giriş yapan kullanıcılara **${Role.name}** rolü verilecek ve bilgilendirme mesajları **#${Channel.name}** kanalına gönderilecek.`
            }}).catch(err => { client.Error(message,"otorol",err); });
            return;
        }
      });
   }

}

exports.command = {
    name: "otorol",
    aliases: ["autorole"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 3500,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};