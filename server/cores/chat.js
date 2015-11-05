var path = require('path');
var _ = require('underscore');
var job = require(path.join(__dirname, 'job'));



/**
 * chat.js
 *
 * handles messages said in chat
 */

var commandHandlers = {
    screenshot: {
        regex: /^ *!(snapshot|screenshot|ss) *(.*)$/i,
        callback: function(player, match) {
            var message = match[2];
        }
    },
    tweet: {
        regex: /^ *!(tweet|twitter|news) *(.*)$/i,
        callback: function(player, match) {
            var from = player;
            var message = match[2];
	}
    }
};






/**
 * handleLine
 */
var handleLine = function handleLine(player, said) {
    //console.log('handlingLine! ' + player + ' said ' + said);
    var knownCommand = false;

    _.values(commandHandlers).forEach(function (handler) {
        var match = handler.regex.exec(said);
        var handled = false;
        if (match) {
	    console.log('match! ' + player + ' match=' + match);
            handled = handler.callback(player, match);
        }
        if (handled != false) {
            knownCommand = true;
        }
    });
    if (!knownCommand) {
        console.log('unknown command- ' + said + ' char0='+ said[0]);
        if (said[0] === '!') {
            red.createClient(redisOpts);
            red.rpush('mcsh:server:chat:unknownCommands', said);
            red.end();
        }
    }
}



module.exports = {
    handleLine: handleLine
}