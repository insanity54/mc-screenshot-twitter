var Twitter = require('twitter');
var nconf = require('nconf');
nconf.file('config.json');

// console.log('nconf test- ' + nconf.get('twitter_consumer_key'));
// console.log('nconf test- ' + nconf.get('twitter_consumer_secret'));
// console.log('nconf test- ' + nconf.get('twitter_token_key'));
// console.log('nconf test- ' + nconf.get('twitter_access_token_secret'));

 
var client = new Twitter({
    consumer_key: nconf.get('twitter_consumer_key'),
    consumer_secret: nconf.get('twitter_consumer_secret'),
    access_token_key: nconf.get('twitter_token_key'),
    access_token_secret: nconf.get('twitter_access_token_secret')
});
 






var tweet = function tweet(message, cb) {
    client.post('statuses/update',
		{status: message},
		function(err, tweet, res) {
		    if (err) return cb(err);
		    console.log('sent tweet. t=' + tweet +
				" res=" + res);
		    return cb(null, tweet);
		});
}




module.exports = {
    tweet: tweet
}