module.exports = async (client,oldMember,newMember) => {
    const TagSchema = require('../models/Tag');

    const news = newMember.username

    try{
        const Data = TagSchema.findOne({ serverID: oldMember.guild.id }).exec();

        if(oldMember.roles.cache.has(Data.RoleID) == true){
            if(news.split("")[1] != Data.Tag ){
                newMember.roles.remove(Data.roleID)
            }
        }else if (oldMember.roles.cache.has(Data.RoleID) == false){
            if(news.split("")[1] == Data.Tag){
                newMember.roles.add(Data.roleID)
            }
        }
    }catch(err){ }
}