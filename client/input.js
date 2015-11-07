// handles the minecraft client once it's started
//
// simulates keyboard presses to make the observer take snapshots, talk, etc.

var path = require('path');
var nconf = require('nconf');
nconf.file(path.join(__dirname, '..', 'config.json'));
var series = require('async').series;
var util = require(path.join(__dirname, 'util'));
var events = require('events');
var robot = require('robotjs');
var child_process = require('child_process');




var mcToForeground = function mcToForeground(cb) {
    console.log('moving mc to foreground');
    var wmctrl = child_process.spawn('wmctrl', ['-a', 'Minecraft ']);

    wmctrl.on('error', function(err) {
	   if (err) return cb(err);
    });

    wmctrl.on('close', function(code, signal) {
        //console.log('wmctrl end with code=' + code + ' sig=' + signal);
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
        robot.keyTap('f2'); // take the screenshot in-game
        
        // wait a couple seconds for the screenshot to process and save
        util.waitForNewScreenshot(function(err, path) {
            if (err) return cb(err);
            return cb(null, path);
        });
    });
}
/**
 * screenshotDoneCallback
 *
 * @callback {screenshotDoneCallback}
 * @param {Error} err
 * @param {string} imgPath - the absolute path on disk to the screenshot we just took
 */


/**
 * sayCheese
 *
 * types, 'Say cheese!' in chat to the player that requested a screenshot
 * also has a short delay to give the map a chance to load
 *
 * @param {onSaidCheeseCallback} cb
 */
var sayCheese = function sayCheese(cb) {
    //if (!game.ready) return cb(new Error('minecraft client was not ready when tried to sayCheese'));
    
    function openChat(next) {
	robot.typeString('t');
	next(null);
    }

    function typeExclamation(next) {
        robot.keyToggle('shift', 'down');
        robot.keyTap('1'); //!
        robot.keyToggle('shift', 'up');
	next(null);
    }

    function pressEnter(next) {
        robot.keyTap('enter');
	next(null);
    }

    function typeMessage(next) {
        robot.typeString("Say Cheese");
	next(null);
    }

    function delay(next) {
	//console.log('short delay');
	setTimeout(function() {
	    //console.log('short delay done');
	    next(null);
	}, 500);
    }

    function bigDelay(next) {
	console.log('big delay');	
	setTimeout(function() {
	    console.log('big delay done');
	    next(null);
	}, 2000);
    }

    
    mcToForeground(function(err) {
        if (err) return cb(new Error('when trying to say cheese, there was a problem moving minecraft client to foreground- ' + err));

        series([
	    openChat,
	    delay,
	    typeMessage,
	    delay,
	    typeExclamation,
	    delay,
	    pressEnter,
	    bigDelay
	], function(err, results) {
	    console.log('saycheese done. err=' + err + ' results=' + results);
	    if (err) throw err;
	    return cb(null);
	});
	
    });
}
/**
 * onSaidCheeseCallback
 *
 * @callback {onSaidCheeseCallback}
 */


module.exports = {
    sayCheese: sayCheese,
    takeScreenshot: takeSnapshot,
    takeSnapshot: takeSnapshot
}
