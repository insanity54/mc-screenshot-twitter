var path = require('path');
var ygg = require('yggdrasil')({});
var nconf = require('nconf')
nconf.file(path.join('..', 'config.json'))
var assert = require('chai').assert;
var minecraft = require(path.join(__dirname, 'minecraftRedux.nogit'));
var redis = require('redis');



// load data from config
var authData = nconf.get('minecraft_observer_auth');
if (typeof(authData) !== 'undefined') {
    var clientToken = authData.clientToken;
    var accessToken = authData.accessToken;
}
var password = nconf.get('minecraft_observer_password');
var username = nconf.get('minecraft_observer_username');
var redisOpts = nconf.get('redis_client_options');

// confirm all necessary values were pulled from config
assert.isDefined(password);
assert.isDefined(username);
assert.isDefined(redisOpts, 'no redis_client_options was in config.json');





// set up redis clients for publishing, subscribing, and getting job data
var redSub = redis.createClient(redisOpts);
var redPub = redis.createClient(redisOpts);
var red = redis.createClient(redisOpts);
redSub.subscribe('mcsh');







// authenticate with minecraft servers
ygg.auth({
  token: clientToken || '', //Optional. Client token. 
  agent: 'Minecraft', //Agent name. Defaults to 'Minecraft' 
  version: 1, //Agent version. Defaults to 1 
  user: username, //Username            
  pass: password //Password
}, function(err, data) {
    assert.isNull(err);
    console.log('auth blah ')
    console.log(data);
    nconf.set('minecraft_observer_auth', data);
    nconf.save();
    
    
    // wait for message from server
    redSub.on('message', function(chan, msg) {
        console.log('message GET');
        
        // get job type
        red.lrange('mcsh:observer:queue', 0, 0, function(err, task) {
            assert.isNull(err, 'redis err');
            
            console.log('queued job is:' + task);
        
            // start minecraft (only allow 1 instance)
            if (!minecraft.isRunning) {
                minecraft.isRunning = true;
                minecraft.start(username, data.accessToken, function(err, info) {
                    
                    minecraft.isRunning = false;
                });
            }
        });
    });
});