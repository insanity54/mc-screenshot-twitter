var path = require('path');
var nconf = require('nconf');
nconf.file(path.join(__dirname, '..', 'config.json'));

var fs = require('fs');
var minecraft = require('minecraft-control');
var tweet = require(path.join(__dirname, 'tweeter'));
var comms = require(path.join(__dirname, 'comms'));
var chat = require(path.join(__dirname, 'chat'));
var observer = require(path.join(__dirname, 'observer'));


var serverPath = nconf.get('minecraft_server_jar_path');
var worldPath = nconf.get('minecraft_server_world_path');
var observerName = nconf.get('minecraft_observer_name');


if (typeof(serverPath) === 'undefined') throw new Error('minecraft server path not defined in config.json');
if (typeof(worldPath) === 'undefined') throw new Error('minecraft world path not defined in config.json');
if (typeof(observerName) === 'undefined') throw new Error('minecraft observer name (minecraft_observer_name) not defined in config.json');
//if (typeof(redisOpts) === 'undefined') throw new Error('redis client options not defined in config.json')
//var redPub = redis.createClient(redisOpts);


//console.log('serverPath=' + serverPath);
//console.log('worldPath=' + worldPath);
var game = new minecraft.Game({
    server: serverPath,
    world: worldPath
});


/**
 * handleJoin
 *
 * handles what happens when a player joins the server
 */
var handleJoin = function(player) {
	if (player == observerName)	observer.handleJoin(player, game);
}


var startServer = function(cb) {
    // var eulaPath = path.resolve(serverPath, '..', 'eula.txt');
    // var eula = fs.readFileSync(eulaPath);

    // console.log('eulapath- ' + eulaPath);
    // if (!eula) fs.createFileSync(eulaPath, 'eula=true');
    
    game.start(function(loadtime) {
        console.log('Server started in ' + loadtime + ' seconds');

        // when something is said in chat, defer to our chat handling module
        game.on('said', chat.handleLine);
  
  	// when a player joins, figure out if its an observer and needs further handling
        game.on('joined', handleJoin);
        
        return cb(null);
    });
}


var moveObserver = function(targetPlayer, cb) {

    // if only one parameter received, assume its a callback and the target player was not defined
    if (typeof(cb) === 'undefined' && typeof(targetPlayer) !== 'undefined') cb = targetPlayer;

    // abort if server not running
    if (!game.running) return cb(new Error('minecraft server is not running!'));
    
    // if target player is not defined but callback is
    if (typeof(targetPlayer) === 'undefined' && typeof(cb) === 'function') {

        // since no player specified, get a random player if there are any logged in
        if (game.players.length < 1) {
            console.log('no players logged in');
            // no players logged in so dont move player after all
            return cb(null);
        }

        else {
            var randomIndex = Math.floor(Math.random() * game.players.length);
            targetPlayer = game.players[randomIndex];
            console.log('moving observer to random player ' + targetPlayer);
        }
    }

    game.sendCommand('tp ' + observerName + ' ' + targetPlayer);
    return cb(null);
}


var stopServer = function(cb) {
    if (!game.running) {
        console.error('server is not running');
        return cb(null);
    }
    
    game.stop(function() {
	   return cb(null);
    });
}




module.exports = {
    start: startServer,
    stop: stopServer,
    startServer: startServer,
    stopServer: stopServer,
    moveObserver: moveObserver
}   
    
