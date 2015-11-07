var path = require('path');
var assert = require('chai').assert;
var series = require('async').series;
var redis = require('redis');
var nconf = require('nconf');
var auth = require(path.join(__dirname, 'auth'));
var minecraft = require(path.join(__dirname, 'minecraft'));
var input = require(path.join(__dirname, 'input'));
var util = require(path.join(__dirname, 'util'));

nconf.file(path.join(__dirname, '..', 'config.json'));
var redisOpts = nconf.get('redis_client_options');
assert.isDefined(redisOpts, 'redis_client_options not defined in config.json');


/**
 * Worker Constructor
 *
 */
var Worker = function Worker() {
    this.isAvailable = true;
    this.workingOn = null;
    this.red = redis.createClient(redisOpts);
    this.publisher = redis.createClient(redisOpts);
}

/**
 * cleanup
 *
 * makes the worker available to do another job
 */
Worker.prototype.cleanup = function cleanup() {
    var self = this;
    self.workingOn = null;
    self.isAvailable = true;
    this.red.end();
    this.publisher.end();
}

/**
 * clearFirstJob
 *
 * remove the first job from the redis queue
 * also publishes to redis that the job is done
 *
 * @param {onClearedCallback} cb
 */
Worker.prototype.clearFirstJob = function clearFirstJob(cb) {
    var self = this
    self.red.LPOP('mcsh:observer:queue', function(err, job) {
        if (err) return cb(err);

	// job is in this format:
	//   TYPE,ID
	// ex:
	//   screenshot,32
	
	var id = job.split(',')[1];
	self.publisher.publish('observer', 'done,'+id, function(err) {
	    if (err) return cb(err);
	    return cb(null);
	});
    });
}
/**
 * onClearedCallback
 *
 * @callback {onClearedCallback}
 * @param {error} err
 */




/**
 * getFirstJob
 *
 * from the redis queue, get oldest job details
 *
 * @param {onGotCallback} cb
 */
Worker.prototype.getFirstJob = function getFirstJob(cb) {
    this.red.LRANGE('mcsh:observer:queue', 0, 0, function (err, job) {
        assert.isNull(err, 'error while getting job from queue');
        assert.isArray(job, 'job got from queue was not an array');
        var validRegex = /^(\w+),(\d+)$/;
        var match = validRegex.exec(job[0]);
        
        // clear job from queue if it's in an invalid format
        // return if job is in invalid format
        if (!match) {
            console.log('trashing invalid job- ' + job[0]);
            //red.LPOP('mcsh:observer:queue') // @todo
            return cb(new Error('invalid job format'));
        }
        
        console.log('type=' + match[1] + ' id=' + match[2]);

        var details = {};
        details.type = match[1];
        details.id = match[2];
        return cb(null, details);
    });
}
/**
 * onGotCallback
 *
 * @callback {onGotCallback}
 * @param {error} err
 * @param {object} details
 * @param {string} details.type
 * @param {string} details.id
 */




/**
 * execute
 *
 * carries out a job
 *
 * @param {object} details
 * @param {string} details.type
 * @param {string} details.id
 */
Worker.prototype.execute = function execute(details, cb) {
    console.log('executing job');
    
    var self = this;

    // job type is screenshot
    if (details.type === 'screenshot') {
        console.log('job type is screenshot');
        self.isAvailable = false;
        self.workingOn = 'screenshot';

        series([
                auth.makeReady,
                minecraft.start,
                minecraft.waitForTp,
                input.sayCheese,
                input.takeScreenshot,
                util.uploadScreenshot
	        ], function (err, results) {
                if (err) {
                    console.log('err executing job- ' + err);
                    self.cleanup();
                    return cb(err);
                }
                console.log('async.series finished without error');
                self.clearFirstJob(function(err) {
		    console.log('marking job as done');
                    if (err) console.error('could not clear first job from the queue');
                    self.cleanup();
                    return(null);
                });
        });
    }

    // job type is something else (implement something!)
    else {
        console.log('discarding unknown job type ' + details.type);
        // @todo remove this job from queue
        self.cleanup();
        return cb(null);
    }
}




module.exports = Worker;
