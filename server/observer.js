// sends commands to client
//
// 



var path = require('path');
var nconf = require('nconf');
nconf.file(path.join(__dirname, '..', 'config.json'));

var util = require('util');
var events = require('events');
var comms = require(path.join(__dirname, 'comms'));

var child_process = require('child_process');
var redis = require('redis');


var redisOpts = nconf.get('redis_client_options');
if (typeof(redisOpts) === 'undefined') throw new Error('redis options are undefined in config.json');



// var redPub = redis.createClient(redisOpts);


/**
 * handleJoin
 * 
 * figures out what to do when an observer joins the server
 * 
 * @param {string} player - the observer's name
 */
var handleJoin = function(player) {
	var red = redis.createClient(redisOpts);
	
	// get the oldest queued job details
	red.LRANGE('mcsh:observer:queue', 0, 0, function(err, jobs) {
		if (err) return console.error('error when getting job queue- ' + err);
		if (typeof(jobs) === 'Array') {
			var j = jobs[0].split(',');
			var type = j[0];
			var id = j[1];
			console.log('handlejoin got a job type=' + type + ' id=' + id);
			
			if (type === 'screenshot') {
				// find the target player
				red.GET('mcsh:job:screenshot:'+id+':player', function(err, target) {
					if (err) return console.error('error when looking up target player of ss job '+ id);
					if (typeof(target) === 'undefined') return console.error('could not get target of ss job id ' + id);
					
					// teleport the observer to the target player.
					// the observer handles the rest of this job
					teleport(target);
					return
				});
			}
		}
		else console.error('handlejoin got something other than an array, so ignoring- ' + jobs);
	});
}


/**
 * teleport
 * 
 * teleports the observer to a player or entity id
 * 
 * @param {string} target - the player or entity id to teleport the observer to
 */
var teleport = function teleport(target) {
	
}

// /**
//  * takeScreenshot
//  *
//  * tells the observer there is work to do
//  */
// var takeScreenshot = function(cb) {
//     console.log('observer.js: takeScreenshot');
//     comms.job('screenshot', function(err) {
//         if (err) throw err;
// 	return cb(null);
//     });
// }





// var Observer = function() {
//     var self = this;

//     this.msg = msg;
//     console.log('observer started with msg ' + this.msg);
    
//     this.running = false;
//     this.ready = false;

//     this.on('custom', function() {
// 	self.logSomething('custon event');
//     });

//     //this.logSomething('init');
//     events.EventEmitter.call(this);
// }


// Observer.prototype.logSomething = function logSomething(something) {
//     console.log(something);
// }

// Observer.prototype.takeSnapshot = function takeSnapshot(cb) {
//     if (!this.ready) return cb(new Error('minecraft client was not ready when tried to takeSnapshot'));
    
//     mcToForeground(function(err) {
// 	if (err) return cb(new Error('problem moving minecraft client to foreground- ' + err));
// 	robot.keyTap('f3');
// 	var filename = null;
// 	return cb(null, filename);
//     });
// }


// Observer.prototype.sayCheese = function sayCheese(cb) {
//     if (!this.ready) return cb(new Error('minecraft client was not ready when tried to sayCheese'));
    
//     mcToForeground(function(err) {
// 	if (err) return cb(new Error('problem moving minecraft client to foreground- ' + err));
// 	robot.keyTap('t');
// 	robot.typeString("Say Cheese!");
// 	robot.keyTap('enter');
// 	return cb(null);
//     });
// }


// Observer.prototype.makeReady = function makeReady(cb) {
//     var self = this;

//     // is it already ready?
//     if (self.ready) {
// 	return cb(null);
//     }

    

//     // it is not ready
//     else {

// 	// start minecraft
// 	var child = child_process.spawn(nconf.get('minecraft_client_jar'));

// 	child.on('error', function(err) {
// 	    self.running = false;
// 	    self.ready = false;
// 	    self.emit('error', err);
// 	});

// 	child.on('close', function(code, signal) {
// 	    if (self.running) {
// 		console.log('minecraft was closed!!');
// 		self.emit("stop", code, signal);

		
// 	    }
// 	    else {
// 		self.emit('error', new Error('failed to start minecraft client. code=' + code + ' signal=' + signal));
// 	    }

// 	    this.running = false;
// 	    this.ready = false;
// 	});


// 	// wait for message from minecraft server
// 	redis.subscribe('mcsh');
// 	redis.on('message', function(channel, message) {
// 	    if (channel !== 'msch') return;
// 	    console.log('got redis message ' + message);
	    
// 	});	
//     }
// }


// //Observer.prototype = Object.create(events.EventEmitter.prototype) //util.inherits(Observer, events.EventEmitter);
// util.inherits(Observer, events.EventEmitter);

// //var o = new Observer();
// //o.doSomething();

// module.exports = Observer;



module.exports = {
    //ready: ready,
    //makeReady: ready,
    //start: ready,
    //sayCheese: sayCheese,
    takeScreenshot: takeScreenshot,
    takeSnapshot: takeScreenshot,
    handleJoin: handleJoin
}
