const Discord = require("discord.js");
const clashApi = require('clash-of-clans-api');
const traduction = require('./traduction.json');
var token_coc = "aaaw"//require('config.json');
let client_coc = clashApi({
    token: token_coc
});
const level_max_hdv = 12
module.exports = class coc{
   static stars(x){
      let stars = ""
      let y = 3-x
      while(x>0){
         stars += "⭐"
         x-=1
      }
      while(y>0){
         stars+="☆"
         y-=1
      }
      return stars
   }
   static test_erreur(erreur,message){
      if(erreur['reason']=="inMaintenance"){
         message.channel.send("le jeu est en maintenance, reessaye a la fin de la maintenance;)")
      }else if(erreur['reason']=="accessDenied.invalidIp"){
         message.channel.send('token invalide.')
      }else{
         message.channel.send("erreur d'origine inconue")
         console.log(err)
      }
   }
   static async embed_joueur(tag,message){
      let info_joueur = await client_coc.playerByTag(tag).catch(err=>{
         test_erreur(err,message);
      });
      var troops = info_joueur['troops'];
      let embed_coc = new Discord.RichEmbed; 
      var nivs_troupe = ""
      let x = 0
      while(troops[x]['village']=='home'){
         let name = troops[x]['name'];
         x+=1; 
         if(traduction[name]!== undefined){
            nivs_troupe += traduction[name]+` ${troops[x-1]['level']}/${troops[x-1]['maxLevel']}\n`;
         }else{
            console.log(`erreur pour :${name} `);
         }
      }
      x = 0
      var sorts = info_joueur['spells']
      var nivs_sort = ""
      while(sorts[x]!=undefined){
         let name = sorts[x]['name'];
         x+=1; 
         if(traduction[name]!== undefined){
            nivs_sort += traduction[name]+` ${sorts[x-1]['level']}/${sorts[x-1]['maxLevel']}\n`;
         }else{
            console.log(`erreur pour :${name} `);
         }
      }if(nivs_sort==""){
         nivs_sort += "pas de sorts debloqués"
      }
      x = 0
      let heros = info_joueur['heroes']
      if(heros[0]!=undefined){
         var nivs_hero = ""
         while(heros[x]!= undefined){
            if(heros[x]['village']=='home'){
               let name = heros[x]['name'];
               if(traduction[name]!== undefined){
                  
                  nivs_hero += traduction[name]+` ${heros[x]['level']}/${heros[x]['maxLevel']}\n`;
               
               }else{
                  console.log(`erreur de traduction pour :${name} `);
               }
            }
            x+=1; 
         }
      }else{
         nivs_hero += "ce joueur n'a pas de héros"
      }
      embed_coc.setAuthor(`info sur le joueur:${info_joueur['name']}(${tag})`);
      //embed_coc.setTitle('ligue:'+'ligue_en cour de parametrage');
      //embed_coc.setThumbnail(`image_ligue`);
      if(info_joueur['league'] != undefined){
         embed_coc.setThumbnail(info_joueur['league']['iconUrls']['medium'])
      }
      //on rempli  l'embed
      embed_coc.addField(`***hdv***`,info_joueur['townHallLevel'],true);
      embed_coc.addField(`***niveau:***`,info_joueur['expLevel']);
      embed_coc.addField('***troupes:***',nivs_troupe,true);
      embed_coc.addField(`***sorts***`,nivs_sort,true);
      embed_coc.addField("***heros***",nivs_hero,true);
      embed_coc.addField("***trophés***",info_joueur['trophies'],true);
      embed_coc.addField("***meilleurs trophés***",info_joueur['bestTrophies'],true);
      embed_coc.addField(`***clan***`,`${info_joueur['clan']['name']}(${info_joueur['clan']['tag']}); ~~pour plus d'information, apuyez sur:🚩`);
      if(info_joueur['legendStatistics'] != undefined){
         embed_coc.addField("***trophés légendaires:***",`${info_joueur['legendStatistics']['legendTrophies']}`)
      }
      message.channel.send(embed_coc).then(msge=>{
         msge.react('🚩')
         
      }).catch(err=>console.log(err));
   }
   static async embed_clan(tag,message){
      let embed_clan = new Discord.RichEmbed;
      let info_clan = await client_coc.clanByTag(tag).catch(err=>{
         test_erreur(err,message)
      });
      let membres = "";
      let x = 0;
      embed_clan.setAuthor(`info sur le clan : ${info_clan['name']} (${info_clan['tag']})`)
      .setThumbnail(info_clan['badgeUrls']['large'])
      .addField("***description:***",info_clan['description'])
      let y = 1
      while(info_clan['memberList'][x] !== undefined){
         let le_membre =info_clan['memberList'][x]
         membres += `${x+1}:${le_membre['name']}  ↗️ ***${le_membre['donations']}*** ⬇️***${le_membre['donationsReceived']}*** 🏆***${le_membre['trophies']}\n***     ~~/\\/\\/\\~~      ***${le_membre['tag']};${le_membre['role']}\n`
         x += 1
         if(membres.length>=850){
            if(y==1){
               embed_clan.addField(`***membres(${info_clan['members']}):***`,membres)
               y +=1
            }else{
               embed_clan.addField(`\u200b`,membres)
            }
            membres = ""
         }
         
      }
      embed_clan.addField(`etat de guerre de clan:`,`cliquez sur ⚔ pour avoir des infos`)
      embed_clan.setFooter("↗️=>donnés;⬇️=>reçus");
      message.channel.send(embed_clan).then(msge=>msge.react('⚔'))
      
   }
   static async embed_guerre_actuelle(tag,message){
      let embed_g_a = new Discord.RichEmbed;//creation embed
      let info_ga = await client_coc.clanCurrentWarByTag(tag);//requete a l'api pour les gdc
      let info_lgdc = await client_coc.clanleague(tag);
      if(traduction[info_ga["state"]] !== undefined){
         var etat_gdc =  traduction[info_ga["state"]]; 
      }else{
         var etat_gdc =  info_ga["state"];
      }
      embed_g_a.setAuthor(`info sur la guerre du clan du clan: ${tag}(${tag})`);
      embed_g_a.setTitle('etat de la guerre en cour:'+etat_gdc);
      if(info_ga["state"]=="warEnded"||info_ga["state"]=="inWar"||info_ga["state"]=="preparation"){
         embed_g_a.addField(`guerre de clan contre:${info_ga["opponent"]["name"]},${info_ga["opponent"]["tag"]}`,`${info_ga["teamSize"]}vs${info_ga["teamSize"]}`);
      }
      if(info_ga["state"]=="preparation"){//pour une guerre en prepa
         let th_membres = "";//
         var compteur = level_max_hdv;//
         
         while(compteur > 0){
            let nbth = 0//pour l'hdv 'compteur', le nombre
            for(var th in info_ga["clan"]["members"]){
               if(th["townhallLevel"]==compteur){
                  nbth += 1
               }
            }
            let nbtho = 0//idem pour clan enemi
            for(var th in info_ga["opponent"]["members"]){
               if(th["townhallLevel"]==compteur){
                  nbtho += 1;
               }
            }
            if(nbth!=0&&nbtho!=0){
               th_membres += "HDV"+compteur+":"+nbth+"vs"+"HDV"+compteur+":"+nbtho+"\n";
            }
            compteur -=1;
         }
         embed_g_a.addField(`${info_ga["clan"]["name"]}vs${info_ga["oponent"]["name"]}`,th_membres)
      }else if(info_ga["state"]=="inWar"||info_ga["state"]=="warEnded"){// pour une guerre en cour
            var array_membre_clan = info_ga["clan"]["members"].sort(function (a, b) {
               return a.mapPosition - b.mapPosition;//permet de recup les membres dans l'ordre
            });
            var array_membre_opposants = info_ga["oponent"]["members"].sort(function (a, b) {
               return a.mapPosition - b.mapPosition;//permet de recup les adv dans l'ordre
            });
            let i = 0 ;
            let str_clans_membres_attaques = "";
            while(i < info_ga["teamSize"]){
               str_clans_membres_attaques += "hdv"+array_membre_clan[i]["townHallLevel"]+" :" +array_membre_clan[i]["name"]+"("+array_membre_clan[i]["tag"]+"):\n"+"⚔1:"+stars(array_membre_clan[i]["attacks"][1]["stars"])+array_membre_clan[i]["attacks"][1]["destructionPercentage"]+'%\n'+"⚔2"+stars(array_membre_clan[i]["attacks"][1]["stars"])+array_membre_clan[i]["attacks"][1]["destructionPercentage"]+'%\n'
               i+=1
            }
            embed_g_a.addField(`joueurs de: ${info_ga["clan"]["name"]}:`,str_clans_membres_attaques,true)         
      }else if(1!=2){
         return

      }
   message.channel.send(embed_g_a)
   }

}
