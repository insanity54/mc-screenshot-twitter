var Observer = require('./observer');


var ob = new Observer('test');

console.log(ob);
ob.logSomething(' ^ observation starting');


ob.makeReady(function(err) {
    console.log('observer ready');
});
