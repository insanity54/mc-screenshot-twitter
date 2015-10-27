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
});


var makeReady(err, cb) {

    // see if token we have is good
    ygg.validate(accessToken, function(isValid, err) {
	console.log('validation complete. your key isIalid? ' + isValid); 
	if (err) throw err;
	if (isValid) return cb(null);

	// refresh token if not good
	ygg.refresh(accessToken, clientToken, function(err, newAccessToken, res) {
	    console.log('refresh complete. your new access token is ' + newAccessToken);
	    console.log(res);
	    if (err) throw err;

	    var authData = nconf.get('minecraft_observer_auth');
	    authData.accessToken(newAccessToken);
	    nconf.set('minecraft_observer_auth', authData);
	    nconf.save();

	    return cb(null);
	});
    });
}


module.exports = {
    makeReady: makeReady
}