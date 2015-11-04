var path = require('path');
var util = require(path.join(__dirname, 'util'));
var assert = require('chai').assert;


util.waitForNewScreenshot(function(err, filename) {
    assert.isNull(err);
    assert.isString(filename);
    assert.isTrue(path.isAbsolute(filename));
    console.log('done???');
});