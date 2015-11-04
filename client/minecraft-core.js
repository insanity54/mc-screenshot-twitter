// core module to interface with minecraft CLIENT process


var path = require('path');
var nconf = require('nconf');
nconf.file(path.join(__dirname, '..', 'config.json'));
var request = require('request');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var child_process = require('child_process');
var readline = require('readline');
var devnull = require('dev-null');
var _ = require('underscore');

// api notes here http://wiki.vg/Authentication



/**
 * Minecraft constructor
 */
var Game = function Game() {
    this.child = null;
    this.starting = false;
    this.ready = false;
    EventEmitter.call(this);
}
util.inherits(Game, EventEmitter);


/**
 * start
 *
 * starts the game
 */
Game.prototype.start = function start(cb) {
    var self = this;

    if (this.ready) {
        return cb(new Error('minecraft client is already running'));
    }
    if (this.starting) {
        console.log('this.starting is ' + this.starting);
        this.starting = true;
        return cb(new Error('minecraft client is already starting'));
    }

    // start minecraft
    var authData = nconf.get('minecraft_observer_auth');
    var accessToken = authData.accessToken;
    var uuid = authData.selectedProfile.id;
    var username = authData.selectedProfile.name;
    var serverAddress = nconf.get('minecraft_observer_server_address');
    var serverPort = nconf.get('minecraft_observer_server_port');

    if (typeof (authData) === 'undefined') throw new Error('minecraft_observer_auth not defined in config.json');
    if (typeof (accessToken) === 'undefined') throw new Error('minecraft_observer_auth.accessToken not defined in config.json');
    if (typeof (uuid) === 'undefined') throw new Error('minecraft_observer_auth.selectedProfile.id not defined in config.json');
    if (typeof (username) === 'undefined') throw new Error('minecraft_observer_auth.selectedProfile.name not defined in config.json');
    if (typeof (serverAddress) === 'undefined') throw new Error('minecraft_observer_server_address not defined in config.json');
    if (typeof (serverPort) === 'undefined') serverPort = '25565';


    console.log('>> starting minecraft with ' +
        'accessToken=' + accessToken + ' ' +
        'username=' + username + ' ' +
        'uuid=' + uuid);
    var child = child_process.spawn('/usr/lib/jvm/java-8-oracle/jre/bin/java', [
					    '-Xmx1024m',
					    '-Djava.library.path=/home/rabbit/.minecraft/versions/1.8.7/1.8.7-static',
					    '-Dfml.core.libraries.mirror=http://mirror.technicpack.net/Technic/lib/fml/%s',
					    '-Dminecraft.applet.TargetDirectory=/home/rabbit/.minecraft',
					    '-Djava.net.preferIPv4Stack=true',
					    '-cp',
					    '/home/rabbit/.technic/modpacks/vanilla/bin/modpack.jar:/home/rabbit/.technic/cache/oshi-project/oshi-core/1.1/oshi-core-1.1.jar:/home/rabbit/.technic/cache/net/java/dev/jna/jna/3.4.0/jna-3.4.0.jar:/home/rabbit/.technic/cache/net/java/dev/jna/platform/3.4.0/platform-3.4.0.jar:/home/rabbit/.technic/cache/com/ibm/icu/icu4j-core-mojang/51.2/icu4j-core-mojang-51.2.jar:/home/rabbit/.technic/cache/net/sf/jopt-simple/jopt-simple/4.6/jopt-simple-4.6.jar:/home/rabbit/.technic/cache/com/paulscode/codecjorbis/20101023/codecjorbis-20101023.jar:/home/rabbit/.technic/cache/com/paulscode/codecwav/20101023/codecwav-20101023.jar:/home/rabbit/.technic/cache/com/paulscode/libraryjavasound/20101123/libraryjavasound-20101123.jar:/home/rabbit/.technic/cache/com/paulscode/librarylwjglopenal/20100824/librarylwjglopenal-20100824.jar:/home/rabbit/.technic/cache/com/paulscode/soundsystem/20120107/soundsystem-20120107.jar:/home/rabbit/.technic/cache/io/netty/netty-all/4.0.23.Final/netty-all-4.0.23.Final.jar:/home/rabbit/.technic/cache/com/google/guava/guava/17.0/guava-17.0.jar:/home/rabbit/.technic/cache/org/apache/commons/commons-lang3/3.3.2/commons-lang3-3.3.2.jar:/home/rabbit/.technic/cache/commons-io/commons-io/2.4/commons-io-2.4.jar:/home/rabbit/.technic/cache/commons-codec/commons-codec/1.9/commons-codec-1.9.jar:/home/rabbit/.technic/cache/net/java/jinput/jinput/2.0.5/jinput-2.0.5.jar:/home/rabbit/.technic/cache/net/java/jutils/jutils/1.0.0/jutils-1.0.0.jar:/home/rabbit/.technic/cache/com/google/code/gson/gson/2.2.4/gson-2.2.4.jar:/home/rabbit/.technic/cache/com/mojang/authlib/1.5.21/authlib-1.5.21.jar:/home/rabbit/.technic/cache/com/mojang/realms/1.7.22/realms-1.7.22.jar:/home/rabbit/.technic/cache/org/apache/commons/commons-compress/1.8.1/commons-compress-1.8.1.jar:/home/rabbit/.technic/cache/org/apache/httpcomponents/httpclient/4.3.3/httpclient-4.3.3.jar:/home/rabbit/.technic/cache/commons-logging/commons-logging/1.1.3/commons-logging-1.1.3.jar:/home/rabbit/.technic/cache/org/apache/httpcomponents/httpcore/4.3.2/httpcore-4.3.2.jar:/home/rabbit/.technic/cache/org/apache/logging/log4j/log4j-api/2.0-beta9/log4j-api-2.0-beta9.jar:/home/rabbit/.technic/cache/org/apache/logging/log4j/log4j-core/2.0-beta9/log4j-core-2.0-beta9.jar:/home/rabbit/.technic/cache/org/lwjgl/lwjgl/lwjgl/2.9.4-nightly-20150209/lwjgl-2.9.4-nightly-20150209.jar:/home/rabbit/.technic/cache/org/lwjgl/lwjgl/lwjgl_util/2.9.4-nightly-20150209/lwjgl_util-2.9.4-nightly-20150209.jar:/home/rabbit/.technic/cache/tv/twitch/twitch/6.5/twitch-6.5.jar:/home/rabbit/.technic/modpacks/vanilla/bin/minecraft.jar',
					    'net.minecraft.client.main.Main',
					    '--username', username,
					    '--server', serverAddress,
					    '--port', serverPort,
					    '--version', '1.8.7',
					    '--gameDir', '/home/rabbit/.minecraft',
					    '--assetsDir', '/home/rabbit/.minecraft/assets',
					    '--assetIndex', '1.8',
					    '--uuid', uuid,
					    '--accessToken', accessToken,
					    '--userProperties', '{}',
					    '--userType', 'legacy'
					], {
        cwd: '/home/rabbit/.technic/modpacks/vanilla/bin'
    });



    this.child = child;

    //    stdoutRl = readline.createInterface(child.stdout, process.stdout);
    //    stderrRl = readline.createInterface(child.stderr, process.stderr);
    stdoutRl = readline.createInterface(child.stdout, devnull());
    stderrRl = readline.createInterface(child.stderr, devnull());

    stdoutRl.on('line', function (line) {
        self.handleLine(line);
    });
    
    // when a "Connecting" message is seen in stdout, consider minecraft started
    

    //return cb(null);
    //
    //	this.child = child;
    //
    //
    //	this.child.stdout.on('data', function (data) {
    //	    console.log('stdout: ' + data);
    //	});
    //
    //	this.child.stderr.on('data', function (data) {
    //	    console.log('stderr: ' + data);
    //	});	
    //	
    //	this.child.on('error', function(err) {
    //	    cb(new Error('minecraft process returned an error- ' + err));
    //	});
    //	
    //	this.child.on('close', function(code, signal) {
    //	    if (this.running) {
    //		stop(code, signal);
    //	    }
    //	    else {
    //		cb(new Error('failed to start'));
    //	    }
    //	    
    //	    this.ready = false;
    //	    this.starting = false;
    //	
    //    });
}


var messageParser = /^\[(\d+):(\d+):(\d+)\]\s+\[([^\/\]]+)\/([^\]]+)\]:\s(.*)$/
var specialMessageHandlers = {
    // client untested
    start: {
        regex: /^Done \(([\d\.]+)s\)\! For help, type "help" or "\?"/,
        callback: function (game, message, match) {
            game.running = true;
            game.players = [];
            game.emit('start', parseFloat(match[1]));
        }
    },
    // client untested
    joined: {
        regex: /^(\S+) joined the game/,
        callback: function (game, message, match) {
            var player = match[1];
            game.players = game.players.concat([player]);
            game.emit('joined', player);
        }
    },
    // client untested
    left: {
        regex: /^(\S+) left the game/,
        callback: function (game, message, match) {
            var player = match[1];
            game.players = _.without(game.players, player);
            game.emit('left', player);
        }
    },
    // client tested
    connecting: {
        regex: /^Connecting to (\S+), (\S+)/,
        callback: function(game, message, match) {
            var address = match[1];
            var port = match[2];
            //console.log('connecting callback !!!!!!!!! server=' + address + ' ' + 'port=' + port);
            game.emit('connecting', address, port);
        }
    },
    // client tested
    chat: {
        regex: /^\[CHAT\] <([^>]+)> (.*)$/,
        callback: function(game, message, match) {
            var from = match[1];
            var message = match[2];
            //console.log('chat callback!!!! from ' + from + ' message ' + message);
            game.emit('chat', from, message);
        }
    },
    // client tested
    teleport: {
        regex: /^\[CHAT\] \[Server: Teleported (\S+) to (\S+)\]$/,
        callback: function(game, message, match) {
            var player = match[1];
            var target = match[2];
            //console.log('teleporting callback!!!!!!! player=' + player + ' target=' + target);
            game.emit('teleport', player, target);
        }
    },
    // client untested
    lostConnection: {
        regex: /^(\S+) lost connection/,
        callback: function (game, message, match) {
            var player = match[1];
            game.players = _.without(game.players, player);
            game.emit('lostConnection', player);
        }
    },
    // client untested
    said: {
        regex: /^<([^>]+)> (.*)$/,
        callback: function (game, message, match) {
            var player = match[1];
            var said = match[2];
            game.emit('said', player, said);
        }
    },
    // client untested
    action: {
        regex: /^\* (\S+) (.*)$/,
        callback: function (game, message, match) {
            var player = match[1];
            var action = match[2];
            game.emit('action', player, action);
        }
    },
    // client untested
    earnedAchievement: {
        regex: /^(\S+) has just earned the achievement \[([^\]]+)\]/,
        callback: function (game, message, match) {
            var player = match[1];
            var achievement = match[2];
            game.players = game.players.concat([player]);
            game.emit('earnedAchievement', player, achievement);
        }
    },
    // client untested
    died: {
        regex: /^(\S+) (.*)$/,
        callback: function (game, message, match) {
            var player = match[1];
            var cause = match[2];
            if (_.indexOf(game.players, player) != -1) {
                if (!specialMessageHandlers.joined.regex.exec(message.rawBody) &&
                    !specialMessageHandlers.lostConnection.regex.exec(message.rawBody) &&
                    !specialMessageHandlers.left.regex.exec(message.rawBody) &&
                    !specialMessageHandlers.earnedAchievement.regex.exec(message.rawBody)
                ) {
                    game.emit('died', player, cause);
                }
                return true;
            } else {
                return false;
            }
        }
    },
};



/**
 * // ccc implement event firings based on the type of message seen in chat
 *
 */
Game.prototype.handleLine = function handleLine(line) {
    var self = this;
    
    console.log('got line- ' + line);
    var match = messageParser.exec(line);

    var knownMessage = false;
    
    if (match) {

        message = {
            time: {
                hours: match[1],
                minutes: match[2],
                seconds: match[3]
            },
            source: match[4],
            level: match[5],
            rawBody: match[6],
            rawMessage: line
        }

        self.emit('message', message);
        //console.log('MESSAGE-');
        //console.log(message);
        
        // go through each special message handler
        // match message against that handler's regex
        // if message matched that handler
        // use that handler's callback function to send an appropriate event
        _.values(specialMessageHandlers).forEach(function (handler) {
            var match = handler.regex.exec(message.rawBody);
            var handled;
            if (match) {
                handled = handler.callback(self, message, match);
                if (!(handled == false)) {
                    knownMessage = true;
                }
            }
        });

        if (!knownMessage) {
            self.emit("unknownMessage", message);
        }
    } else {
        self.emit("unknownLine", line);
    }
    self.emit('raw', line);
}


///**
// * waitForTp
// *
// * Waits for the server to teleport us
// *
// * @param {onTpCallback) cb
// */
//Minecraft.prototype.waitForTp = function waitForTp(cb) {
//    var self = this;
//    
//    self.on('teleport', function(message) {
//        console.log("GOT TELEPORT EVENT");
//    });
//    
//
//}
/**
 * onTpCallback
 *
 * @callback {onTpCallback}
 * @param {error}
 */


///**
// * get a uuid given a username
// *
// * @param {string} user - username to find the uuid of
// * @param {uuidLookupDoneCallback} cb
// */
//Minecraft.prototype.nameToUUID = function nameToUUID(name, cb) {
//
//    if (typeof(name) === 'undefined') throw new Error('name is undefined');
//    if (typeof(cb) === 'undefined') throw new Error('cb is undefined')
//    
//
//    request({
//	method: "GET",
//	uri: "https://api.mojang.com/users/profiles/minecraft/" + name,
//    }, onResponse );
//    
//    function onResponse(err, res, body) {
//	if (err) throw err;
//	console.log('got response');
//	//console.log(response);
//	console.log(body);
//
//	try {
//            var json = JSON.parse(body);
//	} catch(err) {
//	    throw err;
//	}
//
//	console.log('json ');
//	console.log(json);
//	if (typeof(json.id) === 'undefined') throw new Error('problem getting uuid');
//
//	return cb(null, json.id);
//	
//    }
//}
///**
// * loginDoneCallback
// *
// * @callback {loginDoneCallback}
// * @param {Error} err
// * @param {object} res - the response payload received from the server
// * @param {string} res.accessToken
// * @param {string} res.clientToken
// */



//Game.prototype = Object.create(EventEmitter);



module.exports.Game = Game;