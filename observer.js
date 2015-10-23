var nconf = require('nconf');
nconf.file('./config.json');

var util = require('util');
var events = require('events');
var robot = require('robotjs');
var child_process = require('child_process');
var redis = require('redis').createClient(nconf.get('redis_client_options'));




var Observer = function(msg) {
    var self = this;

    this.msg = msg;
    console.log('observer started with msg ' + this.msg);
    
    this.running = false;
    this.ready = false;

    this.on('custom', function() {
	self.logSomething('custon event');
    });

    //this.logSomething('init');
    events.EventEmitter.call(this);
}


Observer.prototype.logSomething = function logSomething(something) {
    console.log(something);
}

var mcToForground = function mcToForeground(cb) {
    var wmctrl = child_process.spawn('wmctrl', ['-Fxa', 'sun-awt-X11-XFramePeer.net-minecraft-bootstrap-Bootstrap']);

    wmctrl.on('error', function(err) {
	if (err) return cb(err);
	
    });

    wmctrl.on('close', function(code, signal) {
	console.log('wmctrl end with code=' + code + ' sig=' + signal);
	if (code !== 0) return cb(new Error('wmctrl exited with non zero status- ' + code));
	return cb(null);
    });
}



Observer.prototype.takeSnapshot = function takeSnapshot(cb) {
    if (!this.ready) return cb(new Error('minecraft client was not ready when tried to takeSnapshot'));
    
    mcToForeground(function(err) {
	if (err) return cb(new Error('problem moving minecraft client to foreground- ' + err));
	robot.keyTap('f3');
	var filename = null;
	return cb(null, filename);
    });
}


Observer.prototype.sayCheese = function sayCheese(cb) {
    if (!this.ready) return cb(new Error('minecraft client was not ready when tried to sayCheese'));
    
    mcToForeground(function(err) {
	if (err) return cb(new Error('problem moving minecraft client to foreground- ' + err));
	robot.keyTap('t');
	robot.typeString("Say Cheese!");
	robot.keyTap('enter');
	return cb(null);
    });
}


Observer.prototype.makeReady = function makeReady(cb) {
    var self = this;

    // is it already ready?
    if (self.ready) {
	return cb(null);
    }

    

    // it is not ready
    else {

	// start minecraft
	var child = child_process.spawn(nconf.get('minecraft_client_jar'));

	child.on('error', function(err) {
	    self.running = false;
	    self.ready = false;
	    self.emit('error', err);
	});

	child.on('close', function(code, signal) {
	    if (self.running) {
		console.log('minecraft was closed!!');
		self.emit("stop", code, signal);

		
	    }
	    else {
		self.emit('error', new Error('failed to start minecraft client. code=' + code + ' signal=' + signal));
	    }

	    this.running = false;
	    this.ready = false;
	});


	// wait for message from minecraft server
	redis.subscribe('mcsh');
	redis.on('message', function(channel, message) {
	    if (channel !== 'msch') return;
	    console.log('got redis message ' + message);
	    
	});	
    }
}


//Observer.prototype = Object.create(events.EventEmitter.prototype) //util.inherits(Observer, events.EventEmitter);
util.inherits(Observer, events.EventEmitter);

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
