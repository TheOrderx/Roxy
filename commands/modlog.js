exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const guildSchema = require("../models/ModerationLogs");
    const Channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || args[0]
    if (!Channel) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Info}`,
                description: `:warning: Lütfen bir kanal belirterek komutu tekrar kullanınız. \n\`\`${prefix}modlog #Kanal\`\``
            }
        }).catch(err => { return client.Error(message,"modlog",err); });
        return;
    }
    if (args[0] == "kapat") {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Info}`,
                description: `:question: Moderatör kayıt kanalı ayarını kapatmak istediğinize emin misiniz?`
            }
        }).then(firstMsg => {
            firstMsg.react("✅").then(React1 => {
                firstMsg.react("❌").then(React2 => {
                    const filter = (reaction, user) => { return user.id === message.author.id; };
                    firstMsg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                        const reaction = collected.first();
                        if (reaction.emoji.name == "✅") {
                            firstMsg.edit({
                                embed: {
                                    color: `${client.config.Color.Loading}`,
                                    description: `:timer: Moderatör kayıt kanalı ayarı kapatılıyor, lütfen bekleyin...`
                                }
                            }).then(secondMsg => {
                                firstMsg.reactions.removeAll().catch(err => { return client.Error(message,"modlog:kapat",err); });
                                guildSchema.findOneAndDelete({ serverID: message.guild.id }).exec();
                                firstMsg.edit({
                                    embed: {
                                        color: `${client.config.Color.Success}`,
                                        description: `:white_check_mark: Moderatör kayıt kanalı ayarı başarı ile kapatıldı, artık sunucu kayıtları kanala gönderilmeyecek.`
                                    }
                                }).catch(err => { return client.Error(message,"modlog:kapat",err); });
                            }).catch(err => { return client.Error(message,"modlog:kapat",err); });
                        } else if (reaction.emoji.name == "❌") {
                            firstMsg.edit({
                                embed: {
                                    color: `${client.config.Color.Success}`,
                                    description: `:white_check_mark: Ayarları kapatma işlemi iptal edildi, tekrar bizi tercih ettiğiniz için teşekkür ederiz!`
                                }
                            }).then(secondMsg => {
                                firstMsg.reactions.removeAll().catch(err => { return client.Error(message,"modlog:kapat",err); });
                                return;
                            }).catch(err => { return client.Error(message,"modlog:kapat",err); });
                        } else {
                            firstMsg.edit({
                                embed: {
                                    color: `${client.config.Color.Error}`,
                                    description: `:x: Belirtilenlerden farklı bir reaksiyon verildi, işlem iptal edildi.`
                                }
                            }).catch(err => { return client.Error(message,"modlog:kapat",err); });
                            firstMsg.reactions.removeAll();
                            return;
                        }
                    }).catch(err => {
                        firstMsg.edit({
                            embed: {
                                color: `${client.config.Color.Error}`,
                                description: `:x: 30 saniye içerisinde seçim yapmadığınız için işlem iptal edildi.`
                            }
                        }).catch(err => { return; });
                        firstMsg.reactions.removeAll();
                    });
                }).catch(err => { return; });
            }).catch(err => { return; });
        }).catch(err => { return; });
    } else if (Channel.id) {
        const serverData = await guildSchema.findOne({ serverID: message.guild.id }).exec();
        try {
            serverData.Staff = message.author.tag
            serverData.StaffID = message.author.id
            serverData.ChannelID = Channel.id

            serverData.save((err, doc) => {
                if (!err) {
                    message.channel.send({
                        embed: {
                            color: `${client.config.Color.Success}`,
                            description: `:white_check_mark: Moderatör kayıt kanalınız başarı ile **#${Channel.name}** olarak ayarlandı.`
                        }
                    }).catch(err => { return; });
                    return;
                }
                if (err) {
                    message.channel.send({
                        embed: {
                            color: `${client.config.Color.Error}`,
                            description: `:x: İşlem sırasında bir hata oluştu, lütfen tekrar deneyin. Hala işlem olumsuz sonuçlanıyor ise lüfen geliştiriciler ile iletişime geçiniz.`
                        }
                    }).catch(err => { return; });
                    return;
                }
            });
        } catch (err) {
            const obj = {
                serverID: message.guild.id,
                Staff: message.author.tag,
                StaffID: message.guild.id,
                ChannelID: Channel.id
            }
            const push = new guildSchema(obj);
            push.save((err, doc) => {
                if (!err) {
                    message.channel.send({
                        embed: {
                            color: `${client.config.Color.Success}`,
                            description: `:white_check_mark: Moderatör kayıt kanalınız başarı ile **#${Channel.name}** olarak ayarlandı.`
                        }
                    }).catch(err => { return; });
                    return;
                }
                if (err) {
                    message.channel.send({
                        embed: {
                            color: `${client.config.Color.Error}`,
                            description: `:x: İşlem sırasında bir hata oluştu, lütfen tekrar deneyin. Hala işlem olumsuz sonuçlanıyor ise lüfen geliştiriciler ile iletişime geçiniz.`
                        }
                    }).catch(err => { return; });
                    return;
                }
            });
        }
    } else {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Info}`,
                description: `:warning: Lütfen bir kanal belirterek komutu tekrar kullanınız. \n\`\`${prefix}modlog #Kanal\`\``
            }
        }).catch(err => { return; });
        return;
    }
}

exports.command = {
    name: "modlog",
    aliases: ["mod-log-ayarla", "modlogayarla", "logayarla"],
    category: "config",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};