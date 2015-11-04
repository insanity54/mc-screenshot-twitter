var path = require('path');
var os = require('os');
var nconf = require('nconf');
var redis = require('redis');
var fs = require('fs');
var moment = require('moment');
var saw = require('saw');
nconf.file(path.join(__dirname, '..', 'config.json'));

var ssDir = nconf.get('minecraft_observer_screenshot_directory')
var redisOpts = nconf.get('redis_client_options');
if (typeof(redisOpts) === 'undefined') throw new Error('redis options are undefined');



/**
 * getLatestScreenshot
 *
 * gets the latest screenshot
 *
 * @param {onGotLatestScreenshotCallback} cb
 */
var getLatestScreenshot = function getLatestScreenshot(cb) {
    fs.readdir(getScreenshotDirectory(), function(err, screenshots) {
        if (err) throw err;

        //console.log('screenshots');
        //console.log(screenshots);
        var ssMap = {};

        // get absolute path to the screenshot
        screenshots = screenshots.map(function(screenshot) {
            return path.join(getScreenshotDirectory(), screenshot);
        });

        // create a map to the array of files
        // this is used to more quickly sort. we create a map here of the sort data
        // so sort data doent have to be computed during the sort.
        ssMap = screenshots.map(function(screenshot, i) {
            return { index: i, path: screenshot, date: moment(fs.statSync(screenshot).ctime) };
        });

        ssMap.sort(function(a, b) {
            if (a.date.isBefore(b.date)) {
                //console.log('a (' + a.date.format() + ') is before b (' + b.date.format() + ')');
                return -1;
            }   
            if (a.date.isAfter(b.date)) {
                //console.log('a (' + a.date.format() + ') is after b (' + b.date.format() + ')');
                return 1;
            }
            //console.log('a (' + a.date.format() + ') is equal to b (' + b.date.format() + ')');
            return 0
        });

        // get the final array of files
        var results = ssMap.map(function(ss) {
            //console.log(screenshots[ss.index]);
            return screenshots[ss.index];
        });

        // the last arrey element will be the most recent
        console.log(results);
//        console.log('most recent - ' + results[results.length-1])
        return cb(null, results[results.length-1]);
    });
}
/**
 * onGotLatestScreenshotCallback
 *
 * @callback {onGotLatestScreenshotCallback}
 * @param {Error} err
 * @param {string} latest - path to the latest screenshot
 */


/**
 * uploadScreenshot
 *
 * uploads screenshot given it's path, or if path not defined, uploads the latest screenshot
 *
 * @param {string} path - path to screenshot to upload
 * @param {onUploadedScreenshotCallback} cb
 */
var uploadScreenshot = function uploadScreenshot(path, cb) {
    
    if (typeof(path) === 'undefined')
        // path is undefined, problem for sure
        throw new Error('uploadScreenshot requires the first parameter to be a path to a screenshot or a callback. (it was undefined)');
    
    if (typeof(cb) === 'undefined' && typeof(path) === 'function') {
        // cb is undefined, assume path is cb

        cb = path;
        // make path the latest screenshot
        getLatestScreenshot(function(err, latest) {
            if (err) throw err;
            
            _uploadScreenshot(latest, function(err) {
                if (err) return cb(err);
                return cb(null);
            })
        });
    }
    
    else {
        // path and cb were both defined
        _uploadScreenshot(path, function(err) {
            if (err) return cb(err);
            return cb(null);
        });
    }

}
/**
 * onUploadedScreenshotCallback
 *
 * @callback {onUploadedScreenshotCallback}
 * @param {error} err
 */


/**
 * _uploadScreenshot
 *
 * uploads screenshot given its path
 *
 * @param {string} path - path to ss to upoad
 * @param {_onUploadedScreenshotCallback} cb
 */
var _uploadScreenshot = function _uploadScreenshot(path, cb) {
    var red = redis.createClient(redisOpts);
    fs.readFile(path, { encoding: 'base64' }, function(err, data) {
        if (err) throw err;
        //fs.writeFileSync(path.join(__dirname, 'testimg.b64'), data); // test image

        red.rpush('mcsh:observer:screenshots', data, function(err) {
            if (err) throw err;
            red.end();
            console.log('screenshot uploaded');
            return cb(null);
        });
    });
}
/**
 * _onUploadedScreenshotCallback
 *
 * @callback {_onUploadedScreenshotCallback}
 * @param {error} err
 */


/**
 * waitForNewScreenshot
 *
 * watches the screenshot directory. when a new file is added,
 * calls back with the new file's path
 *
 * @param {onNewScreenshot} cb
 */
var waitForNewScreenshot = function waitForNewScreenshot(cb) {
    var watch = saw(getScreenshotDirectory());
    watch.once('add', function (file) {
        //console.log('new screenshot detected. file=' + file.fullPath);
        watch.close();
        return cb(null, file.fullPath);
    });
}
/**
 * onNewScreenshot
 *
 * @callback {onNewScreenshot}
 * @param {error} err
 * @param {string} path - the path to the new screenshot
 */


var getScreenshotDirectory = function getScreenshotDirectory() {
    if (typeof(ssDir) === undefined) ssDir = path.join(os.homedir(), '.minecraft', 'screenshots');
    return ssDir;
}


module.exports = {
    waitForNewScreenshot: waitForNewScreenshot,
    getLatestScreenshot: getLatestScreenshot,
    uploadScreenshot: uploadScreenshot
}