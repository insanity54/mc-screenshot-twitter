var path = require('path');
var redis = require('redis');
var nconf = require('nconf');
var assert = require('chai').assert;
var moment = require('moment');
nconf.file(path.join(__dirname, '..', '..', 'config.json'));
var redisOpts = nconf.get('redis_client_options');
assert.isDefined(redisOpts, 'redis client options not defined in config.json');


/**
 * job id created in redis (id = INCR mcsh:observer:queue:index)
 * observer screenshot job added to redis (RPUSH mcsh:observer:queue screenshot,{{id}})
 * screenshot message added to redis (SET mcsh:screenshot:{{id}}:message {{message}})
 * screenshot player added to redis  (SET mcsh:screenshot:{{id}}:player  {{player}})
 * screenshot time added to redis    (SET mcsh:screenshot:{{id}}:time    {{time}})
 * job notification published to observer channel in redis (PUBLISH observer job)
 */
 

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
  assert.isString(type, 'job.create received first parameter that was not a string. its first param must be a string');
  assert.isString(player, 'job.create received second parameter that was not a string. its second param must be a string');
  red = redis.createClient(redisOpts);
  
  // get job id from redis
  red.INCR('mcsh:observer:queue:index', function(err, id) {
    if (err) throw err;
    assert.isNumber(id, 'redis reply to INCR gave us something that was not a number.');
    console.log('redis index=' + reply);
    
    // add job to redis
    // set requesting player
    red.SET('mcsh:job:'+type+':'+id+':player', player, function(err, reply) {
      assert.isNull(err, 'error entering requesting player in redis failed with error');
      assert.equal(reply, 'OK', 'entering requesting player in redis did not return OK');
    
      // set time
      red.SET('mcsh:job:'+type+':'+id+':time', moment().valueOf(), function(err, reply) {
        assert.isNull(err, 'error entering time in redis');
        assert.equal(reply, 'OK', 'entering time in redis did not return OK');
        
        // set message (if there is one)
        if (typeof(params) !== 'undefined') {
          red.SET('mcsh:job:screenshot:'+id+':message', params, function(err, reply) {
            assert.isNull(err, 'error entering message in redis');
            assert.equal(reply, 'OK', 'entering message in redis did not return OK');
          });
          red.close();
        }
        else {
          red.close();
        }
      });
    });
  });
}
  


 
module.exports = {
  create: create
}
