var path = require('path');
var request = require('request');



/**
 * validate
 *
 * check if our accessToken is valid for authentication with mojangs servers,
 *
 * @param {string} accessToken - a previously issued accessToken
 * @param {string} clientToken - a previously issued client token
 * @param {validateDoneCallback} cb
 */
var validate = function validate(accessToken, clientToken, cb) {
    request({
	method: "POST",
	uri: "https://authserver.mojang.com/validate",
	json: true,
	body: {
	    "accessToken": accessToken,
	    "clientToken": clientToken
	}

    }, onResponse );
    
    function onResponse(err, res, body) {
	if (err) return cb(err);
	//console.log('validate response- ');
    //console.log(res);

	if (res.statusCode != '204') return cb(new Error('validate failed with status code ' + res.statusCode));
	return cb(null);
	
    }
}
/**
 * validateDoneCallback
 *
 * @callback {validateDoneCallback}
 * @param {Error} err
 */



/**
 * refresh
 *
 * refresh our access token. keeps player logged in between sessions
 *
 * @param {string} accessToken - the minecraft accessToken granted to us by Yggdrasil (mojang)
 * @param {string} clientToken - the minecraft clientToken
 * @param {refreshDoneCallback} cb
 */
var refresh = function refresh(accessToken, clientToken, cb) {
    if (typeof(accessToken) === 'undefined') return cb(new Error('no access token sent to refresh method'));
    if (typeof(clientToken) === 'undefined') return cb(new Error('no access token was sent to refresh method'));    
    
    
    request({
	method: "POST",
	uri: "https://authserver.mojang.com/refresh",
	json: true,
	body: {
	    "accessToken": accessToken,
	    "clientToken": clientToken
	}
	
    }, onResponse );
    
    function onResponse(err, res, body) {
	if (err) throw err;
	if (res.statusCode > 299 || res.statusCode < 200) {
	    console.log(body);
	    return cb(new Error('refresh failed with status code ' + res.statusCode + ' body:' + body));
	}


	if (typeof(body.accessToken) === 'undefined') throw new Error('problem refreshing accessToken, could not get access token- ' + body);
	if (typeof(body.clientToken) === 'undefined') throw new Error('problem refreshing accessToken, could not get client token- ' + body);
		  
	return cb(null, body);
    }
}
/**
 * refreshDoneCallback
 *
 * first param is error if error occured or not valid
 *
 * @callback {refreshDoneCallback}
 * @param {Error} err
 * @param {object} res
 * @param {string} res.accessToken
 * @param {string} res.clientToken
 */


/**
 * log in to mojangs servers, get an auth token which can be used for about a month instead of using password
 *
 * @param {string} user - username to log in as
 * @param {string} pass - password to use to log in
 * @param {loginDoneCallback} cb
 */
var login = function login(user, pass, clientToken, cb) {

    if (typeof(user) === 'undefined') throw new Error('user is undefined');
    if (typeof(pass) === 'undefined') throw new Error('pass is undefined');
    if (typeof(cb) === 'undefined') throw new Error('cb was undefined so im assuming you didnt give me my third param clientToken')
    

    request({
	method: "POST",
	uri: "https://authserver.mojang.com/authenticate",
	json: true,
	body: {
	    "username": user,
	    "password": pass,
	    "clientToken": clientToken
	}

    }, onResponse );
    
    function onResponse(err, response, body) {
	if (err) throw err;
	console.log('got response');
	//console.log(response);
	console.log(body);
	
	if (typeof(body.accessToken) === 'undefined') throw new Error('problem logging in, could not get access token- ' + body);
	if (typeof(body.clientToken) === 'undefined') throw new Error('problem logging in, could not get client token- ' + body);


	return cb(null, body);
	
    }
}
/**
 * loginDoneCallback
 *
 * @callback {loginDoneCallback}
 * @param {Error} err
 * @param {object} res - the response payload received from the server
 * @param {string} res.accessToken
 * @param {string} res.clientToken
 */



module.exports = {
    refresh: refresh,
    validate: validate,
    login: login,
    authenticate: login
}