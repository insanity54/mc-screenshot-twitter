var path = require('path');
var nconf = require('nconf');
nconf.file(path.join(__dirname, '..', 'config.json'));
var request = require('request');
var util = require('util');
var events = require('events');
var child_process = require('child_process');


// api notes here http://wiki.vg/Authentication

var options = {
    child: null,
    starting: false,
    ready: false
}




// var Minecraft = function Minecraft(msg) {
//     var self = this;
//     console.log('minecraft constructor with message=' + msg);

//     this.starting = false;
//     this.ready = false;

//     events.EventEmitter.call(this);
// }



/**
 * makeReady
 *
 * makes the minecraft client ready. does this by authenticating user account with mojang.
 *
 * @param {makeReadyDoneCallback} cb
 */
var makeReady = function makeReady(cb) {

    var username = nconf.get('minecraft_observer_username');
    var password = nconf.get('minecraft_observer_password');
    var accessToken = nconf.get('minecraft_observer_access_token');
    var clientToken = nconf.get('minecraft_observer_client_token');
    var uuid = nconf.get('minecraft_observer_uuid');

    
    if (typeof(username) === 'undefined') return cb(new Error('username not defined in config.json'));
    if (typeof(password) === 'undefined') return cb(new Error('password not defined in config.json'));
    // if (typeof(uuid) === 'undefined') {
    // 	nameToUUID(username, function(err, uuid) {
    // @todo implement this somehow
    // 	});
    // }
    
    // if access token is undefined in config.json, log in, get new token, then save
    if (typeof(accessToken) === 'undefined') {
	login(username, password, clientToken, function(err, res) {
	    if (err) return cb(new Error('first time login failed- ' + err));

	    if (typeof(res.accessToken) === 'undefined') return cb(new Error('problem with login, server didnt respond with access token!'));
	    if (typeof(res.clientToken) === 'undefined') return cb(new Error('problem with login, server didnt respond with client token!'));
	    
	    nconf.set('minecraft_observer_access_token', res.accessToken);
	    nconf.set('minecraft_observer_client_token', res.clientToken);
	    nconf.save();

	    //options.ready = true;
	    return cb(null);
	});
    }

    // access token is defined, so check to see that it is still valid with mojang
    else {
	validate(accessToken, clientToken, function(err) {
	    if (err) {
		
		// token not valid so lets refresh 
		refresh(accessToken, clientToken, function(err, newAccessToken) {
		    if (err) return cb(new Error('validation failed, then followup refresh failed! new password, perhaps?'));
		    nconf.set('minecraft_observer_access_token', newAccessToken);
		    nconf.save();

		    return cb(null);
		});
	    }
	    else {
		return cb(null);
	    }
	});
    }
}
/**
 * makeReadyDoneCallback
 *
 * errors if error occured, or returns null if minecraft is now ready
 *
 * @callback {makeReadyDoneCallback}
 * @param {Error} err
 */



/**
 * startRedux
 *
 * trying to make a less buggy start()
 *
 * @param {string} name
 * @param {string} accessToken
 */
var startRedux = function startRedux(name, accessToken, cb) {
    var child = child_process.spawn('/usr/lib/jvm/java-8-oracle/jre/bin/java',
				    [


					    //     '-Djava.library.path=/home/rabbit/.technic/modpacks/vanilla/bin/natives',
                                            // '-Dfml.core.libraries.mirror=http://mirror.technicpack.net/Technic/lib/fml/%s',
                                            // '-Dminecraft.applet.TargetDirectory=/home/rabbit/.technic/modpacks/vanilla',
                                            // '-Djava.net.preferIPv4Stack=true',

					
					
					
					'-Xmx1024m',
					'-Djava.library.path=/home/rabbit/.minecraft/versions/1.8.7/1.8.7-static',
					'-Dfml.core.libraries.mirror=http://mirror.technicpack.net/Technic/lib/fml/%s',
					'-Dminecraft.applet.TargetDirectory=/home/rabbit/.minecraft',
					'-Djava.net.preferIPv4Stack=true',
					'-cp', '/home/rabbit/.technic/modpacks/vanilla/bin/modpack.jar:/home/rabbit/.technic/cache/oshi-project/oshi-core/1.1/oshi-core-1.1.jar:/home/rabbit/.technic/cache/net/java/dev/jna/jna/3.4.0/jna-3.4.0.jar:/home/rabbit/.technic/cache/net/java/dev/jna/platform/3.4.0/platform-3.4.0.jar:/home/rabbit/.technic/cache/com/ibm/icu/icu4j-core-mojang/51.2/icu4j-core-mojang-51.2.jar:/home/rabbit/.technic/cache/net/sf/jopt-simple/jopt-simple/4.6/jopt-simple-4.6.jar:/home/rabbit/.technic/cache/com/paulscode/codecjorbis/20101023/codecjorbis-20101023.jar:/home/rabbit/.technic/cache/com/paulscode/codecwav/20101023/codecwav-20101023.jar:/home/rabbit/.technic/cache/com/paulscode/libraryjavasound/20101123/libraryjavasound-20101123.jar:/home/rabbit/.technic/cache/com/paulscode/librarylwjglopenal/20100824/librarylwjglopenal-20100824.jar:/home/rabbit/.technic/cache/com/paulscode/soundsystem/20120107/soundsystem-20120107.jar:/home/rabbit/.technic/cache/io/netty/netty-all/4.0.23.Final/netty-all-4.0.23.Final.jar:/home/rabbit/.technic/cache/com/google/guava/guava/17.0/guava-17.0.jar:/home/rabbit/.technic/cache/org/apache/commons/commons-lang3/3.3.2/commons-lang3-3.3.2.jar:/home/rabbit/.technic/cache/commons-io/commons-io/2.4/commons-io-2.4.jar:/home/rabbit/.technic/cache/commons-codec/commons-codec/1.9/commons-codec-1.9.jar:/home/rabbit/.technic/cache/net/java/jinput/jinput/2.0.5/jinput-2.0.5.jar:/home/rabbit/.technic/cache/net/java/jutils/jutils/1.0.0/jutils-1.0.0.jar:/home/rabbit/.technic/cache/com/google/code/gson/gson/2.2.4/gson-2.2.4.jar:/home/rabbit/.technic/cache/com/mojang/authlib/1.5.21/authlib-1.5.21.jar:/home/rabbit/.technic/cache/com/mojang/realms/1.7.22/realms-1.7.22.jar:/home/rabbit/.technic/cache/org/apache/commons/commons-compress/1.8.1/commons-compress-1.8.1.jar:/home/rabbit/.technic/cache/org/apache/httpcomponents/httpclient/4.3.3/httpclient-4.3.3.jar:/home/rabbit/.technic/cache/commons-logging/commons-logging/1.1.3/commons-logging-1.1.3.jar:/home/rabbit/.technic/cache/org/apache/httpcomponents/httpcore/4.3.2/httpcore-4.3.2.jar:/home/rabbit/.technic/cache/org/apache/logging/log4j/log4j-api/2.0-beta9/log4j-api-2.0-beta9.jar:/home/rabbit/.technic/cache/org/apache/logging/log4j/log4j-core/2.0-beta9/log4j-core-2.0-beta9.jar:/home/rabbit/.technic/cache/org/lwjgl/lwjgl/lwjgl/2.9.4-nightly-20150209/lwjgl-2.9.4-nightly-20150209.jar:/home/rabbit/.technic/cache/org/lwjgl/lwjgl/lwjgl_util/2.9.4-nightly-20150209/lwjgl_util-2.9.4-nightly-20150209.jar:/home/rabbit/.technic/cache/tv/twitch/twitch/6.5/twitch-6.5.jar:/home/rabbit/.technic/modpacks/vanilla/bin/minecraft.jar',
					'net.minecraft.client.main.Main',
					'--username', name,
					'--server', '192.168.1.200',
					'--port', '25566',
					'--version', '1.8.7',
					'--gameDir', '/home/rabbit/.minecraft',
					'--assetsDir', '/home/rabbit/.minecraft/assets',
					'--assetIndex', '1.8',
					'--uuid', 'e642f297bd15491bb68d8370fec95bcf',
					'--accessToken', accessToken,
					'--userProperties', '{}',
					'--userType', 'legacy'
				    ]);


	child.stdout.on('data', function (data) {
	    console.log('stdout: ' + data);
	});

	child.stderr.on('data', function (data) {
	    console.log('stderr: ' + data);
	});	
	
	child.on('error', function(err) {
	    cb(new Error('minecraft process returned an error- ' + err));
	});
	
	child.on('close', function(code, signal) {
	    console.log('minecraft#startRedux child closing');
	    cb(null);
	});
}


/**
 * start
 *
 * starts the game
 */
var start = function start(cb) {
    //var self = this;

    makeReady(function(err) {
	if (err) throw err;

	if (options.ready) {
	    return cb(new Error('minecraft client is already running'));
	}
	if (options.starting) {
	    console.log('options.starting is ' + options.starting);
	    options.starting = true;
	    return cb(new Error('minecraft client is already starting'));
	}
	
	// start minecraft
	var accessToken = nconf.get('minecraft_observer_access_token');
	var uuid = nconf.get('minecraft_observer_uuid');
	var username = nconf.get('minecraft_observer_username');
	if (typeof(accessToken) === 'undefined') throw new Error('access token not defined in config.json');
	if (typeof(username) === 'undefined') throw new Error('username not defined in config.json');
	if (typeof(uuid) === 'undefined') throw new Error('uuid not defined in config.json')

	
	
	console.log('>> starting minecraft with ' +
		    'accessToken=' + accessToken + ' ' +
		    'username=' + username + ' ' +
		    'uuid=' + uuid);
	var child = child_process.spawn('/usr/lib/jvm/java-8-oracle/jre/bin/java',
					[
					    '-Xmx1024m',
					    '-Djava.library.path=/home/rabbit/.technic/modpacks/vanilla/bin/natives',
					    '-Dfml.core.libraries.mirror=http://mirror.technicpack.net/Technic/lib/fml/%s',
					    '-Dminecraft.applet.TargetDirectory=/home/rabbit/.technic/modpacks/vanilla',
					    '-Djava.net.preferIPv4Stack=true',
					    '-cp',
					    '/home/rabbit/.technic/modpacks/vanilla/bin/modpack.jar:/home/rabbit/.technic/cache/oshi-project/oshi-core/1.1/oshi-core-1.1.jar:/home/rabbit/.technic/cache/net/java/dev/jna/jna/3.4.0/jna-3.4.0.jar:/home/rabbit/.technic/cache/net/java/dev/jna/platform/3.4.0/platform-3.4.0.jar:/home/rabbit/.technic/cache/com/ibm/icu/icu4j-core-mojang/51.2/icu4j-core-mojang-51.2.jar:/home/rabbit/.technic/cache/net/sf/jopt-simple/jopt-simple/4.6/jopt-simple-4.6.jar:/home/rabbit/.technic/cache/com/paulscode/codecjorbis/20101023/codecjorbis-20101023.jar:/home/rabbit/.technic/cache/com/paulscode/codecwav/20101023/codecwav-20101023.jar:/home/rabbit/.technic/cache/com/paulscode/libraryjavasound/20101123/libraryjavasound-20101123.jar:/home/rabbit/.technic/cache/com/paulscode/librarylwjglopenal/20100824/librarylwjglopenal-20100824.jar:/home/rabbit/.technic/cache/com/paulscode/soundsystem/20120107/soundsystem-20120107.jar:/home/rabbit/.technic/cache/io/netty/netty-all/4.0.23.Final/netty-all-4.0.23.Final.jar:/home/rabbit/.technic/cache/com/google/guava/guava/17.0/guava-17.0.jar:/home/rabbit/.technic/cache/org/apache/commons/commons-lang3/3.3.2/commons-lang3-3.3.2.jar:/home/rabbit/.technic/cache/commons-io/commons-io/2.4/commons-io-2.4.jar:/home/rabbit/.technic/cache/commons-codec/commons-codec/1.9/commons-codec-1.9.jar:/home/rabbit/.technic/cache/net/java/jinput/jinput/2.0.5/jinput-2.0.5.jar:/home/rabbit/.technic/cache/net/java/jutils/jutils/1.0.0/jutils-1.0.0.jar:/home/rabbit/.technic/cache/com/google/code/gson/gson/2.2.4/gson-2.2.4.jar:/home/rabbit/.technic/cache/com/mojang/authlib/1.5.21/authlib-1.5.21.jar:/home/rabbit/.technic/cache/com/mojang/realms/1.7.22/realms-1.7.22.jar:/home/rabbit/.technic/cache/org/apache/commons/commons-compress/1.8.1/commons-compress-1.8.1.jar:/home/rabbit/.technic/cache/org/apache/httpcomponents/httpclient/4.3.3/httpclient-4.3.3.jar:/home/rabbit/.technic/cache/commons-logging/commons-logging/1.1.3/commons-logging-1.1.3.jar:/home/rabbit/.technic/cache/org/apache/httpcomponents/httpcore/4.3.2/httpcore-4.3.2.jar:/home/rabbit/.technic/cache/org/apache/logging/log4j/log4j-api/2.0-beta9/log4j-api-2.0-beta9.jar:/home/rabbit/.technic/cache/org/apache/logging/log4j/log4j-core/2.0-beta9/log4j-core-2.0-beta9.jar:/home/rabbit/.technic/cache/org/lwjgl/lwjgl/lwjgl/2.9.4-nightly-20150209/lwjgl-2.9.4-nightly-20150209.jar:/home/rabbit/.technic/cache/org/lwjgl/lwjgl/lwjgl_util/2.9.4-nightly-20150209/lwjgl_util-2.9.4-nightly-20150209.jar:/home/rabbit/.technic/cache/tv/twitch/twitch/6.5/twitch-6.5.jar:/home/rabbit/.technic/modpacks/vanilla/bin/minecraft.jar',
					    'net.minecraft.client.main.Main',
					    '--username', username,
					    '--server', '192.168.1.200',
					    '--port', '25566',
					    '--version', '1.8.7',
					    '--gameDir', '/home/rabbit/.technic/modpacks/vanilla',
					    '--assetsDir', '/home/rabbit/.technic/assets',
					    '--assetIndex', '1.8',
					    '--uuid', uuid,
					    '--accessToken', accessToken,
					    '--userProperties', '{}',
					    '--userType', 'legacy',
					    '--title', 'Vanilla',
					    '--icon', '/home/rabbit/.technic/assets/packs/vanilla/icon.png'
					], {
					    cwd: '/home/rabbit/.technic/modpacks/vanilla/bin'
					});
	
	options.child = child;


	child.stdout.on('data', function (data) {
	    console.log('stdout: ' + data);
	});

	child.stderr.on('data', function (data) {
	    console.log('stderr: ' + data);
	});	
	
	child.on('error', function(err) {
	    cb(new Error('minecraft process returned an error- ' + err));
	});
	
	child.on('close', function(code, signal) {
	    if (options.running) {
		stop(code, signal);
	    }
	    else {
		cb(new Error('failed to start'));
	    }
	    
	    options.ready = false;
	    options.starting = false;
	});
    });
}



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

//




/**
 * log in to mojangs servers, get an auth token which can be used for about a month instead of using password
 *
 * @param {string} user - username to log in as
 * @param {string} pass - password to use to log in
 * @param {loginDoneCallback} cb
 */
var login = function login(user, pass, clientToken, cb) {

    if (typeof(user) === 'undefined') throw new Error('user is undefined');
    if (typeof(pass) === 'undefined') throw new Error('pass is undefined');
    if (typeof(cb) === 'undefined') throw new Error('cb was undefined so im assuming you didnt give me my third param clientToken')
    

    request({
	method: "POST",
	uri: "https://authserver.mojang.com/authenticate",
	json: true,
	body: {
	    "username": user,
	    "password": pass,
	    "clientToken": clientToken
	}

    }, onResponse );
    
    function onResponse(err, response, body) {
	if (err) throw err;
	console.log('got response');
	//console.log(response);
	console.log(body);
	
	if (typeof(body.accessToken) === 'undefined') throw new Error('problem logging in, could not get access token- ' + body);
	if (typeof(body.clientToken) === 'undefined') throw new Error('problem logging in, could not get client token- ' + body);
	//nconf.set('minecraft_observer_access_token', body.accessToken);
	//nconf.set('minecraft_observer_client_token', body.clientToken);
	//nconf.save();

	return cb(null, body);
	
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


/**
 * validate
 *
 * check if our accessToken is valid for authentication with mojangs servers,
 *
 * @param {string} accessToken - a previously issued accessToken
 * @param {string} clientToken - a previously issued client token
 * @param {validateDoneCallback} cb
 */
var validate = function validate(accessToken, clientToken, cb) {
    request({
	method: "POST",
	uri: "https://authserver.mojang.com/validate",
	json: true,
	body: {
	    "accessToken": accessToken,
	    "clientToken": clientToken
	}

    }, onResponse );
    
    function onResponse(err, res, body) {
	if (err) return cb(err);
	console.log(body);

	if (res.statusCode != '204') return cb(new Error('validate failed with status code ' + res.statusCode));
	return cb(null);
	
    }
}
/**
 * validateDoneCallback
 *
 * @callback {validateDoneCallback}
 * @param {Error} err
 */


	    

/**
 * refresh
 *
 * refresh our access token. keeps player logged in between sessions
 *
 * @param {string} accessToken - the minecraft accessToken granted to us by Yggdrasil (mojang)
 * @param {string} clientToken - the minecraft clientToken
 * @param {refreshDoneCallback} cb
 */
var refresh = function refresh(accessToken, clientToken, cb) {
    if (typeof(accessToken) === 'undefined') return cb(new Error('no access token sent to refresh method'));
    if (typeof(clientToken) === 'undefined') return cb(new Error('no access token was sent to refresh method'));    
    
    
    request({
	method: "POST",
	uri: "https://authserver.mojang.com/refresh",
	json: true,
	body: {
	    "accessToken": accessToken,
	    "clientToken": clientToken
	}
	
    }, onResponse );
    
    function onResponse(err, res, body) {
	if (err) throw err;
	if (res.statusCode > 299 || res.statusCode < 200) {
	    console.log(body);
	    return cb(new Error('refresh failed with status code ' + res.statusCode + ' body:' + body));
	}


	if (typeof(body.accessToken) === 'undefined') throw new Error('problem refreshing accessToken, could not get access token- ' + body);
	if (typeof(body.clientToken) === 'undefined') throw new Error('problem refreshing accessToken, could not get client token- ' + body);
	nconf.set('minecraft_observer_access_token', body.accessToken);
	nconf.set('minecraft_observer_client_token', body.clientToken);
	nconf.save();
		  
	return cb(null, body);
    }
}
/**
 * refreshDoneCallback
 *
 * first param is error if error occured or not valid
 *
 * @callback {refreshDoneCallback}
 * @param {Error} err
 * @param {object} res
 * @param {string} res.accessToken
 * @param {string} res.clientToken
 */
	


//util.inherits(Minecraft, events.EventEmitter);
//module.exports.Minecraft = Minecraft;


module.exports = {
    start: start,
    startRedux: startRedux,
    makeReady: makeReady,
    validate: validate,
    login: login,
    refresh: refresh,
    nameToUUID: nameToUUID
}
