var path = require('path');
var async = require('async');
var assert = require('chai').assert;
var redis = require('redis');
var nconf = require('nconf');
var job = require(path.join(__dirname, 'job'));
var auth = require(path.join(__dirname, 'auth'));
var minecraft = require(path.join(__dirname, 'minecraft'));
var input = require(path.join(__dirname, 'input'));
var util = require(path.join(__dirname, 'util'));

nconf.file(path.join(__dirname, '..', 'config.json'));




var redisOpts = nconf.get('redis_client_options');
assert.isDefined(redisOpts, 'redis_client_options not defined in config.json');

var subscriber = redis.createClient(redisOpts);
subscriber.subscribe('observer');

subscriber.on('message', function (channel, message) {
    console.log('client got redis message. channel=' + channel + ' message=' + message);

    // get job type and details
    job.getFirst(function(err, details) {
	assert.isNull(err, 'error while getting first job');
	assert.isObject(details, 'getting details did not get an object');

	// job type is screenshot
        if (details.type === 'screenshot') {
            console.log('job type is screenshot');
	    // start minecraft
	    async.series([
		auth.makeReady,
		minecraft.start,
		minecraft.waitForTp,
		input.takeScreenshot,
		util.uploadScreenshot
	    ], function (err, results) {
		if (err) throw err;
		console.log('async.series finished without error');
	    });            
        }

	// job type is something else
	// else {
	// }
    });
});
