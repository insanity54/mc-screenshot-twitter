/**
 * minecraft.js
 *
 * wraps ./minecraft-core.js
 */


var path = require('path');
var Minecraft = require(path.join(__dirname, 'minecraft-core'));


// init
var game = new Minecraft.Game();


//minecraft.on('message', )



var start = function start(cb) {
    game.start();
    game.on('connecting', function(server, port) {
        console.log('minecraft is connecting to server=' + server + ' port=' + port);
        return cb(null);
    });
}


var stop = function stop(cb) {
    game.stop(function() {
        console.log('minecraft client stopped');
        return cb(null);
    });
}


var nameToUUID = function nameToUUID(cb) {
    console.log('nameToUUID got name ' + name);
}

var waitForTeleport = function waitForTeleport(cb) {
    console.log('waiting 4 teleport!');
    
    // take action if teleport message seen in minecraft stdin
    game.on('teleport', function(message) {
        if (typeof(timeoutTimer) !== 'undefined') clearTimeout(timeoutTimer);
        console.log('got TELEPORTATION ' + message);
        return cb(null);
    });
    console.log(game.listeners('teleport'));
    
    // time out if 20 seconds elapsed without teleport
    var timeout = function timeout() {
        function onListenerRemoved(err) {
            console.log("removed teleport listener");
            if (err) throw err;
            return cb(new Error('time out waiting for teleport'));
        }
        
        console.log('timed out waiting for teleport.');
        game.removeListener('teleport', onListenerRemoved);
    }
    var timeoutTimer = setTimeout(timeout, 20000); // 20 seconds
    

    
    
    
}


//
//game.on("joined", function(player){
//  console.log(player + " has joined the game!");
//});
//
//game.on("error", function(err){
//  console.log(err);
//});




module.exports = {
    start: start,
    stop: stop,
    waitForTp: waitForTeleport,
    waitForTeleport: waitForTeleport
}