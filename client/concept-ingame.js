var async = require('async');
var path = require('path');
var auth = require(path.join(__dirname, 'auth'));
var minecraft = require(path.join(__dirname, 'minecraft'));
var input = require(path.join(__dirname, 'input'));
var util = require(path.join(__dirname, 'util'));


async.series([
    //minecraft.start,
    //minecraft.waitForTp,
    input.takeScreenshot,
    util.uploadScreenshot
]);