const Discord = require('discord.js')
module.exports = class servinfo{
    static action(message){
        if(message.guild==undefined){return message.channel.send(`espece de con, arrete de vouloir casser mon bot`)}
        var guild = message.guild
        let embed_servinfo = new Discord.RichEmbed();
        embed_servinfo.setAuthor("informations sur le serveur:" + guild.name);
        embed_servinfo.addField("identifiant du serveur:",guild.id);
        embed_servinfo.setFooter("demandé par:"+message.author.username+'#'+message.author.discriminator,message.author.avatarURL);
        embed_servinfo.setColor('#FF0000');
        embed_servinfo.addField("nombre de membres:","`"+ guild.memberCount +"`");
        embed_servinfo.addField("propriétaire du serveur:","`@"+guild.owner.user.username+'#'+guild.owner.user.discriminator+"`");
        embed_servinfo.setTimestamp();
        message.channel.send(embed_servinfo);
        // console.log(guild.owner)
    }
}
