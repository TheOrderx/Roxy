exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const Schema = require('../models/ServerInvite');
    const msg = args.slice(0).join(" ");

    if (!msg) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Info}`,
                description: `:warning: Lütfen bir mesaj belirtin.`,
                fields: [
                    {
                        name: `Kullanılabilecek Argümanlar:`,
                        value: "``{user.name}`` -> Çıkış yapan kullanıcının adı.\n``{member.size}`` -> Sunucudaki üye sayısı\n``{davet.kod}`` -> Kullanılan davetiye kodu\n``{davet.uye}`` -> Kullanıcıyı davet eden üye."
                    }
                ]
            }
        }).catch(err => { client.Error(message, "davetsayaç:ayar", err); });
        return;
    }

    try {
        const Data = await Schema.findOne({ serverID: message.guild.id }).exec();
        Data.JoinMessage = msg
        Data.save((err, doc) => {
            if (!err) {
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Success}`,
                        description: `:white_check_mark: Davetiye sayaç giriş mesajı başarı ile güncellendi.`
                    }
                }).catch(err => { client.Error(message, "davetsayaç:ayar", err); });
                return;
            }

            if (err) {
                client.Error(message, "davetsayaç:ayar", err);
                return;
            }
        });
    } catch (err) {
        const obj = { serverID: message.guild.id, JoinMessage: msg }
        const push = new Schema(obj);
        push.save((err, doc) => {
            if (!err) {
                message.channel.send({
                    embed: {
                        color: `${client.config.Color.Success}`,
                        description: `:white_check_mark: Davetiye sayaç giriş mesajı başarı ile güncellendi.`
                    }
                }).catch(err => { client.Error(message, "davetsayaç:ayar", err); });
                return;
            }

            if (err) {
                client.Error(message, "davetsayaç:ayar", err);
                return;
            }
        });
    }
}

exports.command = {
    name: "davet-giriş-mesaj-ayarla",
    aliases: ["davet-sayaç-giriş-mesaj-ayarla"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};