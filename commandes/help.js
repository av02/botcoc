const discord = require('discord.js')

/*module.exports = class help{
    static action (message){
        let embed_help = new discord.RichEmbed();
        embed_help.setAuthor('texte');
        embed_help.setTitle('comande help');
        message.channel.send(embed_help);
    }
}*/
module.exports = class help{
    static action (message,prefix){
        let embed_help = new discord.RichEmbed();
        embed_help.setAuthor("page daide");
        embed_help.setColor([40,30,200])
        embed_help.setFooter("comande d'aide")
        embed_help.setTimestamp()
        embed_help.addField("le prefixe actuel est:",prefix)
        embed_help.addField("clash of clans:",`${prefix}profil +tag => affiche le profil du joueur\n${prefix}clan +tag =>affiche le profil du clan`)
        embed_help.addField('comandes presques inutiles:',`${prefix}ping=> affiche si le bot est conécté\n${prefix}servinfo=>affiches des informations sur le serveur`)
        //embed_help.addField("construction de l'embed en cour.")
        message.channel.send(embed_help);
    }
}


// class help {
//     static action (message) {
//         message.channel.send('tto');
//     }
// }

// export default help;

// var help = require('help.js');

//  import help from 'help';