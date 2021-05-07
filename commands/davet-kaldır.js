exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const Schema = require('../models/ServerInvite');

    message.channel.send({
        embed: {
            color: `${client.config.Color.Info}`,
            description: `:timer: Ayarlar sıfırlanıyor, lütfen bekleyiniz...`
        }
    }).then(firstMsg => {
        Schema.findOneAndDelete({ serverID: message.guild.id }).exec();
        firstMsg.edit({
            embed: {
                color: `${client.config.Color.Success}`,
                description: `:white_check_mark: Ayarlar başarı ile sıfırlandı.`
            }
        }).catch(err => { client.Error(message, "davetsayaç:kaldır", err); });
    }).catch(err => { client.Error(message, "davetsayaç:kaldır", err); });
}

exports.command = {
    name: "davet-kaldır",
    aliases: ["davet-sayaç-kaldır"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};