var path = require('path');
var os = require('os');
var nconf = require('nconf');
var redis = require('redis');
var fs = require('fs');
var moment = require('moment');
nconf.file(path.join(__dirname, '..', 'config.json'));

var ssDir = nconf.get('minecraft_observer_screenshot_directory')
var redisOpts = nconf.get('redis_client_options');
if (typeof(redisOpts) === 'undefined') throw new Error('redis options are undefined');



/**
 * getLatestScreensht
 *
 * gets the latest screenshot
 *
 * @param {onGotLatestScreenshotCallback} cb
 */
var getLatestScreenshot = function getLatestScreenshot(cb) {
    fs.readdir(getScreenshotDirectory(), function(err, screenshots) {
        if (err) throw err;

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
            return screenshots[ss.index];
        });

        // the last arrey element will be the most recent
//        console.log(results);
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



var uploadScreenshot = function uploadScreenshot(cb) {
    var red = redis.createClient(redisOpts);

    getLatestScreenshot(function(err, latest) {
        //console.log('latest ss is ' + latest);
        
        // read screenshot file
        fs.readFile(latest, { encoding: 'base64' }, function(err, data) {
            if (err) throw err;
            //fs.writeFileSync(path.join(__dirname, 'testimg.b64'), data); // test image
            
            red.rpush('mcsh:observer:screenshots', data, function(err) {
                if (err) throw err;
                red.end();
                console.log('screenshot uploaded');
            });
        });
    });
}


var getScreenshotDirectory = function getScreenshotDirectory() {
    if (typeof(ssDir) === undefined) ssDir = path.join(os.homedir(), '.minecraft', 'screenshots');
    return ssDir;
}


module.exports = {
    getLatestScreenshot: getLatestScreenshot,
    uploadScreenshot: uploadScreenshot
}

uploadScreenshot();