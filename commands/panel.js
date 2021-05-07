exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const PanelSchema = require('../models/ServerPanel');
    const process = args[0];
    if (!process) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Info}`,
                description: `:warning: Lütfen yapmak istediğiniz işlemi belirtin.` // buraya işlemler eklenicek
            }
        }).catch(err => { return; });
        return;
    }

    if (process == "kur" || process == "setup") {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Info}`,
                description: `:question: Merhaba! Sunucu içi istatistik panelini kurmak istediğinize emin misiniz?`
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
                                    description: `:timer: Kurulum başladı, lütfen bekleyin ve kurulum tamamlandı mesajını görene kadar herhangi bir işlem yapmayın.`
                                }
                            }).then(x => {
                                firstMsg.reactions.removeAll().catch(err => { return; });
                                message.guild.channels.create(`${message.guild.name} | Sunucu İstatistik`, { type: 'category' }).then(main => {
                                    main.setPosition("0").catch(err => { return; });
                                    message.guild.channels.create(`#1`, { type: "voice", parent: main.id }).then(totalMember => {
                                        message.guild.channels.create(`#2`, { type: "voice", parent: main.id }).then(onlineMember => {
                                            message.guild.channels.create(`#3`, { type: "voice", parent: main.id }).then(botSize => {
                                                message.guild.channels.create(`#4`, { type: "voice", parent: main.id }).then(rekorOnline => {
                                                    message.guild.channels.create(`#5`, { type: "voice", parent: main.id }).then(async voiceSize => {
                                                        const PanelData = await PanelSchema.findOne({ serverID: message.guild.id }).exec();
                                                        try {
                                                            PanelData.ChannelData.TotalUye = totalMember.id
                                                            PanelData.ChannelData.OnlineUye = onlineMember.id
                                                            PanelData.ChannelData.Bot = botSize.id
                                                            PanelData.ChannelData.RekorOnline = rekorOnline.id
                                                            PanelData.ChannelData.Voice = voiceSize.id
                                                            PanelData.save((err, doc) => {
                                                                if (!err) {
                                                                    firstMsg.edit({
                                                                        embed: {
                                                                            color: `${client.config.Color.Success}`,
                                                                            description: `:white_check_mark: Sunucu paneli başarı ile kuruldu. Kanal adlarını düzenlemek isterseniz \`\`${prefix}panel yardım\`\` komutu ile bilgi alabilirsiniz.`
                                                                        }
                                                                    }).then(secondMsg => {
                                                                        setTimeout(function () {
                                                                            client.serverPanel(message.guild.id);
                                                                        }, 2000);
                                                                    }).catch(err => { return; });
                                                                    return;
                                                                }

                                                                if (err) {
                                                                    firstMsg.edit({
                                                                        embed: {
                                                                            color: `${client.config.Color.Error}`,
                                                                            description: `:x: İşlem sırasında bir hata oluştu, lütfen daha sonra tekrar deneyin.`
                                                                        }
                                                                    }).catch(err => { return; });
                                                                    return;
                                                                }
                                                                return;
                                                            })
                                                        } catch (err) {
                                                            const obj = {
                                                                serverID: message.guild.id,
                                                                rekorOnline: 0,
                                                                ChannelData: {
                                                                    TotalUye: totalMember.id,
                                                                    OnlineUye: onlineMember.id,
                                                                    Bot: botSize.id,
                                                                    RekorOnline: rekorOnline.id,
                                                                    Voice: voiceSize.id
                                                                },
                                                                ChannelContent: {
                                                                    TotalUye: `Toplam Üye・{size}`,
                                                                    OnlineUye: `Çevrimiçi Üye・{size}`,
                                                                    Bot: `Bot・{size}`,
                                                                    RekorOnline: `Rekor Online・{size}`,
                                                                    Voice: `Sesli・{size}`
                                                                }
                                                            }
                                                            const push = new PanelSchema(obj);
                                                            push.save((err, doc) => {
                                                                if (!err) {
                                                                    firstMsg.edit({
                                                                        embed: {
                                                                            color: `${client.config.Color.Success}`,
                                                                            description: `:white_check_mark: Sunucu paneli kurulumu başarı ile tamamlandı.`
                                                                        }
                                                                    }).then(secondMsg => {
                                                                        setTimeout(function () { client.serverPanel(message.guild.id); }, 2000);
                                                                    }).catch(err => { return; });
                                                                }
                                                            })
                                                        }
                                                    }).catch(err => { return; });
                                                }).catch(err => { return; });
                                            }).catch(err => { return; });
                                        }).catch(err => { return; });
                                    }).catch(err => { return; });
                                }).catch(err => { return; });
                            }).catch(err => { return; });
                        } else if (reaction.emoji.name == "❌") {
                            firstMsg.reactions.removeAll();
                            firstMsg.edit({
                                embed: {
                                    color: `${client.config.Color.Success}`,
                                    description: `:x: Kurulum işlemi kullanıcı tarafından onaylanmadı.`
                                }
                            }).catch(err => { return; });
                            return;
                        } else {
                            firstMsg.edit({
                                embed: {
                                    color: `${client.config.Color.Error}`,
                                    description: `:x: Belirtilenlerden farklı bir reaksiyon verildi, işlem iptal edildi.`
                                }
                            }).catch(err => { return; });
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
        return;
    } else if (process == "güncelle" || process == "update") {
        await client.serverPanel(message.guild.id);
        message.channel.send({
            embed: {
                color: `${client.config.Color.Success}`,
                description: `:white_check_mark: Sunucu panel verileriz başarı ile güncellenmiştir.`
            }
        }).catch(err => { return; });
        return;
    } else if (process == "ayarla" || process == "config") {
        const PanelData = await PanelSchema.findOne({ serverID: message.guild.id }).exec();
        if (!args[1]) {
            message.channel.send({
                embed: {
                    color: `${client.config.Color.Info}`,
                    description: `**\`\`${prefix}panel config online-channel <Kanalİçeriği>\`\`** -> Çevirmiçi üye kanal adını değiştir.\n**\`\`${prefix}panel config total-member <Kanalİçeriği>\`\`**Toplam Üye kanalının adını değiştir.\n**\`\`${prefix}panel config bot-channel <Kanalİçeriği>\`\`** -> Bot sayısı kanal adını değiştir.\n**\`\`${prefix}panel config record-online <Kanalİçeriği>\`\`** -> Rekote online kanal adını değiştir.\n**\`\`${prefix}panel config voice-channel <Kanalİçeriği>\`\`** -> Sesli kanal adını değiştir.\n\n**NOT: Kanal içeriğini yazarken sayının görünmesini istediğiniz yere \`\`{size}\`\` yazınız!**`
                }
            }).then().catch(err => { return; });
            return;
        }
        if (args[1].toLowerCase() == "online-channel") {
            const content = args.slice(2).join(" ");
            if (!content) {
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Info}`,
                        description: `:warning: Lütfen komutu eksiksiz kullanın!\n**Örnek Kullanım:** \`\`${prefix}panel config online-channel Toplam Üye: {size}\`\``
                    }
                }).catch(err => { return; });
                return;
            }
            if (content.includes("{size}")) {
                try {
                    PanelData.ChannelContent.OnlineUye = content
                    PanelData.save((err, doc) => {
                        if (!err) {
                            message.channel.send({
                                embed: {
                                    color: `${client.config.Color.Success}`,
                                    description: `:white_check_mark: Kanal adı başarı ile güncellendi! Panel güncelleniyor, lütfen bekleyin.`
                                }
                            }).then(msg => {
                                setTimeout(function () { client.serverPanel(message.guild.id); }, 2500);
                            }).catch(err => { return; });
                            return;
                        }
                    });
                } catch (err) {
                    message.channel.send({
                        embed: {
                            color: `${client.config.Color.Error}`,
                            description: `:warning: Lütfen yazdığınız kanal adında sayının görünmesini istediğiniz yere \`\`{size}\`\` ekleyerek tekrar deneyiniz.`
                        }
                    }).catch(err => { return; });
                }
            } else {
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Info}`,
                        description: `:warning: Lütfen komutu eksiksiz kullanın ve kanal adı içerisinde \`\`{size}\`\` değerini eklediğinize emin olun!\n**Örnek Kullanım:** \`\`${prefix}panel config online-channel Toplam Üye: {size}\`\``
                    }
                }).catch(err => { return; });
                return;
            }
            return;
        }
        if (args[1].toLowerCase() == "total-member") {
            const content = args.slice(2).join(" ");
            if (!content) {
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Info}`,
                        description: `:warning: Lütfen komutu eksiksiz kullanın!\n**Örnek Kullanım:** \`\`${prefix}panel config total-member Toplam Üye: {size}\`\``
                    }
                }).catch(err => { return; });
                return;
            }
            if (content.includes("{size}")) {
                try {
                    PanelData.ChannelContent.TotalUye = content
                    PanelData.save((err, doc) => {
                        if (!err) {
                            message.channel.send({
                                embed: {
                                    color: `${client.config.Color.Success}`,
                                    description: `:white_check_mark: Kanal adı başarı ile güncellendi! Panel güncelleniyor, lütfen bekleyin.`
                                }
                            }).then(msg => {
                                setTimeout(function () { client.serverPanel(message.guild.id); }, 2500);
                            }).catch(err => { return; });
                            return;
                        }
                    });
                } catch (err) {
                    message.channel.send({
                        embed: {
                            color: `${client.config.Color.Error}`,
                            description: `:warning: Lütfen yazdığınız kanal adında sayının görünmesini istediğiniz yere \`\`{size}\`\` ekleyerek tekrar deneyiniz.`
                        }
                    }).catch(err => { return; });
                }
            } else {
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Info}`,
                        description: `:warning: Lütfen komutu eksiksiz kullanın ve kanal adı içerisinde \`\`{size}\`\` değerini eklediğinize emin olun!\n**Örnek Kullanım:** \`\`${prefix}panel config online-channel Toplam Üye: {size}\`\``
                    }
                }).catch(err => { return; });
                return;
            }
            return;
        }
        if (args[1].toLowerCase() == "voice-channel") {
            const content = args.slice(2).join(" ");
            if (!content) {
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Info}`,
                        description: `:warning: Lütfen komutu eksiksiz kullanın!\n**Örnek Kullanım:** \`\`${prefix}panel config voice-channel Toplam Üye: {size}\`\``
                    }
                }).catch(err => { return; });
                return;
            }
            if (content.includes("{size}")) {
                try {
                    PanelData.ChannelContent.Voice = content
                    PanelData.save((err, doc) => {
                        if (!err) {
                            message.channel.send({
                                embed: {
                                    color: `${client.config.Color.Success}`,
                                    description: `:white_check_mark: Kanal adı başarı ile güncellendi! Panel güncelleniyor, lütfen bekleyin.`
                                }
                            }).then(msg => {
                                setTimeout(function () { client.serverPanel(message.guild.id); }, 2500);
                            }).catch(err => { return; });
                            return;
                        }
                    });
                } catch (err) {
                    message.channel.send({
                        embed: {
                            color: `${client.config.Color.Error}`,
                            description: `:warning: Lütfen yazdığınız kanal adında sayının görünmesini istediğiniz yere \`\`{size}\`\` ekleyerek tekrar deneyiniz.`
                        }
                    }).catch(err => { return; });
                }
            } else {
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Info}`,
                        description: `:warning: Lütfen komutu eksiksiz kullanın ve kanal adı içerisinde \`\`{size}\`\` değerini eklediğinize emin olun!\n**Örnek Kullanım:** \`\`${prefix}panel config online-channel Toplam Üye: {size}\`\``
                    }
                }).catch(err => { return; });
                return;
            }
            return;
        }
        if (args[1].toLowerCase() == "bot-channel") {
            const content = args.slice(2).join(" ");
            if (!content) {
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Info}`,
                        description: `:warning: Lütfen komutu eksiksiz kullanın!\n**Örnek Kullanım:** \`\`${prefix}panel config bot-channel Toplam Üye: {size}\`\``
                    }
                }).catch(err => { return; });
                return;
            }
            if (content.includes("{size}")) {
                try {
                    PanelData.ChannelContent.Bot = content
                    PanelData.save((err, doc) => {
                        if (!err) {
                            message.channel.send({
                                embed: {
                                    color: `${client.config.Color.Success}`,
                                    description: `:white_check_mark: Kanal adı başarı ile güncellendi! Panel güncelleniyor, lütfen bekleyin.`
                                }
                            }).then(msg => {
                                setTimeout(function () { client.serverPanel(message.guild.id); }, 2500);
                            }).catch(err => { return; });
                            return;
                        }
                    });
                } catch (err) {
                    message.channel.send({
                        embed: {
                            color: `${client.config.Color.Error}`,
                            description: `:warning: Lütfen yazdığınız kanal adında sayının görünmesini istediğiniz yere \`\`{size}\`\` ekleyerek tekrar deneyiniz.`
                        }
                    }).catch(err => { return; });
                }
            } else {
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Info}`,
                        description: `:warning: Lütfen komutu eksiksiz kullanın ve kanal adı içerisinde \`\`{size}\`\` değerini eklediğinize emin olun!\n**Örnek Kullanım:** \`\`${prefix}panel config online-channel Toplam Üye: {size}\`\``
                    }
                }).catch(err => { return; });
                return;
            }
            return;
        }
        if (args[1].toLowerCase() == "record-online") {
            const content = args.slice(2).join(" ");
            if (!content) {
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Info}`,
                        description: `:warning: Lütfen komutu eksiksiz kullanın!\n**Örnek Kullanım:** \`\`${prefix}panel config online-channel Toplam Üye: {size}\`\``
                    }
                }).catch(err => { return; });
                return;
            }
            if (content.includes("{size}")) {
                try {
                    PanelData.ChannelContent.RekorOnline = content
                    PanelData.save((err, doc) => {
                        if (!err) {
                            message.channel.send({
                                embed: {
                                    color: `${client.config.Color.Success}`,
                                    description: `:white_check_mark: Kanal adı başarı ile güncellendi! Panel güncelleniyor, lütfen bekleyin.`
                                }
                            }).then(msg => {
                                setTimeout(function () { client.serverPanel(message.guild.id); }, 2500);
                            }).catch(err => { return; });
                            return;
                        }
                    });
                } catch (err) {
                    message.channel.send({
                        embed: {
                            color: `${client.config.Color.Error}`,
                            description: `:warning: Lütfen yazdığınız kanal adında sayının görünmesini istediğiniz yere \`\`{size}\`\` ekleyerek tekrar deneyiniz.`
                        }
                    }).catch(err => { return; });
                }
            } else {
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Info}`,
                        description: `:warning: Lütfen komutu eksiksiz kullanın ve kanal adı içerisinde \`\`{size}\`\` değerini eklediğinize emin olun!\n**Örnek Kullanım:** \`\`${prefix}panel config online-channel Toplam Üye: {size}\`\``
                    }
                }).catch(err => { return; });
                return;
            }
            return;
        }
    } else if (process == "kaldır" || process == "uninstall") {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Info}`,
                description: `:question: Sunucu içi panel bilgi sistemini kaldırmak istediğinize emin misiniz?`
            }
        }).then(firstMsg => {
            firstMsg.react("✅").then(React1 => {
                firstMsg.react("❌").then(React2 => {
                    const filter = (reaction, user) => { return user.id === message.author.id; };
                    firstMsg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                        const reaction = collected.first();
                        if (reaction.emoji.name == "✅") {
                            firstMsg.reactions.removeAll().catch(err => { return; });
                            firstMsg.edit({
                                embed: {
                                    color: `${client.config.Color.Loading}`,
                                    description: `:timer: Paneller kaldırılıyor, lütfen bekleyin.`
                                }
                            }).then(async msg => {
                                const PanelData = await PanelSchema.findOne({ serverID: message.guild.id }).exec();
                                try {
                                    message.guild.channels.cache.get(message.guild.channels.cache.get(PanelData.ChannelData.OnlineUye).parentID).delete().then(delete0 => {
                                        message.guild.channels.cache.get(PanelData.ChannelData.TotalUye).delete().then(delete2 => {
                                            message.guild.channels.cache.get(PanelData.ChannelData.Bot).delete().then(delete3 => {
                                                message.guild.channels.cache.get(PanelData.ChannelData.OnlineUye).delete().then(delete4 => {
                                                    message.guild.channels.cache.get(PanelData.ChannelData.Voice).delete().then(delete5 => {
                                                        message.guild.channels.cache.get(PanelData.ChannelData.RekorOnline).delete().then(async delete6 => {
                                                            await PanelSchema.findOneAndDelete({ serverID: message.guild.id }).exec();
                                                            firstMsg.edit({
                                                                embed: {
                                                                    color: `${client.config.Color.Success}`,
                                                                    description: `:white_check_mark: Panel başarı ile kaldırıldı.`
                                                                }
                                                            }).catch(err => { return; });
                                                        }).catch(err => { return; });
                                                    }).catch(err => { return; });
                                                }).catch(err => { return; });
                                            }).catch(err => { return; });
                                        }).catch(err => { return; });
                                    }).catch(err => { return; });
                                } catch (err) {
                                    firstMsg.edit({
                                        embed: {
                                            color: `${client.config.Color.Error}`,
                                            description: `:warning: İşlem sırasında bir hata oluştu lütfen daha sonra tekrar deneyiniz.`
                                        }
                                    }).catch(err => { return; });
                                    return;
                                }
                            }).catch(err => { return; });
                            return;
                        }
                        if (reaction.emoji.name == "❌") {
                            firstMsg.reactions.removeAll().catch(err => { return; });
                            firstMsg.edit({
                                embed: {
                                    color: `${client.config.Color.Error}`,
                                    description: `:x: İşlem kullanıcı tarafından iptal edildi.`
                                }
                            }).catch(err => { return; });
                        }
                    }).catch(err => {
                        firstMsg.reactions.removeAll();
                        firstMsg.edit({
                            embed: {
                                color: `${client.config.Color.Error}`,
                                description: `:warning: Belirli bir zaman içerisinde seçim yapmadığınız için panel kaldırma işlemi iptal edildi, lütfen tekrar deneyin.`
                            }
                        });
                        return;
                    })
                }).catch(err => { return; });
            }).catch(err => { return; });
        }).catch(err => { return; });
    }
}

exports.command = {
    name: "panel",
    aliases: ["server-panel"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 59000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};