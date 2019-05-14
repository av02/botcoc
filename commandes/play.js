//const musique = require('./fichier externe/fichiers audio/partenaire-particulier-partenaire-particulier-haute-definition.mp3')
module.exports = class play{
    static play(message){
        if(message.guild){
          console.log('1')
          if(message.member.voiceChannel){
            console.log('2')
            message.member.voiceChannel.join()
            .then(connection => connection.playFile(musique))
            .catch(err=>console.log(err))
          }
        }
    }

}
