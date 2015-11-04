var auth = require('./auth');


auth.makeReady(function(err) {
    if (err) throw err;
    console.log('made ready');
});