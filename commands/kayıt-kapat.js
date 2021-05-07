exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const process = args[0];
    const Schema = require('../models/ServerRegister');

    Schema.findOneAndDelete({ serverID: message.guild.id }).exec();
    message.channel.send({
        embed: {
            color: `${client.config.Color.Success}`,
            description: `:white_check_mark: Kayıt sistemi başarı ile kaldırıldı.`
        }
    }).catch(err => { client.Error(message, "kayıt:kaldır", err); });
    return;
}

exports.command = {
    name: "kayıt-kapat",
    aliases: ["register-close","kayıt-kaldır"],
    category: "util",
    permission: "MANAGE_GUILD",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};