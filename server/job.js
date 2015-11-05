var path = require('path');
var redis = require('redis');
var nconf = require('nconf');
var assert = require('chai').assert;
var moment = require('moment');
nconf.file(path.join(__dirname, '..', 'config.json'));
var redisOpts = nconf.get('redis_client_options');
assert.isDefined(redisOpts, 'redis client options not defined in config.json');

 
var finalize = function finalize() {
  this.publisher.PUBLISH('observer', 'job');
  this.publisher.end();
  this.red.end();
}
 

/**
 * create
 *
 * creates a job in redis
 *
 * @param {string} type - the type of job to create. (screenshot|tweet)
 * @param {string} player - the player issuing the command
 * @param {string} params - the parameters sent to the command
 */
var create = function create(type, player, params) {
  var self = this;
  assert.isString(type, 'job.create received first parameter that was not a string. its first param must be a string');
  assert.isString(player, 'job.create received second parameter that was not a string. its second param must be a string');
  self.red = redis.createClient(redisOpts);
  self.publisher = redis.createClient(redisOpts);
  
  
  // get job id from redis
  self.red.INCR('mcsh:observer:queue:index', function(err, id) {
    if (err) throw err;
    assert.isNumber(id, 'redis reply to INCR gave us something that was not a number.');
    console.log('redis index=' + id);
    
    // add job to redis
    self.red.RPUSH('mcsh:observer:queue', type+','+id, function(err, reply) {
      assert.isNull(err, 'error adding job to queue');
      assert.isNumber(reply, 'expected reply to be a number');
      
      
  
      
      // set requesting player
      self.red.SET('mcsh:job:'+type+':'+id+':player', player, function(err, reply) {
        assert.isNull(err, 'error entering requesting player in redis failed with error');
        assert.equal(reply, 'OK', 'entering requesting player in redis did not return OK');
      
        // set time
        self.red.SET('mcsh:job:'+type+':'+id+':time', moment().valueOf(), function(err, reply) {
          assert.isNull(err, 'error entering time in redis');
          assert.equal(reply, 'OK', 'entering time in redis did not return OK');
          
          // set message (if there is one)
          if (typeof(params) !== 'undefined') {
            self.red.SET('mcsh:job:screenshot:'+id+':message', params, function(err, reply) {
              assert.isNull(err, 'error entering message in redis');
              assert.equal(reply, 'OK', 'entering message in redis did not return OK');
  
              finalize.call(self);
            });
          }
          else {
            finalize.call(self);
          }
        });
      });
    });
  });
}
  



 
module.exports = {
  create: create
}
