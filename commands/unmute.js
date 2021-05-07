exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const ModSchema = require('../models/ModerationLogs');
    const muteSchema = require('../models/Mute');
    const Data = await ModSchema.findOne({ serverID: message.guild.id }).exec();
    const User = message.mentions.users.first();

    if (!User) {
        message.channel.send({
            embed: {
                color: `${client.config.Color.Info}`,
                description: `:warning: Lütfen işlem yapılacak kullancıyı etiketleyerek tekrar deneyin.`
            }
        }).catch(err => { client.Error(message, "mute", err); });
        return;
    }

    const RoleData = await muteSchema.findOne({ serverID: message.guild.id }).exec();
    const Member = message.guild.members.cache.get(User.id);

    try{
        if(Member.roles.cache.has(RoleData.RoleID) == true){
        	Member.roles.add(RoleData.RoleID).then( role => {
                try{
                    message.guild.channels.cache.get(Data.ChannelID).send(`:open_mouth: **${User.tag}** (\`\`${User.id}\`\`) adlı kullanıcı **${message.author.tag}** (\`\`${message.author.id}\`\`) tarafından susturma cezası kaldırıldı.`);
                }catch(err){}
            message.channel.send({ embed: {
                color: `${client.config.Color.Success}`,
                description: `:white_check_mark: Kullanıcı susuturlması kaldırıldı.`
            }}).catch(Err => { client.Error(message,"mute",Err); });
            return;
            }).catch(Err => { client.Error(message,"mute",Err); });
        }else{
        	message.channel.send({ embed: {
        		color: `${client.config.Color.Error}`,
        		description: `:warning: Kullanıcı susturulmamış.`
        	}})
        }
    }catch(err){
    	console.log(err);
        message.channel.send({ embed: {
            color: `${client.config.Color.Error}`,
            description: `:warning: Susturma rolü ayarlanmamış, lütfen rolü ayarlayın!\n**Komut:** \`\`${prefix}mute-rol-ayarla @Rol\`\``
        }}).catch(err => { client.Error(message,"mute",err); });
        return;
    }

}

exports.command = {
    name: "unmute",
    aliases: ["susturma-kaldır"],
    category: "util",
    permission: "MANAGE_MESSAGES",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};