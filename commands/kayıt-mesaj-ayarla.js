exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const Schema = require('../models/ServerRegister');
    const Data = await Schema.findOne({ serverID: message.guild.id }).exec();
    const content = args.slice(0).join(" ");

    if (!content) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Info}`,
                description: `:warning: Lütfen sunucuya kullanıcı giriş yaptığında gönderilecek mesajı belirtiniz.`,
                fields: [
                    {
                        name: `Kullanılabilir argümanlar:`,
                        value: "``{user.etiket}`` -> Sunucuya giren kullanıcıyı etiketler.\n``{user.name}`` -> Sunucuya giren kullanıcının adını yazar.\n``{yetkili.etiket}`` -> Yetkili rolünü etiketler.\n``{yetkili.name}`` -> Yetkili rolünün adını yazar."
                    },
                    {
                        name: `Not:`,
                        value: `:warning: Her bir etiket sadece tek sefer kullanılabilir.`
                    }
                ]
            }
        }).catch(err => { client.Error(message, "kayıt:config", err); });
        return;
    }

    if ((content.length > 512) == true) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Error}`,
                description: `:warning: Yazdığınız mesaj 512 karakterden fazla olamaz.`
            }
        }).catch(err => { client.Error(message, "kayıt:config", err); });
        return;
    }

    try {
        Data.JoinMessage = content
        Data.save((err, doc) => {
            if (!err) {
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Success}`,
                        description: `:white_check_mark: Giriş mesajı başarı ile ayarlandı.`
                    }
                }).catch(err => { client.Error(message, "kayıt:config", err); });
                return;
            }

            if (err) {
                client.Error(message, "kayıt:config", err);
                return;
            }
        });
    } catch (err) {
        message.channel.send({ embed: {
            color: `${client.config.Color.Error}`,
            description: `:warning: Lütfen bir kayıt kanalı ayarlayın.`
        }}).catch(err => { client.Error(message,"kayıt:rol-ayarla",err); });
        return;
    }
}

exports.command = {
    name: "kayıt-mesaj",
    aliases: ["register-message","kayıt-mesaj-ayarla"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};