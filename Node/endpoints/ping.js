module.exports = {
    ping: (message) =>{
        var rand = Math.random() * 10;
        if(rand < 8){
            message.channel.send('Pong.');
        } else {
            message.channel.send('bah I lost!')
        }

    }
}