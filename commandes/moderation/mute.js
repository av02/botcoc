const discord = require('discord.js')
const config = require('../config.json')
module.exports = class muted{
    static async mute(msge,bot){//determiner le type de a_muter: le transformer en guilmember
        let muteur = msge.member;
        let a_muter = msge.mentions.members.first();
        //verifier que 1):le muteur a le bon role, ou le muté n'est pas imunisé ou le muteur a la perm kick/ban
        if(muteur.roles.some(liste_role=>config.role_moderation.includes(liste_role.name))||!a_muter.roles.some(liste_role=>config.role_imunisé.includes(liste_role.name))||muteur.hasPermission(['KICK_MEMBERS','BAN_MEMBERS'],false,true,true) ){
            //je regarde si le role existe
            if(!msge.guild.roles.some(liste_role=>"muted".includes(liste_role.name))){
                var plushautrole = msge.guild.me.highestRole.calculatedPosition-1;
                console.log(0)
                var role_mute = await msge.guild.createRole({
                    name : "muted",
                    color:"GREY",
                    position : plushautrole,
                    hoist: false,
                    permissions:[]
                },"creation d'un role mute");
                console.log(1)
                role_mute.setPosition(plushautrole);
                role_mute.setPermissions(['READ_MESSAGES']);
                console.log(2)
                msge.guild.channels.every(channel=>channel.overwritePermissions(role_mute,{ 'SEND_MESSAGES': true,'READ_MESSAGES':null},"verouillage des permissions"));
                console.log(3)
            }else{var role_mute = await  msge.guild.roles.find('name','muted')}
            
            a_muter.addRole(role_mute,`${muteur} a estimé que ${a_muter} le méritait`).catch(err=>{console.log(err);});
            let embedmute = new discord.RichEmbed().setTitle(`${a_muter.user.username} a eté muté`);
            msge.channel.send(embedmute);
        }else{
            let embed_erreur_mute = new discord.RichEmbed().setTitle(`${muteur},non mais tu t'es pris pour qui ?`);
            msge.channel.send(embed_erreur_mute);
        }
    }
}

