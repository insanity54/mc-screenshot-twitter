var path = require('path');
var nconf = require('nconf');
var assert = require('chai').assert;
var redis = require('redis');


nconf.file(path.join(__dirname, '..', 'config.json'));


var redisOpts = nconf.get('redis_client_options');
assert.isDefined(redisOpts);










module.exports = {
    
}
