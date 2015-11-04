var path = require('path');
var ygg = require('yggdrasil')({});
var nconf = require('nconf')
nconf.file(path.join(__dirname, '..', 'config.json'))
var assert = require('chai').assert;



// load data from config
var authData = nconf.get('minecraft_observer_auth');
if (typeof (authData) !== 'undefined') {
    var clientToken = authData.clientToken;
    var accessToken = authData.accessToken;
}
var password = nconf.get('minecraft_observer_password');
var username = nconf.get('minecraft_observer_username');
//var redisOpts = nconf.get('redis_client_options');

// confirm all necessary values were pulled from config
assert.isDefined(password);
assert.isDefined(username);
assert.isDefined(clientToken);
//assert.isDefined(redisOpts, 'no redis_client_options was in config.json');







//
//// authenticate with minecraft servers
//ygg.auth({
//  token: clientToken || '', //Optional. Client token. 
//  agent: 'Minecraft', //Agent name. Defaults to 'Minecraft' 
//  version: 1, //Agent version. Defaults to 1 
//  user: username, //Username            
//  pass: password //Password
//}, function(err, data) {
//    assert.isNull(err);
//    console.log('auth blah ')
//    console.log(data);
//    nconf.set('minecraft_observer_auth', data);
//    nconf.save();
//});


var makeReady = function makeReady(cb) {
    //    console.log('makeready called with cb ', cb)
    //    console.log(cb);

    //    // see if token we have is good
    //    ygg.validate(accessToken, function(isValid, err) {
    //        console.log('validation complete. your key isValid? ' + isValid); 
    //        if (err) {
    //            if (err !== 'Invalid token') throw err;
    //        }
    //        if (isValid) return cb(null);
    //
    //        // refresh token if not good
    //        console.log('calling yggdrasil with accesToken=' + accessToken + ' clientToken=' + clientToken);
    //        ygg.refresh(accessToken, clientToken, function(err, newAccessToken, res) {
    //            console.log('refresh complete. your new access token is ' + newAccessToken);
    //            console.log(res);
    //            if (err) {
    //                // there was an error refreshing so lets get new tokens
    //
    //                
    //            }
    //            
    //            else {
    //
    //                var authData = nconf.get('minecraft_observer_auth');
    //                authData.accessToken = newAccessToken;
    //                nconf.set('minecraft_observer_auth', authData);
    //                nconf.save();
    //
    //                return cb(null);
    //            }
    //        });
    //    });

    ygg.auth({
        token: clientToken, //Optional. Client token.
        agent: 'Minecraft', //Agent name. Defaults to 'Minecraft'
        version: 1, //Agent version. Defaults to 1
        user: username, //Username
        pass: password //Password
    }, function (err, data) {
        if (err) throw err;
        //console.log('logged in with data- ' + data);
        console.log(data);

        
        nconf.set('minecraft_observer_auth', data);
        nconf.save();

        return cb(null);
    });
}


module.exports = {
    makeReady: makeReady
}