const Discord = require('https://github.com/discordjs/discord.js/');
const bot = new Discord.Client();
const help = require('./commandes/help.js');
//const play = require('./commandes/play.js');//non fonctionnelle
const servinfo = require('./commandes/servinfo.js');
const coc =require('./commandes/coc/coc.js');
const moderation = require('./commandes/moderation/warn.js');
const alias = require('./alias.json');
const config = require('./config.json');
const mute = require('./commandes/moderation/mute');

bot.on('ready',function(){
    console.log('connecté');
    bot.user.setActivity('les sorties de maternelles avec des jumelles',{type:'WATCHING'});
})

bot.on('message', message =>{
    if(message.content.trim().startsWith(config.prefix)){

    var request = message.content.trim().substr(config.prefix.length);
    var tab = request.split(' ');
    var strMsg = tab[0];
    strMsg = verif_alias(strMsg);
    


    switch (strMsg) {
        /* reply for a ping request */
        case 'ping':
            message.reply('pong '+bot.ping);
            break;
        case 'help':
            help.action(message,config.prefix);
            break;
        case 'servinfo':
            servinfo.action(message);
            break;
        case 'profil':
            coc.embed_joueur(tab[1],message).catch(err=>{
                console.log(err)
                message.channel.send('erreur dans la recherche')});
            break;
        case 'clan':
            coc.embed_clan(tab[1],message).catch(err=>{
                console.log(err)
                message.channel.send('erreur dans la recherche')});
            break;
        case 'mute':
            mute.mute(message,bot);
            break;
        case 'ga':
            coc.embed_guerre_actuelle(tab[1],message).catch(err=>message.channel.send('erreur dans la recherche'));
        }
    }
})







bot.login(process.env.token);
bot.on('error',err =>console.log('redemarage du bot'+err));




