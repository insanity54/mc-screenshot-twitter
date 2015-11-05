var path = require('path');
var _ = require('underscore');


var defaultOptions = {
    type: 'screenshot'
}


var Job = function Job(opts) {
    this.options = _.extend({}, defaultOptions, opts);
}



Job.prototype.execute = function execute() {
    if (this.options.type === 'screenshot') {
	
    }
}


module.exports = Job;
