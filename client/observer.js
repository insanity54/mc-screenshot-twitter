// observer connects to redis and listens for mcsh messages
//
// observer handles them by delegating work to input.js or minecraft.js
//
//   - connects to the redis server
//   - subscribes to mcsh channel
//   - when a message comes through
//     - do the action
//       ex: screenshot. observer will...
//       - verify minecraft user account (accessToken) is valid (log in and get new token if necessary)
//       - start the minecraft client
//       - log in to coolworld server
//       - signal to the server that client is joined


var path = require('path');
var nconf = require('nconf');
console.log('the path to configjson is ', path.join(__dirname, '..', 'config.json'));
nconf.file(path.join(__dirname, '..', 'config.json'));
console.log('nconf test ' + nconf.get('redis_client_options').host);


var util = require('util');
var events = require('events');
var redis = require('redis');
var input = require('./input');
var Minecraft = require('./minecraft');


var redisOpts = nconf.get('redis_client_options');
console.log('redis options pulled from nconf is ' + redisOpts);
if (typeof(redisOpts) === 'undefined') throw new Error('redis client options are not defined in config.json');

var redSub = redis.createClient(redisOpts);
var redPub = redis.createClient(redisOpts);
var red = redis.createClient(redisOpts);


var minecraft = new Minecraft.Minecraft();







var Observer = function(msg) {
    var self = this;

    this.msg = msg;
    console.log('observer started with msg ' + this.msg);
    
    this.running = false;
    this.ready = false;
}

Observer.prototype.init = function init() {
// subscribe to redis and react to messages
    redSub.subscribe('mcsh');
    redSub.on("message", onMessage);
}

var onMessage = function onMessage (channel, message) {
    
    console.log('got message=' + message + ' on channel=' + channel); 
    
    if (channel != 'mcsh') {
	console.log('channel was not mcsh');
	return;
    }
    
    if (message == 'observer') {
	console.log('got redis observer message');

	// start minecraft
	//minecraft.start(function(err, ok) {});

	minecraft.start();
	minecraft.on('ready', function() {
	    // get job
	    //        mcsh:observer:queue
	    red.lpop('mcsh:observer:queue', function(err, job) {
		if (err) throw err;
		if (!job) return that.cb(new Error('there is no observer job in the queue'));
		
		// do job
		console.log('job=' + job);
		job = job.split(' ');
		var action = job[0];
		var id = job[1];
		
		
		if (action == 'screenshot') {
		    input.takeScreenshot(function(err, imgPath) {
			if (err) throw err;
			
			// get image on disk and turn it into data suitable to write to redis
			util.encodeImage(imgPath, function(err, imgData) {
			    if (err) throw err;
			    
			    redPub.rpush('mcsh:observer:screenshot:' + idd, imgData);
			    
			    console.log('screenshot done');
			});
		    });
		    
		}
		
		// else if (action == 'say') {
		
		// }
	    });
	});
    }
}
    


	
    
Observer.prototype.logSomething = function logSomething(something) {
    console.log(something);
}

// var mcToForground = function mcToForeground(cb) {
//     var wmctrl = child_process.spawn('wmctrl', ['-Fxa', 'sun-awt-X11-XFramePeer.net-minecraft-bootstrap-Bootstrap']);

//     wmctrl.on('error', function(err) {
// 	if (err) return cb(err);
	
//     });

//     wmctrl.on('close', function(code, signal) {
// 	console.log('wmctrl end with code=' + code + ' sig=' + signal);
// 	if (code !== 0) return cb(new Error('wmctrl exited with non zero status- ' + code));
// 	return cb(null);
//     });
// }



Observer.prototype.takeSnapshot = function takeSnapshot(cb) {
    if (!this.ready) return cb(new Error('observer not ready to takeSnapshot'));

    input.takeSnapshot(function(err) {
	if (err) return cb(new Error('input failed to take snapshot- ' + err));
	return cb(null, img);
    });
}


Observer.prototype.sayCheese = function sayCheese(cb) {
    if (!this.ready) return cb(new Error('minecraft client was not ready when tried to sayCheese'));

    input.sayCheese(function(err) {
	if (err) return cb(new Error('input failed to say cheese- ' + err));
	return cb(null);
    });
}


/**
 * makeReady
 *
 * gets the minecraft client ready to carry out actions.
 *
 * being ready is when the minecraft client is authenticated with mojang,
 * up-to-date, and ready at a moment's notice to join the server and perform an action
 */
Observer.prototype.makeReady = function makeReady(cb) {
    var self = this;

    // is it already ready?
    if (self.ready) {
	return cb(null);
    }

    // it is not ready
    else {

	// start minecraft
	minecraft.makeReady(function(err) {
	    if (err) return cb(new Error('minecraft had an error when making ready- ' + err));

	    self.ready = true;
	    // wait for message from minecraft server
	    console.log('listening for redis messages');

	});	
    }
}



obs = new Observer();
obs.init();




//Observer.prototype = Object.create(events.EventEmitter.prototype) //util.inherits(Observer, events.EventEmitter);
//util.inherits(Observer, events.EventEmitter);

//var o = new Observer();
//o.doSomething();

module.exports = Observer;



// module.exports = {
//     ready: ready,
//     makeReady: ready,
//     start: ready,
//     sayCheese: sayCheese,
//     takeScreenshot: takeScreenshot
// }
