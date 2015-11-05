var path = require('path');
var server = new server({blah: blah});


server.on('say', flow.handleMessage);


// flow.js
var path = require('path');
var async = require('async');
var db = require(path.join(__dirname, 'db'));


var handleMessage = function handleMessage {
    async.series([
	db.
    ], function(err, results) {
	if (err) throw err;
	console.log('async done with no errors. results=' + results);
    });
}


module.exports = {
    handleMessage: handleMessage
}
