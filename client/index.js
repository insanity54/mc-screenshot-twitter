var path = require('path');
var minecraft = require('./minecraftRedux.nogit');
var auth = require('./yggdrasil');
var nconf = require('nconf');
//nconf.file('./testconfig.json');
nconf.file(path.join('..', 'config.json'));
var async = require('async');
var assert = require('chai').assert;
var ygg = require('yggdrasil')



var password = nconf.get('minecraft_observer_password');
var accessToken = nconf.get('minecraft_observer_access_token');
var clientToken = nconf.get('minecraft_observer_client_token');
var username = nconf.get('minecraft_observer_username');
assert.isDefined(password, 'password not defined in config.json');
assert.isDefined(username, 'username is not defined in config.json');


console.log('accessToken:' + accessToken);
console.log('clientToken:' + clientToken);
console.log('username:' + username);
console.log('password:' + password);


var validTokens = false;





// thanks https://stackoverflow.com/a/1349426
function generateToken() {
    var text = "";
    var possible = "abcdef0123456789";
    for( var i=0; i < 32; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}




function validate(cb) {
    if (typeof(accessToken) === 'undefined') return cb(null);  // if there is no access token, skip this step

    console.log('validate');

    auth.validate(accessToken, clientToken, function(err, valid) {
        // if validation failed, move to the next step
        if (err) {
            console.log('got validate err: ' + err);
            return cb(null); // yes this is weird, its because of async.series
        }
        validTokens = true;
        return cb(null);
    });
}


function refresh(cb) {
    if (typeof(accessToken) === 'undefined') return cb(null);  // if there is no access token or client token, skip this step
    if (typeof(clientToken) === 'undefined') return cb(null);
    //if (validTokens) return cb(null) // if tokens are valid, no need to refresh, so skip this step
    
    console.log('refresh');
    
	auth.refresh(accessToken, clientToken, function(err, res) {
	    if (err) return cb(null); // if error refreshing, try next step
	    // refreshing succeeded, set new access token
        
        console.log('refreshed and got new access token ' + res.accessToken);
        validTokens = true;
        accessToken = res.accessToken;
        nconf.set('minecraft_observer_access_token', res.accessToken);
        nconf.save();
	    return cb(null);
	});
}


function login(cb) {
    // only log in if validate and refresh failed to give valid tokens
    if (validTokens) return cb(null);
    
    // if there is no client token, generate one
    if (typeof(clientToken) === 'undefined') clientToken = generateToken();
    
    console.log('login');

    auth.login(username, password, clientToken, function(err, res) {
        if (err) throw new Error('problem loggin in- ' + err);
        if (typeof(res) === 'undefined') throw new Error('did not get res from minecraft#login');
        if (typeof(res.accessToken) === 'undefined') throw new Error('did not get access token from login response');
        if (typeof(res.clientToken) === 'undefined') throw new Error('did not get client token from login response');


        console.log('log in complete.');
        console.log(res);
        //console.log('access token got- ' + res.accessToken);
        //console.log('client token got- ' + res.clientToken);

        accessToken = res.accessToken;
        clientToken = res.clientToken;
        nconf.set('minecraft_observer_access_token', res.accessToken);
        nconf.set('minecraft_observer_client_token', res.clientToken);
        nconf.save();

        return cb(null);
    });
}



function start(cb) {
    console.log('start');
    minecraft.start(username, accessToken, function(err) {
        if (err) throw err;
        console.log('minecraft started');
        return cb(null);
    });
}




async.series([
    validate,
    refresh,
    login,
    start
]);