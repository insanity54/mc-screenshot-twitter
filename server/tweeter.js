var path = require('path');
var Twitter = require('twitter');
var nconf = require('nconf');
var assert = require('chai').assert;
nconf.file(path.join(__dirname, '..', 'config.json'));


// console.log('nconf test- ' + nconf.get('twitter_consumer_key'));
// console.log('nconf test- ' + nconf.get('twitter_consumer_secret'));
// console.log('nconf test- ' + nconf.get('twitter_token_key'));
// console.log('nconf test- ' + nconf.get('twitter_access_token_secret'));
var consumer_key = nconf.get('twitter_consumer_key');
var consumer_secret = nconf.get('twitter_consumer_secret');
var access_token_key = nconf.get('twitter_token_key');
var access_token_secret = nconf.get('twitter_access_token_secret');

assert.isDefined(consumer_key);
assert.isDefined(consumer_secret);
assert.isDefined(access_token_key);
assert.isDefined(access_token_secret);



var client = new Twitter({
    consumer_key: consumer_key,
    consumer_secret: consumer_secret,
    access_token_key: access_token_key,
    access_token_secret: access_token_secret
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



/**
 * tweetPic
 *
 * Tweets a picture, along with the player name, and their message sent in chat
 *
 * @param {string} message
 * @param {string} picData
 * @param {string} player
 * @param {onTweetedPicCallback} cb
 */
var tweetPic = function tweetPic(message, picData, player, cb) {
    client.post('media/upload', {media: picData}, function(err, media, res) {
	if (err) return cb(new Error('problem uploading pic- ' + err));
	console.log(media);
	var stat = {
	    status: message+'// Submitted by '+player,
	    media_ids: media.media_id_string
	};

	client.post('statuses/update', stat, function(err, tweet, res) {
	    if (err) return cb(new Error('problem tweeting pic- ' + err));
	    console.log(tweet);
	    return cb(null, tweet);
	});
    });
};
/**
 * onTweetedPicCallback
 *
 * @callback {onTweetedPicCallback}
 * @param {error} err
 * @param {tweet} tweet
 */




module.exports = {
    tweet: tweet,
    tweetPic: tweetPic
}