//var minetroller = require('./minetroller');
var vorpal = require('vorpal')();
var tweeter = require('./tweeter');
var observer = require('./observer');



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

	    if (err) this.log('error while stopping server ' +
			      err);
	    cb();
	});
    });
	    

vorpal
    .command('screenshot [player]', 'makes insanity54 take a screenshot of the specified player')
    .action(function(args, cb) {

	this.log('moving insanity54 to player ' + player);
	minetroller.moveObserver(args.player, function(err) {
	    if (err) {
		this.log('error while moving oberver- ' + err);
		cb(err)
	    }

	    this.log('say cheese!');
	    observer.sayCheese(function(err) {
		if (err) {
		    this.log('error while saying cheese- ' + err);
		    cb(err);
		}


		this.log('taking snapshot');
		observer.takeSnapshot(function(err, filename) {
		    if (err) {
			this.log('error while taking snapshot');
			cb(err);
		    }

		    // all good
		    cb();
		});
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





