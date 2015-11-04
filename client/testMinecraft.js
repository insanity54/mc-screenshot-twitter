var path = require('path');
var minecraft = require(path.join(__dirname, 'minecraft'));
var assert = require('chai').assert;




describe('Minecraft', function() {
    this.timeout(60000);

    
    it('should start', function(done){
        minecraft.start(function(err) {
            if (err) throw err;
            assert.isNull(err);
            done();
        });
    });
    
    
});
