var minecraft = require('minecraft-control');
var tweet = require('./tweeter');


var game = new minecraft.Game({
    server: "/home/esuvee/coolworld/minecraft_server.jar",
    world: "/home/esuvee/coolworld"
});



var startServer = function() {
    game.start(function(loadtime) {
	console.log('Server started in ' + loadtime + ' ms');


	// register a thingy
	game.on('said', function(player, said) {
	    console.log(player + ' said ' + said);

	    if (said[0] === '!') {
		// we got a command
		
	    }
	});    
	
    });
    
    
}


var stopServer = function() {
    game.stop(function);
}








module.exports = {
    startServer: startServer
}



    
    