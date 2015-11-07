/**
 *
 * listens to the observer channel on redis
 *   tweets when appropriate
 *
 */





var path = require('path');
var nconf = require('nconf');
var assert = require('chai').assert;
var redis = require('redis');


nconf.file(path.join(__dirname, '..', 'config.json'));
var redisOpts = nconf.get('redis_client_options');
assert.isDefined(redisOpts);







var listen = function listen() {
    var red = redis.createClient(redisOpts);
    red.subscribe('observer');

    red.on('message', functon(channel, message) {
	if (channel == 'observer') {
	    if (message == 'done') {
		// tweet
		
	    }
	}
    });
}





module.exports = {
    
}
