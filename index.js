var path = require('path');
var minetroller = require(path.join(__dirname, 'server', 'minetroller'));
var vorpal = require('vorpal')();
var tweeter = require(path.join(__dirname, 'server', 'tweeter'));
var observer = require(path.join(__dirname, 'server', 'observer'));



vorpal
    .command('start', 'starts the minecraft server')
    .action(function(args, cb) {
	this.log('starting server');
	minetroller.startServer(function(err) {

	    
	    cb();
	});
    });



vorpal
    .command('stop', 'stops the minecraft server')
    .action(function(args, cb) {
	this.log('stopping server');
	minetroller.stopServer(function(err) {

	    if (err) this.log('error while stopping server ' + err);
	    cb();
	});
    });
	    

vorpal
    .command('screenshot [player]', 'makes insanity54 take a screenshot of the specified player')
    .action(function(args, cb) {

	minetroller.moveObserver(args.player, function(err) {
	    if (err) {
		console.log('error while moving oberver- ' + err);
		cb(err)
	    }

	    console.log('delegating to observer to take snapshot');
	    observer.takeSnapshot(function(err, imgData) {
		if (err) cb(new Error('problem while telling the observer to take a snapshot'));
		cb();
	    });
	});
    });




vorpal
    .command('tweet [message...]', 'sends a test tweet.')
    .action(function(args, cb) {
	this.log('sending test tweet ' + args);
	this.log(args);
	var that = this;
	tweeter.tweet(args.message.join(' '), function(err, tweet) {
	    if (err) {
		that.log('there was a problem sending your tweet- ' + err);
		that.log(err);
	    }
	    else {
		that.log('tweet sent successfully');
		that.log(tweet);
	    }

	    cb();
	});
    });



vorpal
    .delimiter('mcShitter>')
    .show();

//


// close minecraft server if Ctrl+C caught
vorpal.sigint(function() {
    console.log("Caught interrupt signal. Stopping MC server");

    minetroller.stopServer(function(err) {
	if (err) throw err;
 	process.exit();
    });
});



