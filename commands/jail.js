const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    const prefix = await client.Prefix(message.guild.id);
    const Schema = require("../models/JailSystem");
    const User = message.mentions.users.first();

    if(!User){
        message.channel.send({ embed: {
            color: `${client.config.Color.Info}`,
            description: `:warning: Lütfen bir kullanıcı etiketleyerek tekrar deneyin.`
        }}).catch(err => { client.Error(message,"jail",err); });
        return;
    }

    const Data = await Schema.findOne({ serverID: message.guild.id }).exec();

    try{
        if(message.member.roles.cache.has(Data.StaffRoleID) == false){
        	message.channel.send({ embed: {
        		color: `${client.config.Color.Info}`,
        		description: `:warning: Bu komut için yetkiniz yeterli değil!`
        	}}).catch(err =>  { client.Error(message,"jail",err); });
        	return;
        }
        message.guild.members.cache.get(User.id).roles.add(Data.RoleID).then( Role => {
                message.channel.send({ embed: {
                    color: `${client.config.Color.Success}`,
                    description: `:white_check_mark: Kullanıcı başarı ile cezalandırıldı!`
                }}).then( msg => {
                	const embed = Discord.MessageEmbed()
                	 .setTitle(`${client.user.username} Karantina Sistemi | Karantinaya Birisi Geldi`)
                	 .setDescription(`${User} kullanıcısının bütün rollerine el konuldu!\n\n<@&${Data.RoleID}> kapsamında cezalandırıldı`)
                	 .setImage("https://cdn.discordapp.com/attachments/754984356346593311/756552556271894618/322deae8-c50e-4ad8-a7d2-ff13f650466d2Ftenor.gif")
                	 .setThumbnail(User.avatarURL())

                	 message.guild.channnels.cache.get(Data.ChannelID).send(embed);
                }).catch(err => { client.Error(message,"jail",err); });
                return;
            }).catch(err => { client.Error(message,"jail",err); });
        return;
    }catch(err){
        console.log(err);
        message.channel.send({ embed: {
            color: `${client.config.Color.Error}`,
            description: `:warning: Sunucunuzda cezalı rolü veya yetkili rolü ayarlanmamış! Lütfen rolü ayarlayınız!\n**Komut:** \`\`${prefix}jail-rol-ayarla @Rol\`\``
        }}).catch(err => { client.Error(message,"jail",err); });
        return;
    }
}

exports.command = {
    name: "jail",
    aliases: ["cezalı","ceza-ver","cezaver"],
    category: "util",
    permission: "SEND_MESSAGES",
    cooldown: 1000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};