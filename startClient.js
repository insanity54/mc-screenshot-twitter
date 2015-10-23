var request = require('request');
var nconf = require('nconf');
nconf.file('./config.json');

// api notes here http://wiki.vg/Authentication



/**
 * log in to mojangs servers, get an auth token which can be used for about a month instead of using password
 */
var login = function login() {
    request({
	method: "POST",
	uri: 'https://authserver.mojang.com/authenticate',
	json: true,
	body: {
	    username: nconf.get('minecraft_observer_username'),
	    password: nconf.get('minecraft_observer_password')
	}

    }, onResponse );
    
    function onResponse(err, response, body) {
	if (err) throw err;
	console.log('got response');
	//console.log(response);
	console.log(body);

	if (typeof(body.accessToken) === 'undefined') throw new Error('problem logging in, could not get access token- ' + body);
	if (typeof(body.clientToken) === 'undefined') throw new Error('problem logging in, could not get client token- ' + body);
	nconf.set('minecraft_observer_access_token', body.accessToken);
	nconf.set('minecraft_observer_client_token', body.clientToken);
	nconf.save();

    }
}

/**
 * validate
 *
 * verify that the auth token we have is good for logging in.
 */
var validate = function validate(cb) {

    var accessToken = nconf.get('minecraft_observer_access_token');
    if (typeof(accessToken) === 'undefined') return cb(new Error('no access token is in config.json'));
    
    request({
	method: "POST",
	uri: 'https://authserver.mojang.com/validate',
	json: true,
	body: {
	    "accessToken": accessToken
	}

    }, onResponse );

    function onResponse(err, res, body) {
	if (err) throw err;
	// 204 No Content if valid
	// 403 Forbidden if invalid
	if (res.statusCode != '204') return cb(new Error('validation failed with status code ' + res.statusCode));
	return cb(null);
    }
}



validate(function(err) {
    if (err) throw err;
    console.log('all good');
});

module.exports = {
    login: login
}

//https://login.minecraft.net/?user=grimtech&password=haygaylog3&version=13
