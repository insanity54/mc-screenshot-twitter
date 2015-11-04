var path = require('path');
var input = require(path.join(__dirname, 'input'));
var assert = require('chai').assert;

//
//describe('Input', function() {
//    this.timeout(10000);
//    
//    it('shold take a screenshot, returning path', function(done) {
        input.takeSnapshot(function(err, filename) {
            assert.isNull(err);
            assert.isString(filename);
            assert.isTrue(path.isAbsolute(filename));
            //done();
        });
//    });
//    
//    
//});
