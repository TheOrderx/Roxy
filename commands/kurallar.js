exports.run = async (client, message, args) => {   
    message.channel.send(`➡️ ___Sunucudaki kız üyelere sarkmak, yavşamak yasaktır.___\n\n:warning: Sunucuda reklam yapmak kesinlikle **yasaktır.**\n:warning: İnsanları gereksiz rahatsız etmek **yasaktır.**\n:warning: Boş yere etiket atıp-silmek (GhostPing) **yasaktır.**\n\n:warning: Spam, flood, aşırı caps ve emoji **yasaktır.**\n:warning: Aşırı derecede küfür (aq,amk,mk,mke gibiler dışında) **yasaktır.**\n:warning: Hak etmediği halde yetki dilenmek **yasaktır.**\n\n:warning: Devamlı olarak başka sunucu hakkında konuşmak **yasaktır.**\n:warning: Sohbette muhalefet oluşturabilecek, tartışma yaratabilecek konuları konuşmak **yasaktır.**\n:warning: Cinsel içerik, kan&şiddet içerikli paylaşımlar **yasaktır.**\n\n**BÜTÜN ÜYELER KURALLARI OKUMUŞ, KURALLARA UYMADIĞI DURUMUNDA CEZA ALACAĞINI KABUL ETTİĞİ VARSAYILILR.**`).catch(err => { client.Error(message,"kurallar",err); })
} 

exports.command = {
    name: "kurallar",
    aliases: ["kural"],
    category: "util",
    permission: "SEND_MESSAGES",
    cooldown: 5000,
    maintenance: false,
    supportServer: false,
    DBLVoteLock: false
};