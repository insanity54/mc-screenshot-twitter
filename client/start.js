var assert = require('chai').assert;
var minecraft = require('./minecraftRedux.nogit');

var username = process.argv[2];
var accessToken = process.argv[3];
if (typeof(username) === 'undefined') throw new Error('username (arg1) undefined');
if (typeof(accessToken) === 'undefined') throw new Error('acess token (arg2) undefined');


console.log('username:' + username);
console.log('accessToken :' + accessToken);


minecraft.start(username, accessToken, function(err) {
    if (err) throw err;
    console.log('minecraft started');
});