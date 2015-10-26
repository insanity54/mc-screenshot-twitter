
var assert = require('chai').assert;
var auth = require('./yggdrasil');

var accessToken = process.argv[2];
var clientToken = process.argv[3];
if (typeof(accessToken) === 'undefined') throw new Error('access token (arg1) undefined');
if (typeof(clientToken) === 'undefined') throw new Error('client token (arg2) undefined');


console.log('accessToken:'+accessToken);
console.log('clientToken:'+clientToken);


auth.validate(accessToken, clientToken, function(err) {
    assert.isNull(err, 'error after validating');
    
    console.log('valid tokens.');
});
