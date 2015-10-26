var auth = require('./yggdrasil');
var assert = require('chai').assert;

var username = process.argv[2];
var password = process.argv[3];
var clientToken = process.argv[4];
if (typeof(username) === 'undefined') throw new Error('username (param1) is undefined');
if (typeof(password) === 'undefined') throw new Error('password (param2) is undefined');
if (typeof(clientToken) === 'undefined') throw new Error('clientToken (param3) is undefined');
console.log('username:' + username);
console.log('password:' + password);
console.log('clientToken:' + clientToken);


auth.login(username, password, clientToken, function(err, res) {
    assert.isNull(err, 'error logging in');
    assert.isNotNull(res.accessToken, 'no access token received in res');
    assert.isNotNull(res.clientToken, 'no client token received in res');
    console.log('logged in, here is your response:');
    console.log(res);
});
