// sends commands to client
//
// 



var path = require('path');
var nconf = require('nconf');
var redis = require('redis');
var assert = require('chai').assert;

nconf.file(path.join(__dirname, '..', 'config.json'));
var observerName = nconf.get('minecraft_observer_name');
var redisOpts = nconf.get('redis_client_options');
assert.isDefined(redisOpts, 'redis options are undefined in config.json');
assert.isDefined(observerName, 'observer name is undefined in config.json');



// var redPub = redis.createClient(redisOpts);


/**
 * handleJoin
 * 
 * figures out what to do when an observer joins the server
 * 
 * @param {string} player - the observer's name
 * @param {minecraft-control#Game} game - instance of the running game (minecraft-control module)
 */
var handleJoin = function(player, game) {
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
					teleport(target, game);
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
 * @param {minecraft-control#game} - instance of the running game (minecraft-control module)
 */
var teleport = function teleport(target, game) {
	game.sendCommand('tp '+observerName+' '+target, function(err) {
		console.log('teleport complete')	
	});
}


module.exports = {
    handleJoin: handleJoin
}
