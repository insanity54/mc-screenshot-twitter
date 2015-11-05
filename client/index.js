var path = require('path');
var async = require('async');
var assert = require('chai').assert;
var redis = require('redis');
var nconf = require('nconf');
var Worker = require(path.join(__dirname, 'worker'));
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
    var worker = new Worker();
    console.log('client got redis message. channel=' + channel + ' message=' + message + ' workerAvailable=' + worker.isAvailable);
    
    // only read the message if worker is available
    if (worker.isAvailable) {
        
        // get job type and details
        worker.getFirstJob(function (err, details) {
            assert.isNull(err, 'error while getting first job');
            assert.isObject(details, 'getting details did not get an object');
            console.log('got first job. deets- ');
            console.log(details);

            // execute the job
            worker.execute(details, function(err) {
                if (err) return console.error('problem executing job- ' + err);
                console.log('job executed');
            });
        });
    }
});