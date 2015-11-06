var path = require('path');
var input = require(path.join(__dirname, 'input'));
var assert = require('chai').assert;


input.sayCheese(function(err) {
    assert.isNull(err);
    console.log('done!');
});