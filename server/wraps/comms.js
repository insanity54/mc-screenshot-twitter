// handles communication between server and observer

var path = require('path');
var nconf = require('nconf');
var redis = require('redis');

nconf.file(path.join(__dirname, '..', '..', config.json'));
var redisOpts = nconf.get('redis_client_options');

if (typeof(redisOpts) === 'undefined') throw new Error('redis client options not defined in config.json')
var redPub = redis.createClient(redisOpts);





/**
 * job
 *
 * sends a job to the observer
 *   create job in the observer work queue
 *   publish redis message on channel observer telling observer there is a job to do
 *   
 * @param {string} jobname - name of the job to put in the queue
 * @param {onJobSentCallback} cb
 */
function job(jobname, cb) {
    redPub.rpush('mcsh:observer:queue', 'screenshot', function(err, reply) {
        if (err) throw err;
        redPub.publish('observer', 'job', function(err) {
            if (err) throw err;
            return cb(null);
        });
    });
}
/**
 * onJobSentCallback
 *
 * @callback {onJobSentCallback}
 * @param {Error} err
 */




/**
 * publish
 *
 * publish a message to the observer channel
 *
 * @param {string} message
 * @param {onPublishedCallback} cb
 */
function publish(message, cb) {
    redPub.publish('observer', message);
    return cb(null);
}
/**
 * onPublishedCallback
 *
 * @callback {onPublishedCallback}
 * @param {Error} err
 */





module.exports = {
    sendJob: job,
    job: job,
    publishJob: job,
    pubJob: job,
    pub: publish,
    publish: publish
}