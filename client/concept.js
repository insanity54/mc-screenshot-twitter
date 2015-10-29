



// figuring out more readable, maintainable code structure



//
// comms
//   
//



/**
   comms
     screenshot
       requires
         yggdrasil authenticated
         minecraft running
	 minecraft joined server
	 input module
	 redis
	 
       process
         server sends request
	 client auth with yggdrasil
	 minecraft log in
	 server says "you logged in"
         input module presses F3
         fs reads the latest img in mc ss dir
         img data b64-ify'd and saved in redis
         publish redis message saying image is uploaded

       pseudo-code

         // each of these steps needs a timeout
	 
         async.series([
           yggdrasil.makeReady,
	   minecraft.start,
	   // (server knows when client connects, checks redis job queue, tps bot to player)
	   minecraft.waitForTp, // (waits for "teleported x to y" in chat)
	   input.takeScreenshot,
	   util.uploadScreenshot
	 ]);
	 

   client
     process
       client.on('loggedIn', tell 

     partial = [];
     screenshot()

*/




var async = require('async');
var path = require('path');
var auth = require(path.join(__dirname, 'auth'));
var minecraft = require(path.join(__dirname, 'minecraft'));
var input = require(path.join(__dirname, 'input'));
var util = require(path.join(__dirname, 'util'));


async.series([
    auth.makeReady,
    minecraft.start,
    minecraft.waitForTp,
    input.takeScreenshot,
    util.uploadScreenshot
]);