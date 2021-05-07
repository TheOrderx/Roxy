exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const SupportSchema = require('../models/ServerSupport');
    const process = args[0];

    if (!process) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Info}`,
                description: `:warning: Lütfen yapmak istediğiniz işlemi belirtin.`
            }
        }).catch(err => { return client.Error(message,"serversupport",err); });
        return;
    }

    if (process == "kur") {
            message.channel.send({
            embed: {
                color: `${client.config.Color.Info}`,
                description: `:question: Sunucu içi destek talebi sistemi kurmak istediğinize emin misiniz? Onaylamanız durumunda sunucunuzda kanal ve kategoriler oluşturulacaktır.`
            }
        }).then(firstMsg => {
            firstMsg.react("✅").then(React1 => {
                firstMsg.react("❌").then(React2 => {
                    const filter = (reaction, user) => { return user.id === message.author.id; };
                    firstMsg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                        const reaction = collected.first()
                        if(reaction.emoji.name == "✅"){
                            message.guild.roles.create({ data: { name: `Destek Yetkilisi`, color: `RANDOM`}}).then( Rol => {
                                message.guild.channels.create(`Sunucu İçi Destek Sistemi`, {
                                    type: "category"
                                }).then( Category => {
                                    message.guild.channels.create(`destek-yetkili-ekibi`, {
                                        type: `text`,
                                        permissionOverwrites: [
                                            {
                                                id: message.guild.id,
                                                deny: ["VIEW_CHANNEL","SEND_MESSAGES"]
                                            },
                                            {
                                                id: Rol.id,
                                                allow: ["VIEW_CHANNEL","SEND_MESSAGES"]
                                            }
                                        ],
                                        parent: Category.id
                                    }).then( supportStaffChat => {
                                        message.guild.channels.create(`support-channel`, {
                                            type: `text`,
                                            parent: Category.id,
                                            permissionOverwrites: [
                                             {
                                                id: message.guild.id,
                                                deny: ["ADD_REACTIONS","USE_EXTERNAL_EMOJIS"]
                                             }
                                            ]
                                        }).then( supportChannel => {
                                            message.guild.channels.create(`support-logs`, {
                                                type: `text`,
                                                parent: Category.id,
                                                permissionOverwrites: [
                                                {
                                                    id: Rol.id,
                                                    deny: ["SEND_MESSAGES","MANAGE_MESSAGES","ADD_REACTIONS"],
                                                    allow: ["VIEW_CHANNEL"]
                                                },
                                                {
                                                    id: message.guild.id,
                                                    deny: ["VIEW_CHANNEL"]
                                                }
                                                ]
                                            }).then( async supportLogs => {
                                                supportLogs.send({ embed: { color: `RANDOM`, description: `:white_check_mark: Kayıt kanalı başarı ile oluşturuldu, lütfen bu kanalı silmeyin. Aksi takdirde loglar, bilgilendirmeler veya destek sistemi ile ilgili hatalar bu kanalda kayıt altına alınmaz.`}}).catch(err => { return client.Error(message,"serversupport:kur",err); });
                                                const randomStr = await client.randomStr(6,"aA#");
                                                supportChannel.send(`:wave: Merhaba! Sunucu içi destek sistemine hoşgeldiniz. Yeni bir destek taleb oluşturabilmek için alt kutudaki doğrulama kodunu kanala yazınız ve talep kaydının oluşturulmasını bekleyiniz. \`\`\`${randomStr} - Destek alacığınız konu hakkında bilgi buraya.\`\`\``).then( async Message => {
                                                 try{
                                                    const Data = await SupportSchema.findOne({ serverID: message.guild.id }).exec();
                                                     Data.Key = randomStr
                                                     Data.MessageID = Message.id
                                                     Data.Stats.TotalTicket = 0
                                                     Data.Stats.SuccessTicket = 0
                                                     Data.Stats.FailedTicket = 0
                                                     Data.Stats.TotalMessage = 0
                                                     Data.Config.ParentID = Category.id
                                                     Data.Config.SupportChannel = supportChannel.id
                                                     Data.Config.SupportRoleID = Rol.id
                                                     Data.Config.TicketMessageContent = "ticket"
                                                     Data.Config.LogChannel = supportLogs.id
                                                     Data.Config.Bans = "[]"
                                                     Data.save((err,doc) => {
                                                        if(!err){
                                                            firstMsg.edit({ embed: {
                                                                color: `${client.config.Color.Success}`,
                                                                description: `:white_check_mark: Destek sistemi kurulumu başarı ile tamamlandı.`
                                                            }}).catch(err => { return client.Error(message,"support:kur",err); });
                                                        }
                                                     })
                                                 }catch(err){
                                                       const obj = {
                                                    serverID: message.guild.id,
                                                    Key: randomStr,
                                                    MessageID: Message.id,
                                                    Stats: {
                                                         TotalTicket: 0,
                                                         SuccessTicket: 0,
                                                         FailedTicket: 0,
                                                         TotalMessage: 0
                                                    },
                                                    Config: {
                                                         ParentID: Category.id,
                                                         SupportChannel: supportChannel.id,
                                                         SupportRoleID: Rol.id,
                                                         TicketMessageContent: `ticket`,
                                                         LogChannel: supportLogs.id
                                                    }
                                                }
                                                const push = new SupportSchema(obj);
                                                push.save((err,doc) => {
                                                    if(!err){
                                                        firstMsg.edit({ embed: {
                                                            color: `${client.config.Color.Success}`,
                                                            description: ":white_check_mark: Kurulum başarı ile tamamlandı."
                                                        }}).catch( err => { return client.Error(message,"serversupport:kur",err); });
                                                        return;
                                                    }

                                                    if(err){
                                                        client.Error(message,"support:kur",err);
                                                        return;
                                                    }
                                                });
                                                 }
                                                }).catch(err => { return client.Error(message,"serversupport:kur",err); });
                                            }).catch(err => { return client.Error(message,"serversupport:kur",err); });
                                        }).catch(err => { return client.Error(message,"serversupport:kur",err); });
                                    }).catch(err => { return client.Error(message,"serversupport:kur",err); });
                                }).catch(err => { return client.Error(message,"serversupport:kur",err); });
                            }).catch(err => { return client.Error(message,"serversupport:kur",err); });
                            return;
                        }

                        if(reaction.emoji.name == "❌"){
                            message.channel.send({ embed: {
                                color: `${client.config.Color.Error}`,
                                description: `:x: İşlem kullanıcı tarafından iptal edildi, destek sistemi kurulumu yapılmadı.`
                            }}).catch(err => { return client.Error(message,"serversupport:kur",err); });
                            return;
                        }
                    }).catch(err => {
                        console.log(err);
                        firstMsg.edit({
                            embed: {
                                color: `${client.config.Color.Error}`,
                                description: `:x: Belirtilen süre içerisinde seçim yapılmadığı için işlem iptal edildi.`
                            }
                        }).catch(err => { return client.Error(message,"serversupport:kur",err); });
                        return;
                    });
                }).catch(err => { return client.Error(message,"serversupport:kur",err); });
            }).catch(err => { return client.Error(message,"serversupport:kur",err); });
        }).catch(err => { return client.Error(message,"serversupport:kur",err); });
    return;
    }

    if(process == "kaldır"){
        message.channel.send({ embed: {
            color: `${client.config.Color.Info}`,
            description: `:question: Destek sistemii kaldırmak istediğinize emin misiniz?`,
            fields: [
            {
                name: "Not:",
                value: "Destek kayıtları kanalı (Log Kanalı) silinmeyecektir. Bu kanalı isteğe bağlı olarak elle silebilirsiniz."
            }
            ]
        }}).then( firstMsg => {
            firstMsg.react("✅").then( React1 => {
            firstMsg.react("❌").then( React2 => {
                const filter = (reaction, user) => { return user.id === message.author.id; };
                firstMsg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                    const reaction = collected.first();
                    firstMsg.reactions.removeAll().catch(err => { client.Error(message,"serversupport:kaldır",err); });
                    if( reaction.emoji.name == "✅"){
                        firstMsg.edit({ embed: {
                            color: `${client.config.Color.Loading}`,
                            description: `:timer: Sunucu içi destek sistemi kaldırılıyor, lütfen bekleyiniz...`
                        }}).then( async msg => {
                           try{
                            const Data = await SupportSchema.findOne({ serverID: message.guild.id }).exec();
                            message.guild.channels.cache.get(Data.Config.SupportChannel).delete().then( x => {
                                message.guild.channels.cache.get(Data.Config.ParentID).delete().then( y => {
                                    message.guild.roles.cache.get(Data.Config.SupportRoleID).delete( z => {
                                        message.guild.channels.cache.get(Data.Config.LogChannel).send(`:x: Destek sistemi başarı ile kapatıldı.`).catch(err => { cient.Error(message,"serversupport:kaldır",err); });
                                        SupportSchema.findOneAndDelete({ serverID: message.guild.id }).exec();
                                        msg.edit({ embed: {
                                            color: `${client.config.Color.Success}`,
                                            description: `:white_check_mark: Destek sistemi başarı ile kaldırıldı.`
                                        }}).catch(err => { client.Error(message,"serversupoprt:kaldır",err); });
                                    }).catch(err => { client.Error(message,"serversupport:kaldır",err); });
                                }).catch(err => { client.Error(message,"serversupport:kaldır",err); });
                            }).catch(err => { client.Error(message,"serversupport:kaldır",err); });
                        }catch(err){
                            firstMsg.edit({ embed: {
                                color: `${client.config.Color.Error}`,
                                description: `:warning: Sunucunuzda kurulu bir destek sistemi bulunamadı.`
                            }}).catch(err => { client.Error(message,"serversupport:kaldır",err); });
                        }
                        }).catch(err => { client.Error(messgae,"serversupport:kaldır",err); });
                        return;
                    }

                    if( reaction.emoji.name == "❌"){
                        firstMsg.edit({ embed: {
                            color: `${client.config.Color.Error}`,
                            description: `:x: İşlem kullanıcı tarafından iptal edildi.`
                        }}).catch(err => { client.Error(message,"serversupport:kaldır",err); });
                        return;
                    }
                }).catch(err => {
                    firstMsg.reactions.removeAll().catch(err => { client.Error(message,"ServerSupport:kaldır", err); });
                    firstMsg.edit({ embed: {
                        color: `${client.config.Color.Error}`,
                        description: `:warning: Belirtilen sürede geçim yapılmadı.`
                    }}).catch(err => { client.Error(message,"support:kaldır",err); });
                });
            })    
            })
        }).catch(err => { client.Error(message,"ServerSupport:kaldır",err); });
        return;
    }
}

exports.command = {
    name: "serversupport",
    aliases: ["server-support", "sunucudestek", "sd", "sp"],
    category: "util",
    permission: "MANAGE_GUIILD",
    cooldown: 3000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};