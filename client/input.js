// handles the minecraft client once it's started
//
// simulates keyboard presses to make the observer take snapshots, talk, etc.

var path = require('path');
var nconf = require('nconf');
nconf.file(path.join(__dirname, '..', 'config.json'));

var util = require('util');
var events = require('events');
//var robot = require('robotjs');
var child_process = require('child_process');
var redis = require('redis').createClient(nconf.get('redis_client_options'));




var mcToForeground = function mcToForeground(cb) {
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



/**
 * takeSnapshot
 *
 * @param {screenshotDoneCallback} cb
 */
var takeSnapshot = function takeSnapshot(cb) {
    //if (!game.ready) return cb(new Error('minecraft client was not ready when tried to takeSnapshot'));
    
    console.log('taking screenshot');
    mcToForeground(function(err) {
        if (err) return cb(new Error('problem moving minecraft client to foreground- ' + err));
        //robot.keyTap('f3');
        var filename = null;
        return cb(null, filename);
    });
}
/**
 * screenshotDoneCallback
 *
 * @callback {screenshotDoneCallback}
 * @param {Error} err
 * @param {string} imgPath - the absolute path on disk to the screenshot we just took
 */


var sayCheese = function sayCheese(cb) {
    //if (!game.ready) return cb(new Error('minecraft client was not ready when tried to sayCheese'));
    
    mcToForeground(function(err) {
	if (err) return cb(new Error('problem moving minecraft client to foreground- ' + err));
	robot.keyTap('t');
	robot.typeString("Say Cheese!");
	robot.keyTap('enter');
	return cb(null);
    });
}


module.exports = {
    sayCheese: sayCheese,
    takeScreenshot: takeSnapshot,
    takeSnapshot: takeSnapshot
}
