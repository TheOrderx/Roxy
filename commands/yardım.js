module.exports.run = async (client, message, args) => {
  const prefix = await client.Prefix(message.guild.id);

  const command = (cmd) => {
    return "``"+prefix+cmd+"`` - "
  }
  
  if(!args[0]){
    message.channel.send({ embed: {
      color: `RANDOM`,
      title: `${client.user.username} Yardım Menüsü`,
      description: "```Komutları kullanırken botun rolünü (@"+client.user.username+") en üstte tutunuz.```",
      fields: [
        {
          name: "Moderatör Komutları:",
          value: `${command("ban")} Kullanıcıyı yasaklar.\n${command("kick")} Kullanıcıyı sunucudan atar.\n${command("mute-sistem")} Kullanıcı susturma sistemi komutları.\n${command("jail-sistem")} Kullanıcı cezalandırma sistemi komutları.\n${command("uyarı-sistem")} Kullanıcıları kural ihlali gibi durumlard uyarabileceğiniz sistem komutları.`
        },
        {
          name: "Güvenlik Komutları:",
          value: `${command("ban-koruma")} Sunucuya ban saldırısı yapmak isteyen yetkilileri engeller.\n${command("ban-koruma-limit")} Ban korumasının çalışacağı limit ayarlarsınız.\n${command("kanalkoruma")} Silinmelere karşı kanalları korursunuz.\n${command("kanalkoruma-limit")} Kanal koruma sisteminin çalışacağı limiti belirlersiniz.\n${command("botkoruma")} Sunucuya yeni eklenen botlardan korunursunuz.\n${command("rolkoruma")} Sunucunuzdaki rolleri korursunuz.\n${command("rolkoruma-limit")} Rol koruma sisteminin çalışacağı limiti belirler.\n${command("reklamengel")} Sunucuda reklam yapılmasını engeller.\n${command("güvenlik-odası")} Güvenlik mesajlarının gönderileceği kanalı ayarlar.\n${command("kanalkoruma")} Sununuzdaki kanalları korursunuz.\n${command("kanalkoruma-limit")} Kanal koruma sisteminin çalışacağı limit.`
        },
        {
          name: "Ayarlanabilir Komutlar:",
          value: `${command("prefix")} Botun sunucudaki ön-ekini değiştirir.\n${command("modlog")} Moderatör kayıt kanalı ayarlarsınız.\n${command("korumalog")} Koruma sistemlerinin kayıtlarının tutulacağı kanal.\n${command("hgbb")} Hoşgeldin, görüşürüz mesaj sistemi komutları.\n${command("davetsayaç")} Davet sayaç sistem komutları.\n${command("kayıt")} Kayıt sistemi komutları.\n${command("otorol")} Sunucuya giriş yapan yeni kullanıcılara otomatik verilecek rol ayarlama komutu.`
        },
        {
          name: "Bot Destek Komutları:",
          value: `${command("öneri")} Bot sahibine botun yararına olabilecek öneriler yapmanızı sağlar.\n${command("bug")} Bot üzerinde yer alan hataları bildirebilirsiniz.\n${command("davet")} Botu davet edebilir, destek sunucumuza katılabilirsiniz!`
        },
        {
          name: "Kullanıcı Komutları:",
          value: `${command("avatar")} Profil resminizi verir.\n${command("randomavatar")} Rastgele kullanıcı profil resmi gönderir.\n${command("afk")} AFK moduna geçersiniz.`
        }
      ]
    }}).catch(err => { 
      client.Error(message,"yardım",err);
      return;
    });
    return;
  }
}


exports.command = {
  name: "yardım",
  aliases: ["help"],
  category: "util",
  permission: "SEND_MESSAGES",
  cooldown: 3500,
  maintenance: false,
  supportServer: false,
  DBLVoteLock: false
};
