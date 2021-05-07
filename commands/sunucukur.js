exports.run = async (client, message, args) => {
    message.channel.send({
        embed: {
            color: `${client.config.Color.Info}`,
            description: `:warning: **Dikkat!** Sunucu kurulumu yapmak istediğinize emin misiniz?\n**Tüm kanallar silinecektir ve bu işlem geri alınamaz.**`
        }
    }).then(firstMsg => {
        firstMsg.react("✅").then(React1 => {
            firstMsg.react("❌").then(React2 => {
                const filter = (reaction, user) => { return user.id === message.author.id; };
                firstMsg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(approveReaction => {
                    const approveStatus = approveReaction.first();
                    firstMsg.reactions.removeAll().then(x => {
                        if (approveStatus.emoji.name == "✅") {
                            firstMsg.edit({
                                embed: {
                                    color: `${client.config.Color.Loading}`,
                                    description: `Lütfen kurmak istediğiniz sunucu tipini seçin.`,
                                    fields: [
                                        {
                                            name: "J4J (Join4Join)",
                                            value: `Emoji: 🔴`
                                        },
                                        {
                                            name: `Giflend`,
                                            value: `Emoji: 🟢`
                                        },
                                        {
                                            name: "Yayıncı Sunucusu",
                                            value: `Emoji: 🟡`
                                        },
                                        {
                                            name: "Sohbet Sunucusu",
                                            value: "Emoji: 🟣"
                                        }
                                    ]
                                }
                            }).then(secondMsg => {
                                secondMsg.react("🔴").then(a => {
                                    secondMsg.react("🟢").then(b => {
                                        secondMsg.react("🟡").then(c => {
                                            secondMsg.react("🟣").then(d => {
                                                secondMsg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(selectorReactStatus => {
                                                    const selectorReact = selectorReactStatus.first();

                                                    if (selectorReact.emoji.name == "🔴") {
                                                        secondMsg.edit({
                                                            embed: {
                                                                color: `RANDOM`,
                                                                description: `Kurulum yapılıyor, bu işlem uzun sürebilir. Lütfen sabırlı olun..`
                                                            }
                                                        }).then(sakso => {
                                                            message.guild.channels.cache.forEach((channel, i) => {
                                                                setTimeout(function () {
                                                                    channel.delete();
                                                                }, i.substr(0, 1) * 500)
                                                            });

                                                            setTimeout(function () {
                                                                message.guild.channels.create(`🎈`, { type: "category" }).then(XCategory => {
                                                                    message.guild.channels.create(`🍁`, { type: "category" }).then(YCategory => {
                                                                        message.guild.channels.create(`🎈`, { type: "category" }).then(ZCategory => {
                                                                            message.guild.channels.create("🔔・announcement", { type: "text", parent: `${XCategory.id}`, permissionOverwrites: [{ id: message.guild.id, deny: ["SEND_MESSAGES"] }] }).then(ch1 => {
                                                                                message.guild.channels.create("🎁・giveaways", { type: "text", parent: `${XCategory.id}`, permissionOverwrites: [{ id: message.guild.id, deny: ["SEND_MESSAGES"] }] }).then(ch1 => {
                                                                                    message.guild.channels.create("🌏・welcome", { type: "text", parent: `${XCategory.id}`, permissionOverwrites: [{ id: message.guild.id, deny: ["SEND_MESSAGES"] }] }).then(ch1 => {
                                                                                        message.guild.channels.create("💡・rank", { type: "text", parent: `${XCategory.id}`, permissionOverwrites: [{ id: message.guild.id, deny: ["SEND_MESSAGES"] }] }).then(ch1 => {
                                                                                            message.guild.channels.create("🌵・j4j", { type: "text", parent: `${YCategory.id}`, permissionOverwrites: [{ id: message.guild.id, deny: ["SEND_TTS_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "MENTION_EVERYONE"] }] }).then(ch1 => {
                                                                                                message.guild.channels.create("🌻・s4s", { type: "text", parent: `${YCategory.id}`, permissionOverwrites: [{ id: message.guild.id, deny: ["SEND_TTS_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "MENTION_EVERYONE"] }] }).then(ch1 => {
                                                                                                    message.guild.channels.create("📍・commands", { type: "text", parent: `${YCategory.id}`, permissionOverwrites: [{ id: message.guild.id, deny: ["SEND_TTS_MESSAGES", "EMBED_LINKS", "MENTION_EVERYONE"], allow: "ATTACH_FILES" }] }).then(ch1 => {
                                                                                                        message.guild.channels.create("🚀・boost", { type: "text", parent: `${ZCategory.id}`, permissionOverwrites: [{ id: message.guild.id, deny: ["SEND_MESSAGES", "EMBED_LINKS", "MENTION_EVERYONE"] }] }).then(ch1 => {
                                                                                                            message.guild.channels.create("⚡・information", { type: "text", parent: `${ZCategory.id}`, permissionOverwrites: [{ id: message.guild.id, deny: ["SEND_MESSAGES", "EMBED_LINKS", "MENTION_EVERYONE"] }] }).then(chx => {
                                                                                                                message.guild.roles.create({ data: { name: `Master`, color: `RANDOM` } }).then(role => {
                                                                                                                    message.guild.roles.create({ data: { name: `Elite`, color: `RANDOM` } }).then(role => {
                                                                                                                        message.guild.roles.create({ data: { name: `Special`, color: `RANDOM` } }).then(role => {
                                                                                                                            message.guild.roles.create({ data: { name: `Mega İnviter ・ J4J`, color: `RANDOM` } }).then(role => {
                                                                                                                                message.guild.roles.create({ data: { name: `Small İnviter ・ J4J`, color: `RANDOM` } }).then(role => {
                                                                                                                                    message.guild.roles.create({ data: { name: `Member ・ J4J`, color: `RANDOM` } }).then(role => {
                                                                                                                                        chx.send("Kurulum tamamlandı.");
                                                                                                                                    }).catch(err => { return; })
                                                                                                                                }).catch(err => { return; })
                                                                                                                            }).catch(err => { return; })
                                                                                                                        }).catch(err => { return; })
                                                                                                                    }).catch(err => { return; })
                                                                                                                }).catch(err => { return; })
                                                                                                            }).catch(err => { return; })
                                                                                                        }).catch(err => { return; })
                                                                                                    }).catch(err => { return; })
                                                                                                }).catch(err => { return; })
                                                                                            }).catch(err => { return; })
                                                                                        }).catch(err => { return; })
                                                                                    }).catch(err => { return; })
                                                                                }).catch(err => { return; })
                                                                            }).catch(err => { return; })
                                                                        }).catch(err => { return; })
                                                                    }).catch(err => { return; })
                                                                }).catch(err => { return; })
                                                            }, 5 * 1000)
                                                        })
                                                        return;
                                                    }

                                                    if (selectorReact.emoji.name == "🟢") {
                                                        const mgc = message.guild.channels
                                                        secondMsg.edit({
                                                            embed: {
                                                                color: `RANDOM`,
                                                                description: `Kurulum yapılıyor, bu işlem uzun sürebilir. Lütfen sabırlı olun..`
                                                            }
                                                        }).then(sakso => {
                                                            message.guild.channels.cache.forEach((channel, i) => {
                                                                setTimeout(function () {
                                                                    channel.delete();
                                                                }, i.substr(0, 1) * 500)
                                                            });

                                                            setTimeout(function () {
                                                                mgc.create(`Bilgilendirme`, { type: "category" }).then(XCategory => {
                                                                    mgc.create(`📜・kurallar`, { type: "text", parent: `${XCategory.id}` }).then(ch1 => {
                                                                        mgc.create(`📣・duyurular`, { type: "text", parent: `${XCategory.id}` }).then(ch2 => {
                                                                            mgc.create(`🔌・server-boosting`, { type: "text", parent: `${XCategory.id}` }).then(ch2 => {
                                                                                mgc.create(`📌・diğer-sunucular`, { type: "text", parent: `${XCategory.id}` }).then(ch2 => {
                                                                                    mgc.create("Genel Kanallar", { type: "category" }).then(Category => {
                                                                                        mgc.create("💬・sohbet", { type: "text", parent: `${Category.id}` }).then(ch => {
                                                                                            mgc.create("🤖・bot-komut", { type: "text", parent: `${Category.id}` }).then(ch => {
                                                                                                mgc.create("📷・medya", { type: "text", parent: `${Category.id}` }).then(ch => {
                                                                                                    mgc.create("Man", { type: "category" }).then(Category => {
                                                                                                        mgc.create("🧑・man-foto", { type: "text", parent: `${Category.id}` }).then(ch => {
                                                                                                            mgc.create("🧑・man-gi̇f", { type: "text", parent: `${Category.id}` }).then(ch => {
                                                                                                                mgc.create("🧑・man-vi̇p", { type: "text", parent: `${Category.id}` }).then(ch => {
                                                                                                                    mgc.create("Woman", { type: "category" }).then(Category => {
                                                                                                                        mgc.create("👩・woman-foto", { type: "text", parent: `${Category.id}` }).then(ch => {
                                                                                                                            mgc.create("👩・woman-gi̇f", { type: "text", parent: `${Category.id}` }).then(ch => {
                                                                                                                                mgc.create("👩・woman-vi̇p", { type: "text", parent: `${Category.id}` }).then(ch => {
                                                                                                                                    mgc.create("Animal", { type: "category" }).then(Category => {
                                                                                                                                        mgc.create("🐱・ani̇mal-foto", { type: "text", parent: `${Category.id}` }).then(ch => {
                                                                                                                                            mgc.create("🐱・ani̇mal-gi̇f", { type: "text", parent: `${Category.id}` }).then(ch => {
                                                                                                                                                mgc.create("🐱・ani̇mal-vip", { type: "text", parent: `${Category.id}` }).then(ch => {
                                                                                                                                                    mgc.create("Couple", { type: "category" }).then(Category => {
                                                                                                                                                        mgc.create("💞・couple-foto", { type: "text", parent: `${Category.id}` }).then(ch => {
                                                                                                                                                            mgc.create("💞・couple-gif", { type: "text", parent: `${Category.id}` }).then(ch => {
                                                                                                                                                                mgc.create("💞・couple-vip", { type: "text", parent: `${Category.id}` }).then(ch => {
                                                                                                                                                                    mgc.create("Famous", { type: "category" }).then(Category => {
                                                                                                                                                                        mgc.create("⭐・famous-foto", { type: "text", parent: `${Category.id}` }).then(ch => {
                                                                                                                                                                            mgc.create("⭐・famous-gi̇f", { type: "text", parent: `${Category.id}` }).then(ch => {
                                                                                                                                                                                mgc.create("⭐・famous-vi̇p", { type: "text", parent: `${Category.id}` }).then(ch => {
                                                                                                                                                                                    ch.send(`<@${message.author.id}> - Kurulum başarı ile tamamlandı.`)
                                                                                                                                                                                }).catch(err => { return; })
                                                                                                                                                                            }).catch(err => { return; })
                                                                                                                                                                        }).catch(err => { return; })
                                                                                                                                                                    }).catch(err => { return; })
                                                                                                                                                                }).catch(err => { return; })
                                                                                                                                                            }).catch(err => { return; })
                                                                                                                                                        }).catch(err => { return; })
                                                                                                                                                    }).catch(err => { return; })
                                                                                                                                                }).catch(err => { return; })
                                                                                                                                            }).catch(err => { return; })
                                                                                                                                        }).catch(err => { return; })
                                                                                                                                    }).catch(err => { return; })
                                                                                                                                }).catch(err => { return; })
                                                                                                                            }).catch(err => { return; })
                                                                                                                        }).catch(err => { return; })
                                                                                                                    }).catch(err => { return; })
                                                                                                                }).catch(err => { return; })
                                                                                                            }).catch(err => { return; })
                                                                                                        }).catch(err => { return; })
                                                                                                    }).catch(err => { return; })
                                                                                                }).catch(err => { return; })
                                                                                            }).catch(err => { return; })
                                                                                        }).catch(err => { return; })
                                                                                    }).catch(err => { return; })
                                                                                }).catch(err => { return; })
                                                                            }).catch(err => { return; })
                                                                        }).catch(err => { return; })
                                                                    }).catch(err => { return; })
                                                                })
                                                            })
                                                        }, 5 * 1000)

                                                        return;
                                                    }

                                                    if (selectorReact.emoji.name == "🟡") {
                                                        const mgc = message.guild.channels
                                                        const mgr = message.guild.roles
                                                        secondMsg.edit({
                                                            embed: {
                                                                color: `RANDOM`,
                                                                description: `Kurulum yapılıyor, bu işlem uzun sürebilir. Lütfen sabırlı olun..`
                                                            }
                                                        }).then(sakso => {
                                                            message.guild.channels.cache.forEach((channel, i) => {
                                                                setTimeout(function () {
                                                                    channel.delete();
                                                                }, i.substr(0, 1) * 500)
                                                            });

                                                            setTimeout(function () {
                                                                mgr.create({ data: { name: "🌼・ ilaypisicik", color: "RANDOM", hoist: true, permissions: ["ADMINISTRATOR"] } }).then(x => {
                                                                    mgr.create({ data: { name: "🔑", color: "RANDOM", hoist: false, permissions: ["ADMINISTRATOR"] } }).then(x => {
                                                                        mgr.create({ data: { name: "💼・ Yetkileri", color: "RANDOM" } }).then(x => {
                                                                            mgr.create({ data: { name: "⚡・ Moderatör", color: "RANDOM" } }).then(x => {
                                                                                mgr.create({ data: { name: "🔒・Ban Hammer", color: "RED" }, permissions: ["BAN_MEMBERS", "KICK_MEMBERS"] }).then(x => {
                                                                                    mgr.create({ data: { name: "🙌   ilaypisicik・Takipcisi", color: "RANDOM" } }).then(x => {
                                                                                        mgr.create({ data: { name: "🙌・Abone", color: "RANDOM" } }).then(x => {
                                                                                            mgr.create({ data: { name: "★・Vip", color: "RANDOM" } }).then(x => {
                                                                                                mgr.create({ data: { name: "🎥・Yayıncı", color: "RANDOM" } }).then(x => {
                                                                                                    mgr.create({ data: { name: "👀・Üye", color: "RANDOM" } }).then(Uye => {
                                                                                                        mgc.create(`「🌺」Örenk Register`, { type: `category`, permissionOverwrites: [{ id: Uye.id, deny: ["VIEW_CHANNEL"] }, { id: message.guild.id, allow: ["VIEW_CHANNEL"], deny: ["SEND_MESSAGES"] }] }).then(Category1 => {
                                                                                                            mgc.create(`「🔐」register`, { type: `text`, parent: `${Category1.id}` }).then(ch => {
                                                                                                                mgc.create(`「🔔」Yayın Anons`, { type: `category`, permissionOverwrites: [{ id: message.guild.id, deny: ["VIEW_CHANNEL"] }, { id: Uye.id, allow: ["VIEW_CHANNEL"], deny: ["SEND_MESSAGES"] }] }).then(Category2 => {
                                                                                                                    mgc.create(`「📹」y-kurallar`, { type: `text`, parent: Category2.id }).then(ch => {
                                                                                                                        mgc.create(`「📹」y-duyuru`, { type: `text`, parent: Category2.id }).then(ch => {
                                                                                                                            mgc.create(`「📹」y-saatleri`, { type: `text`, parent: Category2.id }).then(ch => {
                                                                                                                                mgc.create(`「📣」Discord Anons`, { type: `category`, permissionOverwrites: [{ id: message.guild.id, deny: ["VIEW_CHANNEL"] }, { id: Uye.id, allow: ["VIEW_CHANNEL"], deny: ["SEND_MESSAGES"] }] }).then(Category3 => {
                                                                                                                                    mgc.create(`「📃」kurallar`, { type: `text`, parent: `${Category3.id}`, permissionOverwrites: [{ id: message.guild.id, deny: ["SEND_MESSAGES"], allow: ["VIEW_CHANNEL"] }] }).then(ch => {
                                                                                                                                        mgc.create(`「📰」duyuru`, { type: `text`, parent: `${Category3.id}`, permissionOverwrites: [{ id: message.guild.id, deny: ["SEND_MESSAGES", "ADD_REACTIONS"], allow: ["VIEW_CHANNEL"] }] }).then(ch => {
                                                                                                                                            mgc.create(`「📊」anket`, { type: `text`, parent: `${Category3.id}`, permissionOverwrites: [{ id: message.guild.id, deny: ["SEND_MESSAGES", "ADD_REACTIONS"], allow: ["VIEW_CHANNEL"] }] }).then(ch => {
                                                                                                                                                mgc.create(`「📎」güncelleme`, { type: `text`, parent: `${Category3.id}`, permissionOverwrites: [{ id: message.guild.id, deny: ["SEND_MESSAGES"], allow: ["VIEW_CHANNEL"] }] }).then(ch => {
                                                                                                                                                    mgc.create(`「🌱」Discord Text`, { type: `category`, permissionOverwrites: [{ id: message.guild.id, deny: ["VIEW_CHANNEL"] }, { id: Uye.id, allow: ["VIEW_CHANNEL", "SEND_MESSAGES"], deny: ["MENTION_EVERYONE", "SEND_TTS_MESSAGES"] }] }).then(Category4 => {
                                                                                                                                                        mgc.create(`「💬」sohbet`, { type: `text`, parent: `${Category4.id}` }).then(ch => {
                                                                                                                                                            mgc.create(`「🎬」yayın-kesitleri`, { type: `text`, parent: `${Category4.id}` }).then(ch => {
                                                                                                                                                                mgc.create(`「📷」photo`, { type: `text`, parent: `${Category4.id}` }).then(ch => {
                                                                                                                                                                    mgc.create(`「🔨」bot-komutları`, { type: `text`, parent: `${Category4.id}` }).then(ch => {
                                                                                                                                                                        mgc.create(`「🌈」Discord Report`, { type: `category`, permissionOverwrites: [{ id: message.guild.id, deny: ["VIEW_CHANNEL"] }, { id: Uye.id, allow: ["VIEW_CHANNEL", "SEND_MESSAGES"], deny: ["MENTION_EVERYONE", "SEND_TTS_MESSAGES"] }] }).then(Category5 => {
                                                                                                                                                                            mgc.create(`「🔦」şikayetler`, { type: `text`, parent: `${Category5.id}` }).then(ch => {
                                                                                                                                                                                mgc.create(`「🔦」istekler`, { type: `text`, parent: `${Category5.id}` }).then(ch => {
                                                                                                                                                                                    mgc.create(`「🍒」Eğlence`, { type: `category`, permissionOverwrites: [{ id: message.guild.id, deny: ["VIEW_CHANNEL"] }, { id: Uye.id, allow: ["VIEW_CHANNEL", "SEND_MESSAGES"], deny: ["MENTION_EVERYONE", "SEND_TTS_MESSAGES"] }] }).then(Category6 => {
                                                                                                                                                                                        mgc.create(`「🎄」sayı・sayma`, { type: `text`, parent: `${Category6.id}` }).then(ch => {
                                                                                                                                                                                            mgc.create(`「🤙🏻」tuttu-tutmadı`, { type: `text`, parent: `${Category6.id}` }).then(channel => {
                                                                                                                                                                                                mgc.create(`Yayın Odaları`, { type: `category` }).then(Category7 => {
                                                                                                                                                                                                    mgc.create(`🌈 Yayın Odası`, { type: `voice`, parent: `${Category7.id}`, permissionOverwrites: [{ id: message.guild.id, deny: ["VIEW_CHANNEL"] }, { id: Uye.id, allow: ["VIEW_CHANNEL", "CONNECT"] }] }).then(ch => {
                                                                                                                                                                                                        mgc.create(`🔴 Yayın Bekleme`, { type: `voice`, parent: `${Category7.id}`, permissionOverwrites: [{ id: message.guild.id, deny: ["VIEW_CHANNEL"] }, { id: Uye.id, deny: ["CONNECT"], allow: ["VIEW_CHANNEL"] }] }).then(ch => {
                                                                                                                                                                                                            mgc.create(`Oyun Kanlları`, { type: `category`, permissionOverwrites: [{ id: message.guild.id, deny: ["VIEW_CHANNEL"] }, { id: Uye.id, allow: ["CONNECT", "VIEW_CHANNEL"] }] }).then(Category8 => {
                                                                                                                                                                                                                mgc.create(`「🔫」Valorant`, { type: `voice`, parent: `${Category8.id}` }).then(ch => {
                                                                                                                                                                                                                    mgc.create(`「🍳」PUBG Mobile`, { type: `voice`, parent: `${Category8.id}` }).then(ch => {
                                                                                                                                                                                                                        mgc.create(`AFK`, { type: `category` }).then(afk => {
                                                                                                                                                                                                                            mgc.create(`「🌙」Uyku Odası`, { type: `voice`, parent: afk.id }).then(ch => {
                                                                                                                                                                                                                                channel.send("kurulum tamamlandı.");
                                                                                                                                                                                                                            }).catch(err => { return; })
                                                                                                                                                                                                                        }).catch(err => { return; })
                                                                                                                                                                                                                    }).catch(err => { return; })
                                                                                                                                                                                                                }).catch(err => { return; })
                                                                                                                                                                                                            }).catch(err => { return; })
                                                                                                                                                                                                        }).catch(err => { return; })
                                                                                                                                                                                                    }).catch(err => { return; })
                                                                                                                                                                                                }).catch(err => { return; })
                                                                                                                                                                                            }).catch(err => { return; })
                                                                                                                                                                                        }).catch(err => { return; })
                                                                                                                                                                                    }).catch(err => { return; })
                                                                                                                                                                                }).catch(err => { return; })
                                                                                                                                                                            }).catch(err => { return; })
                                                                                                                                                                        }).catch(err => { return; })
                                                                                                                                                                    }).catch(err => { return; })
                                                                                                                                                                }).catch(err => { return; })
                                                                                                                                                            }).catch(err => { return; })
                                                                                                                                                        }).catch(err => { return; })
                                                                                                                                                    }).catch(err => { return; })
                                                                                                                                                }).catch(err => { return; })
                                                                                                                                            }).catch(err => { return; })
                                                                                                                                        }).catch(err => { return; })
                                                                                                                                    }).catch(err => { return; })
                                                                                                                                }).catch(err => { return; })
                                                                                                                            }).catch(err => { return; })
                                                                                                                        }).catch(err => { return; })
                                                                                                                    }).catch(err => { return; })
                                                                                                                }).catch(err => { return; })
                                                                                                            }).catch(err => { return; })
                                                                                                        }).catch(err => { return; })
                                                                                                    }).catch(err => { return; })
                                                                                                }).catch(err => { return; })
                                                                                            }).catch(err => { return; })
                                                                                        }).catch(err => { return; })
                                                                                    }).catch(err => { return; })
                                                                                }).catch(err => { return; })
                                                                            }).catch(err => { return; })
                                                                        }).catch(err => { return; })
                                                                    }).catch(err => { return; })
                                                                }).catch(err => { return; })
                                                            }, 5 * 1000)
                                                        })
                                                        return;
                                                    }
                             

                        if (selectorReact.emoji.name == "🟣") {
                            const mgc = message.guild.channels
                            const mgr = message.guild.roles
                            secondMsg.edit({
                                embed: {
                                    color: `RANDOM`,
                                    description: `Kurulum yapılıyor, bu işlem uzun sürebilir. Lütfen sabırlı olun..`
                                }
                            }).then(sakso => {
                                message.guild.channels.cache.forEach((channel, i) => {
                                    setTimeout(function () {
                                        channel.delete();
                                    }, i.substr(0, 1) * 500)
                                });

                                setTimeout(function () {
                                    mgr.create({ data: { name: "👑│KURUCU", color: "RANDOM", hoist: true, permissions: ["ADMINISTRATOR"] } }).then(Owner => {
                                        mgr.create({ data: { name: "🙂│ÜYE", color: "RANDOM", hoist: true } }).then(Member => {
                                            mgr.create({ data: { name: "❌│KAYITSIZ", color: "RANDOM", hoist: true } }).then(NonMember => {
                                                mgr.create({ data: { name: "🤖│Bot", color: "RANDOM", hoist: true } }).then(Bot => {
                                                    mgc.create(`▬▬│BİLGİLENDİRME│▬▬`,{ type: "category", permissionOverwrites: [{ id: message.guild.id, deny: ["SEND_MESSAGES"] }]}).then(Category1 => {
                                                        mgc.create(`📜│kurallar`, {type: "text", parent: `${Category1.id}`}).then(ch => {
                                                            mgc.create(`📢│duyurular`, {type: "text", parent: `${Category1.id}`}).then(ch => {
                                                                mgc.create(`🎉│çekiliş`, {type: "text", parent: `${Category1.id}`}).then(ch => {
                                                                    mgc.create("▬▬▬▬▬│GENEL│▬▬▬▬▬",{type: "category"}).then(Category2 => {
                                                                        mgc.create("💭│sohbet", {type: "text", parent: Category2.id}).then(cd => {
                                                                            mgc.create("🤖│komutlar", {type: "text", parent: Category2.id}).then(cd => {
                                                                                mgc.create("📷│foto-chat", {type: "text", parent: Category2.id}).then(cd => {
                                                                                    mgc.create("🎥│video-öneri", {type: "text", parent: Category2.id}).then(cd => {
                                                                                        mgc.create("🎬│şarkı-film-dizi-öneri", {type: "text", parent: Category2.id}).then(cd => {
                                                                                            mgc.create("💡│şikayet-öneri-chati", {type: "text", parent: Category2.id}).then(cd => {
                                                                                                mgc.create("📚│ders-çalışma", {type: "text", parent: Category2.id}).then(cd => {
                                                                                                    mgc.create("📗│kitap-öneri", {type: "text", parent: Category2.id}).then(cd => {
                                                                                                        mgc.create("📃│özlü-sözler", {type: "text", parent: Category2.id}).then(cd => {
                                                                                                            mgc.create("▬▬▬▬│EĞLENCE│▬▬▬▬", {type: "category"}).then(Category3 => {
                                                                                                                mgc.create("🎮│sayı-sayma", {type: "text", parent: `${Category3.id}`}).then(x => {
                                                                                                                    mgc.create("🎮│kelime-türetme", {type: "text", parent: `${Category3.id}`}).then(x => {
                                                                                                                        mgc.create("🎮│hikaye-oyunu", {type: "text", parent: `${Category3.id}`}).then(x => {
                                                                                                                            mgc.create("▬▬▬│SPECİAL ROOM│▬▬▬", {type: "category"}).then(Category4 => {
                                                                                                                                mgc.create("👑│King Room", {type: "voice", parent: `${Category4.id}`, permissionOverwrites: [{ id: message.guild.id, deny: ["VIEW_CHANNEL"] }]}).then(voice => {
                                                                                                                                    mgc.create("▬▬▬│SESLİ ODALAR│▬▬▬", {type: "category"}).then(Category5 => {
                                                                                                                                        mgc.create("💭│Sohbet『1』", {type: "voice", parent: `${Category5.id}`}).then(x => {
                                                                                                                                            mgc.create("💭│Sohbet『2』", {type: "voice", parent: `${Category5.id}`}).then(x => {
                                                                                                                                                mgc.create("🎵│Müzik『1』", {type: "voice", parent: `${Category5.id}`}).then(x => {
                                                                                                                                                    mgc.create("🎵│Müzik『2』", {type: "voice", parent: `${Category5.id}`}).then(x => {
                                                                                                                                                        mgc.create("🎮│Oyun『1』", {type: "voice", parent: `${Category5.id}`}).then(x => {
                                                                                                                                                            mgc.create("🎮│Oyun『2』", {type: "voice", parent: `${Category5.id}`}).then(x => {
                                                                                                                                                                mgc.create("▬▬▬▬▬│AFK│▬▬▬▬▬", {type: "category"}).then(Category6 => {
                                                                                                                                                                    mgc.create("💤│AFK", {type: "voice", parent: `${Category6.id}`}).then(x => {
                                                                                                                                                                        mgc.create("▬▬▬▬▬│KAYIT│▬▬▬▬▬", {type: "category"}).then(Category7 => {
                                                                                                                                                                            mgc.create("✨│kayıt-odası", {type: "text", parent: `${Category7.id}`}).then(sa => {
                                                                                                                                                                                sa.send("kurulum tamamlandı.")
                                                                                                                                                                            }).catch(err => { return; })
                                                                                                                                                                        }).catch(err => { return; })
                                                                                                                                                                    }).catch(err => { return; })
                                                                                                                                                                }).catch(err => { return; })
                                                                                                                                                            }).catch(err => { return; })
                                                                                                                                                        }).catch(err => { return; })
                                                                                                                                                    }).catch(err => { return; })
                                                                                                                                                }).catch(err => { return; })
                                                                                                                                            }).catch(err => { return; })
                                                                                                                                        }).catch(err => { return; })
                                                                                                                                    }).catch(err => { return; })
                                                                                                                                }).catch(err => { return; })
                                                                                                                            }).catch(err => { return; })
                                                                                                                        }).catch(err => { return; })
                                                                                                                    }).catch(err => { return; })
                                                                                                                }).catch(err => { return; })
                                                                                                            }).catch(err => { return; })
                                                                                                        }).catch(err => { return; })
                                                                                                    }).catch(err => { return; })
                                                                                                }).catch(err => { return; })
                                                                                            }).catch(err => { return; })
                                                                                        }).catch(err => { return; })
                                                                                    }).catch(err => { return; })
                                                                                }).catch(err => { return; })
                                                                            }).catch(err => { return; })
                                                                        }).catch(err => { return; })
                                                                    }).catch(err => { return; })
                                                                }).catch(err => { return; })
                                                            }).catch(err => { return; })
                                                        }).catch(err => { return; })
                                                    }).catch(err => { return; })
                                                }).catch(err => { return; })
                                            }).catch(err => { return; })
                                        }).catch(err => { return; })
                                    }).catch(err => { return; })
                                }, 5 * 1000)
                            })
                            return;
                        }
                    }).catch(err => { client.Error(message, "sunucukur", err); });
                }).catch(err => { client.Error(message, "sunucukur", err); });
            }).catch(err => { client.Error(message, "sunucukur", err); });
        }).catch(err => { client.Error(message, "sunucukur", err); });
    }).catch(err => { client.Error(message, "sunucukur", err); });
})
return;
                        }
                    }).catch (err => { client.Error(message, "sunucukur", err); });
                }).catch (err => { firstMsg.edit({ embed: { color: `${client.config.Color.Error}`, description: `Belirtilen sürede seçim yapılmadı.` } }); });
            }).catch (err => { client.Error(message, "sunucukur", err); });
        }).catch (err => { client.Error(message, "sunucukur", err); });
    }).catch (err => { client.Error(message, "sunucukur", err); });
}

exports.command = {
    name: "sunucukur",
    aliases: ["sunucu-kur"],
    category: "util",
    permission: "ADMINISTRATOR",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};