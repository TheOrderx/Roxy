const Discord = require("discord.js"),
    fs = require("fs"),
    config = require("./config.json"),
    db = require('./models/genel'),
    dbuser = require('./models/kullanıcı')
    client = new Discord.Client({ disableEveryone: true });


client.config = config
client.CommandCooldown = new Map([]);
client.Afk = new Map([]);
client.Tickets = new Map([]);
client.SupportChannels = new Map([]);
client.PanelConfig = new Map([]);
client.randomAvatar = new Map([]);
client.invites = {};
client.SupportLog = async (ID,Message) => {
    const Schema = require('./models/ServerSupport');
    const Data = await Schema.findOne({ serverID: ID }).exec();
    try{ client.channels.cache.get(Data.Config.LogChannel).send(Message); }catch(err){ return; }
}
client.Prefix = async (ID) => {
    async function prefix(ID) {
        const PrefixSchema = require('./models/Prefix');
        try { const PrefixData = await PrefixSchema.findOne({ serverID: ID }).exec(); return PrefixData.Prefix; } catch (err) { return client.config.Bot.Prefix; }
    }
    const Prefix = await prefix(ID);
    return Prefix;
}
client.randomStr = async (length,chars) => {
    var mask = ''; if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz'; if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; if (chars.indexOf('#') > -1) mask += '0123456789'; if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\'; var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}
client.serverPanel = async (ID) => {
    const serverPanelSchema = require('./models/ServerPanel');
    try {
        var OnlineMember
        const guild = client.guilds.cache.get(ID);
        const panelData = await serverPanelSchema.findOne({ serverID: ID }).exec();

        if(OnlineMember == undefined){
        OnlineMember = await guild.members.cache.filter(member => member.presence.status == "dnd" || member.presence.status == "idle" || member.presence.status == "online").size;
        }

        if ((panelData.rekorOnline < OnlineMember) == true) {
            panelData.rekorOnline = OnlineMember
            panelData.save();
        }

        function convert(String, Size) {
            Data = String.replace("{size}", Size);
            return Data;
        }

        if (panelData.serverID == guild.id) {
                guild.channels.cache.get(panelData.ChannelData.TotalUye).setName(convert(panelData.ChannelContent.TotalUye, guild.memberCount)).then(TotalUye => {
                    guild.channels.cache.get(panelData.ChannelData.OnlineUye).setName(convert(panelData.ChannelContent.OnlineUye, OnlineMember)).then(onlineUye => {
                        guild.channels.cache.get(panelData.ChannelData.Bot).setName(convert(panelData.ChannelContent.Bot, guild.members.cache.filter(sakso => sakso.user.bot).size)).then(BotUye => {
                            guild.channels.cache.get(panelData.ChannelData.RekorOnline).setName(convert(panelData.ChannelContent.RekorOnline, panelData.rekorOnline)).then(rekorUye => {
                                guild.channels.cache.get(panelData.ChannelData.Voice).setName(convert(panelData.ChannelContent.Voice, guild.voiceStates.cache.size)).then(VoiceChn => {
                                    OnlineMember = undefined
                                    return "true";
                                }).catch(err => { return "false"; })
                            }).catch(err => { return "false"; });
                        }).catch(err => { return "false"; });
                    }).catch(err => { return;  });
                }).catch(err => { return "false"; });
        }
    } catch (err) {
        return "false";
    }
}
client.Error = async (message,command,error) => {
    const random = await client.randomStr(8,"aA#");
    const hook = new Discord.WebhookClient(client.config.Bot.Logs.Error.WebHookID, client.config.Bot.Logs.Error.WebHookTOKEN); 
    message.channel.send({ embed: { description: `:warning: İşlem sırasında bir hata oluştu, tekrar deneyebilir veya bot yetkilisi ile iletişime geçebilirsiniz.\b**Hata Kodu:** \`\`#${random}\`\``, color: `${client.config.Color.Error}`}}).catch(err => { return; });
    hook.send(`:warning: **${message.guild.name}** adlı sunucuda **${command}** komutunda bir hata oluştu. (\`\`#${random}\`\`)\n\`\`\`${error}\`\`\``).catch(err => { return; });
    return;
}
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

require('./util/eventLoader')(client);
fs.readdir('./commands/', (err, files) => {
    if (err) console.error(err);
    files.forEach(f => {
        let props = require(`./commands/${f}`);
        client.commands.set(props.command.name, props);
        props.command.aliases.forEach(alias => {
            client.aliases.set(alias, props.command.name);
        });
    });
});

client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./commands/${command}`)];
            let cmd = require(`./commands/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.command.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.command.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./commands/${command}`);
            client.commands.set(command, cmd);
            cmd.command.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./commands/${command}`)];
            let cmd = require(`./commands/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

////////////////////bot koruma
client.on("guildMemberAdd", async member => {
  
    if(!member.user.bot) return
    
    db.findOne({guildid : member.guild.id}, (error, data) => {
    if(!data || data === null) return
    if(!data || !data.botkoruma || data.botkoruma === null || data.botkoruma === 'false') return
    
    member.kick().catch(err=> {})
    
    if(!data.korumalog || data.korumalog === undefined || data.korumalog === 'false') return
      
    client.channels.cache.get(data.korumalog).send(`**${member.user.tag}** isimli **${member.user.id}** ID'li bot sunucuya katıldı! Bende sunucudan attım!`)
    .catch(err=> {})  
    })  
    })
    ////////////////////bot koruma
    
    ////////////////////reklam
    client.on('message', async message => {
    if(!message.guild) return
    db.findOne({guildid : message.guild.id}, (error, data) => {
    if(!data || data === null) return
    if(!data || !data.reklamengel || data.reklamengel === null || data.reklamengel === 'false') return
    let reklamlar = ["discord.app", "discord.gg" ,"discordapp","discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az", ".cf", ".me", ".in"]
    if (reklamlar.some(word => message.content.toLowerCase().includes(word))) {
    if (message.member.hasPermission("BAN_MEMBERS")) return;
    message.delete({timeout:0})
    message.reply(`Reklam yasak dostum!`).then(msg => msg.delete({timeout:5000})) 
    };})
    });
    ////////////////////reklam
    
    
    
    ////////////////////GÜVENİK ODASI
    client.on('guildMemberAdd',async member => {
    const moment = require('moment')
    require('moment-duration-format')
      
    db.findOne({guildid : member.guild.id}, async (error, data) => {
    if(!data || data === null) return
    if(!data || !data.güvenlikodası || data.güvenlikodası === null || data.güvenlikodası === 'false') return
     
    let user = client.users.cache.get(member.id);
    let chan = client.channels.cache.get(data.güvenlikodası) 
          
      
         const kurulus = new Date().getTime() - user.createdAt.getTime();
        const gün = moment(kurulus).format('dddd');  
        var kontrol;
        if (kurulus > 2592000000) kontrol = 'Güvenli'
        if (kurulus < 2592000000) kontrol = 'Günveli Değil'
    
        chan.send(`**${member.user.tag}** Katıldı!
    Hesap Kuruluş : **${moment.duration(kurulus).format("Y [Yıl], D [Gün], H [Saat], m [Dakika], s [Saniye]") } Önce**
    Hesap Güvenliği : **${kontrol}**`)
      
    })
    });
    ////////////////////GÜVENİK ODASI
    
    
    //////////////////////////////////////////////////// KANAL KORUMA
    
    client.on("channelDelete", async channel => {
    if(!channel.guild) return
     
    db.findOne({guildid : channel.guild.id}, async (error, data) => {
    if(!data || data === null) return
    if(!data || !data.kanalkoruma || data.kanalkoruma === null || data.kanalkoruma === 'false') return
      
    let korumalimit;
    if(!data.kanalkorumalimit || data.kanalkorumalimit === undefined || data.kanalkorumalimit <= 0) korumalimit = 3
    if(data.kanalkorumalimit > 0) korumalimit = data.kanalkorumalimit
    
    const kullanıc = await channel.guild.fetchAuditLogs({ type: "CHANNEL_DELETE", limit: korumalimit })
    let kullanıcı = await kullanıc.entries.first()
    
      if (kullanıcı.executor.id === client.user.id) return;
      let ss = channel.guild.members.cache.get(kullanıcı.executor.id)
      if (kullanıcı.executor.id === client.user.id) return;
      
    let sayı;
      
    dbuser.findOne({guildid : channel.guild.id, userid : kullanıcı.executor.id}, (erro, dat) => {
    
    if(!dat) {
    new dbuser({
    userid: kullanıcı.executor.id,
    guildid: channel.guild.id,
      
    bankorumalimit: 0,
    rolkorumalimit: 0,
    kanalkorumalimit: 1
    }).save()
    sayı = 1
    } 
    if(dat) {
    let t = Number(dat.kanalkorumalimit)+Number(1)
    dat.kanalkorumalimit = t
    dat.save()
    sayı = t
      
    if(sayı >= korumalimit) {
    dat.kanalkorumalimit = '0'
    dat.save().catch(err=> {})
    }
      
    }
    })
      
    setTimeout(()=> {
    if(sayı >= korumalimit) {
    channel.clone({ name: undefined, reason: 'Kanal koruma' }).then(c => c.setParent(channel.parentID))
    let u = channel.guild.members.cache.get(kullanıcı.executor.id)
    u.kick('Kanalkoruma FDH').catch(err=> {})
    }
      
    let hak = korumalimit - sayı
      
    let msg;
    if(hak <= 0) msg = `Sunucudan atıldı! Sildiği kanal : **${sayı}**`
    if(hak > 0) msg = `Sunucudan atılacak! Kalan Hak : **${hak}**`
    
    const embed = new Discord.MessageEmbed()
    .setTitle(`KANAL KORUMA DEVERYE GİRDİ!`)
    .addField(`Kanalı Silen`, kullanıcı.executor.tag)
    .addField('Yapılan İşlem', msg)
    .setColor("BLUE")
    .addField(`Silinen Kanal`, channel.name);
      
    if(data.korumalog || data.korumalog !== undefined || data.korumalog !== 'false') {
    client.channels.cache.get(data.korumalog).send(embed).catch(err=> {}) 
    }
    },300)
    });
    })
    //////////////////////////////////////////////////// KANAL KORUMA
    
    
    
    //////////////////////////////////////////////////// ROL KORUMA
    
    client.on("roleDelete", async rol => {
    if(!rol.guild) return
     
    db.findOne({guildid : rol.guild.id}, async (error, data) => {
    if(!data || data === null) return
    if(!data || !data.rolkoruma || data.rolkoruma === null || data.rolkoruma === 'false') return
      
    let korumalimit;
    if(!data.rolkorumalimit || data.rolkorumalimit === undefined || data.rolkorumalimit <= 0) korumalimit = 3
    if(data.rolkorumalimit > 0) korumalimit = data.rolkorumalimit
     
    const kullanıc = await rol.guild.fetchAuditLogs({ type: "ROLE_DELETE", limit: korumalimit })
    let kullanıcı = await kullanıc.entries.first()
    
      if (kullanıcı.executor.id === client.user.id) return;
      let ss = rol.guild.members.cache.get(kullanıcı.executor.id)
      if (kullanıcı.executor.id === client.user.id) return;
      
    let sayı;
      
    dbuser.findOne({guildid : rol.guild.id, userid : kullanıcı.executor.id}, (erro, dat) => {
    
    if(!dat) {
    new dbuser({
    userid: kullanıcı.executor.id,
    guildid: rol.guild.id,
      
    bankorumalimit: 0,
    rolkorumalimit: 1,
    kanalkorumalimit: 0
    }).save()
    sayı = 1
    } 
    if(dat) {
    let t = Number(dat.rolkorumalimit)+Number(1)
    dat.rolkorumalimit = t
    dat.save()
    sayı = t
      
    if(sayı >= korumalimit) {
    dat.rolkorumalimit = '0'
    dat.save().catch(err=> {})
    }
      
    }
    })
      
    setTimeout(()=> {
    if(sayı >= korumalimit) {
    rol.guild.roles.create(rol.name,{position: rol.position})
    let u = rol.guild.members.cache.get(kullanıcı.executor.id)
    u.kick('Rol Koruma FDH').catch(err=> {})
    }
      
    let hak = korumalimit - sayı
      
    let msg;
    if(hak <= 0) msg = `Sunucudan atıldı! Sildiği Rol : **${sayı}**`
    if(hak > 0) msg = `Sunucudan atılacak! Kalan Hak : **${hak}**`
    
    const embed = new Discord.MessageEmbed()
    .setTitle(`ROL KORUMA DEVERYE GİRDİ!`)
    .addField(`Rolü Silen`, kullanıcı.executor.tag)
    .addField('Yapılan İşlem', msg)
    .setColor("BLUE")
    .addField(`Silinen Rol`, rol.name);
      
    if(data.korumalog || data.korumalog !== undefined || data.korumalog !== 'false') {
    client.channels.cache.get(data.korumalog).send(embed).catch(err=> {}) 
    }
    },300)
    });
    })
    //////////////////////////////////////////////////// ROL KORUMA
    
    
    
    //////////////////////////////////////////////////// BAN KORUMA
    
    client.on("guildBanAdd", async guild => {
    if(!guild) return
     
    db.findOne({guildid : guild.id}, async (error, data) => {
    if(!data || data === null) return
    if(!data || !data.bankoruma || data.bankoruma === null || data.bankoruma === 'false') return
      
    let korumalimit;
    if(!data.bankorumalimit || data.bankorumalimit === undefined || data.bankorumalimit <= 0) korumalimit = 3
    if(data.bankorumalimit > 0) korumalimit = data.bankorumalimit
      
    const kullanıc = await guild.fetchAuditLogs({ type: "MEMBER_BAN_ADD", limit: korumalimit })
    let kullanıcı = await kullanıc.entries.first()
    
      if (kullanıcı.executor.id === client.user.id) return;
      let ss = guild.members.cache.get(kullanıcı.executor.id)
      if (kullanıcı.executor.id === client.user.id) return;
      
    let sayı;
      
    dbuser.findOne({guildid : guild.id, userid : kullanıcı.executor.id}, (erro, dat) => {
    
    if(!dat) {
    new dbuser({
    userid: kullanıcı.executor.id,
    guildid: guild.id,
      
    bankorumalimit: 1,
    rolkorumalimit: 0,
    kanalkorumalimit: 0
    }).save()
    sayı = 1
    } 
    if(dat) {
    let t = Number(dat.rolkorumalimit)+Number(1)
    dat.bankorumalimit = t
    dat.save()
    sayı = t
      
    if(sayı >= korumalimit) {
    dat.bankorumalimit = '0'
    dat.save().catch(err=> {})
    }
      
    }
    })
      
    setTimeout(()=> {
    if(sayı >= korumalimit) {
    guild.members.unban(kullanıcı.target.id).catch(err=> {})
    let u = guild.members.cache.get(kullanıcı.executor.id)
    u.kick('Ban Koruma FDH').catch(err=> {})
    }
      
    let hak = korumalimit - sayı
      
    let msg;
    if(hak <= 0) msg = `Sunucudan atıldı! Ban atıığı sayı : **${sayı}**`
    if(hak > 0) msg = `Sunucudan atılacak! Kalan Hak : **${hak}**`
    
    const embed = new Discord.MessageEmbed()
    .setTitle(`BAN KORUMA DEVERYE GİRDİ!`)
    .addField(`Ban Atan`, kullanıcı.executor.tag)
    .addField('Ban Atılan', kullanıcı.target.tag)
    .addField('Yapılan İşlem', msg)
    .setColor("BLACK")
      
    if(data.korumalog || data.korumalog !== undefined || data.korumalog !== 'false') {
    client.channels.cache.get(data.korumalog).send(embed).catch(err=> {}) 
    }
    },300)
    });
    })
    //////////////////////////////////////////////////// BAN KORUMA

client.login(config.Bot.Token);