var auth = require('./yggdrasil');
var assert = require('chai').assert;

var accessToken = process.argv[2];
var clientToken = process.argv[3];
if (typeof(accessToken) === 'undefined') throw new Error('accessToken (param1) is undefined');
if (typeof(clientToken) === 'undefined') throw new Error('clientToken (param2) is undefined');
console.log('accessToken:' + accessToken);
console.log('clientToken:' + clientToken);


auth.refresh(accessToken, clientToken, function(err, res) {
    assert.isNull(err, 'error refreshing');
    assert.match(res.accessToken, /[a-f0-9]{32}/, 'refreshed access token is invalid');
    assert.match(res.clientToken, /[a-f0-9]{32}/, 'refreshed client token is invalid');    
    console.log('accessToken is refreshed:'+ res.accessToken);
});
