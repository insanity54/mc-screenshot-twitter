var assert = require('chai').assert;
var robot = require('robotjs');


describe('RobotJS', function() {

    it('should move the mouse', function() {
	//Speed up the mouse.
	robot.setMouseDelay(2);

	var twoPI = Math.PI * 2.0;
	var screenSize = robot.getScreenSize();
	var height = (screenSize.height / 2) - 10;
	var width = screenSize.width;
	
	for (var x = 0; x < width; x++)
	{
	    y = height * Math.sin((twoPI * x) / width) + height;
	    robot.moveMouse(x, y);
	}

    });



    it('should use the keyboard', function() {
	
	//Type "Hello World".
	robot.typeString("Hello World");
	
	//Press enter. 
	robot.keyTap("f11");

    });
});
       


