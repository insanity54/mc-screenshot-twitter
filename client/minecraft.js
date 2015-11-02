var path = require('path');
var nconf = require('nconf');
nconf.file(path.join(__dirname, '..', 'config.json'));
var request = require('request');
var util = require('util');
var events = require('events');
var child_process = require('child_process');
var readline = require('readline');
var devnull = require('dev-null');


// api notes here http://wiki.vg/Authentication

var options = {
    child: null,
    starting: false,
    ready: false
}




/**
 * start
 *
 * starts the game
 */
var start = function start(cb) {

	if (options.ready) {
	    return cb(new Error('minecraft client is already running'));
	}
	if (options.starting) {
	    console.log('options.starting is ' + options.starting);
	    options.starting = true;
	    return cb(new Error('minecraft client is already starting'));
	}
	
	// start minecraft
    var authData = nconf.get('minecraft_observer_auth');
    var accessToken = authData.accessToken;
    var uuid = authData.selectedProfile.id;
    var username = authData.selectedProfile.name;
    var serverAddress = nconf.get('minecraft_observer_server_address');
    var serverPort = nconf.get('minecraft_observer_server_port');
        
    if (typeof(authData) === 'undefined') throw new Error('minecraft_observer_auth not defined in config.json');
    if (typeof(accessToken) === 'undefined') throw new Error('minecraft_observer_auth.accessToken not defined in config.json');
    if (typeof(uuid) === 'undefined') throw new Error('minecraft_observer_auth.selectedProfile.id not defined in config.json');
    if (typeof(username) === 'undefined') throw new Error('minecraft_observer_auth.selectedProfile.name not defined in config.json');
    if (typeof(serverAddress) === 'undefined') throw new Error('minecraft_observer_server_address not defined in config.json');
    if (typeof(serverPort) === 'undefined') serverPort = '25565';
	
	
	console.log('>> starting minecraft with ' +
		    'accessToken=' + accessToken + ' ' +
		    'username=' + username + ' ' +
		    'uuid=' + uuid);
	var child = child_process.spawn('/usr/lib/jvm/java-8-oracle/jre/bin/java',
					[
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
	
    
    
    options.child = child;
    
//    stdoutRl = readline.createInterface(child.stdout, process.stdout);
//    stderrRl = readline.createInterface(child.stderr, process.stderr);
    stdoutRl = readline.createInterface(child.stdout, devnull());
    stderrRl = readline.createInterface(child.stderr, devnull());
    
    stdoutRl.on('line', function(line){
        handleLine(line);
    });
    
    
//
//	options.child = child;
//
//
//	options.child.stdout.on('data', function (data) {
//	    console.log('stdout: ' + data);
//	});
//
//	options.child.stderr.on('data', function (data) {
//	    console.log('stderr: ' + data);
//	});	
//	
//	options.child.on('error', function(err) {
//	    cb(new Error('minecraft process returned an error- ' + err));
//	});
//	
//	options.child.on('close', function(code, signal) {
//	    if (options.running) {
//		stop(code, signal);
//	    }
//	    else {
//		cb(new Error('failed to start'));
//	    }
//	    
//	    options.ready = false;
//	    options.starting = false;
//	
//    });
}


var messageParser = /^\[(\d+):(\d+):(\d+)\]\s+\[([^\/\]]+)\/([^\]]+)\]:\s(.*)$/
var handleLine = function handleLine(line) {
    console.log('got line- ' + line);
    var match = messageParser.exec(line);
    
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

//        console.log('got match. hours=' + message.time.hours + 
//            ' mins=' + message.time.minutes + 
//            ' seconds=' + message.time.seconds +
//            ' source=' + message.source + 
//            ' rawBody=' + message.rawBody
//           );
    }
}


/**
 * waitForTp
 *
 * Waits for the server to teleport us
 *
 * @param {onTpCallback) cb
 */
var waitForTp = function waitForTp(cb) {
    
}
/**
 * onTpCallback
 *
 * @callback {onTpCallback}
 * @param {error}
 */


/**
 * get a uuid given a username
 *
 * @param {string} user - username to find the uuid of
 * @param {uuidLookupDoneCallback} cb
 */
var nameToUUID = function nameToUUID(name, cb) {

    if (typeof(name) === 'undefined') throw new Error('name is undefined');
    if (typeof(cb) === 'undefined') throw new Error('cb is undefined')
    

    request({
	method: "GET",
	uri: "https://api.mojang.com/users/profiles/minecraft/" + name,
    }, onResponse );
    
    function onResponse(err, res, body) {
	if (err) throw err;
	console.log('got response');
	//console.log(response);
	console.log(body);

	try {
            var json = JSON.parse(body);
	} catch(err) {
	    throw err;
	}

	console.log('json ');
	console.log(json);
	if (typeof(json.id) === 'undefined') throw new Error('problem getting uuid');

	return cb(null, json.id);
	
    }
}
/**
 * loginDoneCallback
 *
 * @callback {loginDoneCallback}
 * @param {Error} err
 * @param {object} res - the response payload received from the server
 * @param {string} res.accessToken
 * @param {string} res.clientToken
 */



module.exports = {
    start: start,
    nameToUUID: nameToUUID
}
