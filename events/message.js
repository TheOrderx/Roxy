const ms = require("ms");
const fs = require('fs');

module.exports = async (client, message) => {
  if(message.author.id == client.user.id) return;
  const prefix = await client.Prefix(message.guild.id);

  const AfkSchema = require('../models/Afk');
  const SupportSchema = require('../models/ServerSupport');

  if (client.Afk.get(message.author.id) != undefined) {
    message.channel.send({
      embed: {
        color: `RANDOM`,
        description: `Artık AFK değilsin!`
      }
    }).catch(err => { return; });
    client.Afk.delete(message.author.id);
    AfkSchema.findOneAndDelete({ userID: message.author.id }).exec();
    return;
  }
  try{
    var AfkMessageStatus = false
    message.mentions.users.forEach(async data => {
      if (client.Afk.get(data.id) != null && AfkMessageStatus == false) {
        message.channel.send(`:timer: Mesajınızda etiketlediğiniz **${data.username}#${data.discriminator}** adlı kullanıcı **${client.Afk.get(data.id)}** sebebi ile afk.`).catch(err => { return; });
        AfkMessageStatus = true;
      }
    });
  }catch(err){ return; }

  if(message.channel.name.split("-")[0] == "ticket" && client.Tickets.get(`${message.guild.id}_${message.channel.name.split("-")[1]}`) != undefined ){
    const Data = await SupportSchema.findOne({ serverID: message.guild.id }).exec();
    let FileData
    try{ FileData = fs.readFileSync(`./logs/${message.channel.name.split("-")[2]}.txt`).toString(); }catch(err){ FileData ="Başlangıç"; }
    Data.Stats.TotalMessage = Data.Stats.TotalMessage++
    Data.save();
     fs.writeFile(`./logs/${message.channel.name.split("-")[2]}.txt`,FileData+`\n[${message.author.id}] | ${message.author.tag} | ${message.content}`, (err) => { });
    if(message.content == "talep kapat"){
      message.channel.send({ embed: {
        color: `RANDOM`,
        description: `:question: Destek talebini kapatmak istediğinize emin misiniz?`
      }}).then( firstMsg => {
        firstMsg.react("✅").then( React1 => {
        firstMsg.react("❌").then( React2 => {
          const filter = (reaction,user) => { return user.id === message.author.id; };
          firstMsg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time']}).then( reacted => {
            const reaction = reacted.first();
             firstMsg.reactions.removeAll().catch(err => { return; });

            if(reaction.emoji.name == "✅"){
              firstMsg.edit({ embed: {
                color: `${client.config.Color.Loading}`,
                description: `:timer: Talep kapatılıyor, lütfen bekleyiniz...`
              }}).then( msg => {
                const user = message.guild.members.cache.get(message.channel.name.split("-")[1]).user
                client.Tickets.delete(`${message.guild.id}_${message.channel.name.split("-")[1]}`);
                try{ client.channels.cache.get(Data.Config.LogChannel).send(`🔴 **${user.tag}** (\`\`${user.id}\`\`) adlı kullanıcının \`\`#${message.channel.name.split("-")[2]}\`\` ID'li destek talebi **${message.author.tag}** (\`\`${message.author.id}\`\` - <@${message.author.id}>) adlı kullanıcı tarafından kapatıldı.`,{ files: [{ attachment: `./logs/${message.channel.name.split("-")[2]}.txt`, name: `${message.channel.name}.txt` }]}); }catch(err){ return; }
                message.channel.delete();
                client.Tickets.delete(`${message.guild.id}_${user.id}`)
                setTimeout(function(){ fs.unlink(`./logs/${message.channel.name.split("-")[2]}.txt`, (err) => {}) }, 1000);
              }).catch(Err => { return; });
              return;
            } 

            if(reaction.emoji.name == "❌"){
              firstMsg.edit({ embed: {
                color: `RANDOM`,
                description: `:x: Talep kapatma işlemi iptal edildi.`
              }}).catch(err => { return; });
              return;
            }

          }).catch(err => { firstMsg.edit({ embed: {
            color: `${client.config.Color.Error}`,
            description: `:x: Belirtilen sürede işlem yapılmadığı için otomatik olarak iptal edildi.`
          }}).catch(err => { return; }); });
        }).catch(err => { return; });
        }).catch(err => { return; });
      })
      return;
    } //\\//\\//\\//\\//\\//\\//

    if(message.member.roles.cache.has(Data.Config.SupportRoleID) == true && message.channel.topic == null){
      const user = message.guild.members.cache.get(message.channel.name.split("-")[1]).user
      client.SupportLog(message.guild.id,`🟢 **${user.tag}** (\`\`${user.id}\`\`) adlı kullanıcının \`\`#${message.channel.name.split("-")[2]}\`\` ID numaralı destek talebi **${message.author.tag}** (\`\`${message.author.id}\`\` - <@${message.author.id}>) adlı yetkili tarafından işleme alındı.`);
      message.channel.setTopic(message.author.id).then( topic => {
        
      }).catch(err => { console.log(err); });
      return;
    } // herhangi bir yetkili yok ise yeni yetkili ara ve permleri yeniden düzenle
  } // burda bitiyor


  if(client.SupportChannels.get(message.guild.id) == message.channel.id){
    if(message.author.bot) return;
    const Data = await SupportSchema.findOne({ serverID: message.guild.id }).exec();
    const Key = message.content.split("-")[0].replace(" ","");
    const Content = message.content.split("-")[1] || "Açıklama yapılmadı";
    if(Key == Data.Key){
      if(client.Tickets.get(`${message.guild.id}_${message.author.id}`) == undefined){
        /*if(Data.Bans.includes(message.author.id)){
          message.react("❌");
          message.delete({ timeout: 5000 });
          return;
        }else{*/
          message.guild.channels.create(`ticket-${message.author.id}-${Key}`, {
            type: `text`,
            parent: Data.Config.ParentID,
            permissionOverwrites: [
            {
              id: message.guild.id,
              deny: ["VIEW_CHANNEL"]
            },
            {
              id: message.author.id,
              allow: ["VIEW_CHANNEL","SEND_MESSAGES"]
            },
            {
              id: Data.Config.SupportRoleID,
              allow: ["VIEW_CHANNEL","SEND_MESSAGES"]
            },
            {
              id: client.user.id,
              allow: ["SEND_MESSAGES","VIEW_CHANNEL"]
            }
            ]
          }).then( TicketChannel => {
            client.SupportLog(message.guild.id,`🟡 **${message.author.tag}** (\`\`${message.author.id}\`\`) adlı kullanıcı için başarı ile yeni destek talebi oluşturuldu, yetkili bekleniyor. (\`\`#${Key}\`\`)`)
            TicketChannel.send({ embed: {
              color: `RANDOM`,
              description: `Merhaba **${message.author.username}** destek talebiniz başarı ile oluşturuldu, lütfen bir yetkilinin sizinle ilgilenmesini bekleyin.`,
              fields: [
              {
                name: "Açıklama:",
                value: Content
              },
              {
                name: "Not:",
                value: "Talep kapatmak için kanala **talep kapat** yazınız."
              }
              ]
            }}).then( msg => {
              client.Tickets.set(`${message.guild.id}_${message.author.id}`, TicketChannel.id);
              message.guild.channels.cache.get(client.SupportChannels.get(message.guild.id)).messages.fetch(Data.MessageID).then( Msg => {
                    Data.Stats.TotalTicket = Data.Stats.TotalTicket++
                    Data.Stats.SuccessTicket = Data.Stats.SuccessTicket++
                    Data.save((err,doc) => { console.log(err); console.log(doc); });
              }).catch(err => { return; });
            }).catch(err => { return; });
          }).catch(err => { return; });
        //}
      }else{
         message.delete({ timeout: 2500 });
      message.channel.send({ embed: {
        color: `${client.config.Color.Error}`,
        description: `:warning: **Dikkat!** Zaten açık bir adet destek talebiniz mevcut.`,
        fields: [
        {
          name: "Kanal:",
          value: `<#`+client.Tickets.get(`${message.guild.id}_${message.author.id}`)+`>`
        }
        ]
      }}).then( msg => {
        Data.Stats.TotalTicket = Data.Stats.TotalTicket++
        Data.Stats.FailedTicket = Data.Stats.FailedTicket++
        Data.save();
        message.guild.channels.cache.get(client.Tickets.get(`${message.guild.id}_${message.author.id}`)).send(`<@${message.author.id}> Lütfen bu talep üzerinden devam ediniz, yeni talep açmak için lütfen önce bunu talebin kapatılmasını bekleyin.`).catch(err => { return; });
        client.SupportLog(message.guild.id,`:x: **${message.author.tag}** (\`\`${message.author.id}\`\`) adlı kullanıcının talep açma girişimi başarısız!\n**Reason:**\`\`\`Kullancıya ait aktif bir talep mevcut.\`\`\``);
        msg.delete({ timeout: 5000 });
      })
      }
    }else{
      message.delete({ timeout: 2500 });
      message.channel.send({ embed: {
        color: `${client.config.Color.Error}`,
        description: `:warning: **Dikkat!** Bilgilendirme mesajına uygun olarak talep oluşturmaya çalıştığınıza emin olun.`
      }}).then( msg => {
        Data.Stats.TotalTicket = Data.Stats.TotalTicket++
        Data.Stats.FailedTicket = Data.Stats.FailedTicket++
        Data.save();
        client.SupportLog(message.guild.id,`:x: **${message.author.tag}** (\`\`${message.author.id}\`\`) adlı kullanıcının talep açma girişimi başarısız!.\n**Reason:**\`\`\`Geçersiz doğrulama kodu.\`\`\`**Mesaj İçeriği:**\`\`\`${message.content.substr(0,120)}\`\`\``);
        msg.delete({ timeout: 5000 });
      })
    }
  }

  if (!message.content.startsWith(prefix) || message.author.bot || message.content == prefix) return;
  let command = message.content.split(' ')[0].slice(prefix.length);
  let params = message.content.split(' ').slice(1);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }

  try {
    const permission = cmd.command.permission
    const cooldown = cmd.command.cooldown
    console.log(`[Bot] ${message.guild.name} adlı sunucuda ${message.author.tag} tarafından ${cmd.command.name} komutu kullanıldı.`)
    if (client.CommandCooldown.get(`${message.author.id}_${cmd.command.name}`) != null) {
      const setCooldown = client.CommandCooldown.get(`${message.author.id}_${cmd.command.name}`);
      const CooldownMS = ms(cooldown - (Date.now() - setCooldown));
      const Result = CooldownMS.replace("s", "");
      message.channel.send(`:warning: ${cmd.command.name} adlı komutu yeniden kullanabilmek için ${Result} saniye daha beklemelisiniz.`);
      return;
    }

    if (cmd.command.maintenance == true && client.config.Bot.Owners.includes(message.author.id)) {
      message.channel.send(`:warning: Bu komut şuanda bakımdadır, bu nedenle sadece **bot sahibi** veya **BETA Kullanıcısı** tarafından kullanılabilir.`);
      client.CommandCooldown.set(`${message.author.id}_${cmd.command.name}`, Date.now());
      setTimeout(function () { client.CommandCooldown.delete(`${message.author.id}_${cmd.command.name}`); }, cooldown);
      return;
    }

    if (client.config.Bot.Owners.includes(message.author.id)) {
      cmd.run(client, message, params);
    } else if (permission == "GUILD_OWNER") {
      if (message.author.id != message.guild.owner.id) return message.channel.send(`:warning: Bu komutu sadece **sunucu sahibi** kullanabilir.`);
      cmd.run(client, message, params);
      client.CommandCooldown.set(`${message.author.id}_${cmd.command.name}`, Date.now());
      setTimeout(function () { client.CommandCooldown.delete(`${message.author.id}_${cmd.command.name}`); }, cooldown);
    } else if (permission == "BOT_OWNER") {
      if (!client.config.Bot.Owners.includes(message.author.id)) return message.channel.send(`:warning: Bu komutu sadece botun sahibi kullanabilir.`);
      cmd.run(client, message, params);
      client.CommandCooldown.set(`${message.author.id}_${cmd.command.name}`, Date.now());
      setTimeout(function () { client.CommandCooldown.delete(`${message.author.id}_${cmd.command.name}`); }, cooldown);
    } else {
      if (message.member.hasPermission(permission) == false) {
        message.channel.send({
          embed: {
            color: `${client.config.Color.Error}`,
            description: `:warning: Bu komutu kullanabilmek için **${permission}** yetkisine sahip olmalısınız.`
          }
        });
        return;
      }
      cmd.run(client, message, params);
      client.CommandCooldown.set(`${message.author.id}_${cmd.command.name}`, Date.now());
      setTimeout(function () { client.CommandCooldown.delete(`${message.author.id}_${cmd.command.name}`); }, cooldown);
    }
  } catch (err) {
    return;
  }
};