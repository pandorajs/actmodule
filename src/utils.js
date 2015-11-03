define(function(require, exports, module) {

	var Utils = {
		datetimeToUnix: function(datetime) { //参数格式：2011-11-11 11:11:11
		    var tmp = datetime.replace(/:/g, '-').replace(/ /g, '-');
		    var arr = tmp.split("-");
		    var now = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
		    return ~~(now.getTime() / 1000);
		},
		formatSeconds: function(totalSec){
			var days = parseInt(totalSec / 86400, 10);
	        var hours = parseInt(totalSec % 86400 / 3600, 10) % 24;
	        var minutes = parseInt(totalSec / 60, 10) % 60;
	        var seconds = totalSec % 60;
	        return (days + '\u5929' + hours + '\u5c0f\u65f6' + minutes + '\u5206' + seconds + '\u79d2');
		}
	}

	module.exports = Utils;

});