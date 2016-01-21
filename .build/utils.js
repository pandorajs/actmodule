define("pandora/actmodule/1.0.0/utils", [], function(require, exports, module) {
    var Utils = {
        datetimeToUnix: function(datetime) {
            //参数格式：2011-11-11 11:11:11
            var tmp = datetime.replace(/:/g, "-").replace(/ /g, "-");
            var arr = tmp.split("-");
            var now = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
            return ~~(now.getTime() / 1e3);
        },
        formatSeconds: function(totalSec) {
            var days = parseInt(totalSec / 86400, 10);
            var hours = parseInt(totalSec % 86400 / 3600, 10) % 24;
            var minutes = parseInt(totalSec / 60, 10) % 60;
            var seconds = totalSec % 60;
            return days + "天" + hours + "小时" + minutes + "分" + seconds + "秒";
        },
        base64_encode: function(str) {
            var c1, c2, c3;
            var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var i = 0, len = str.length, string = "";
            while (i < len) {
                c1 = str.charCodeAt(i++) & 255;
                if (i == len) {
                    string += base64EncodeChars.charAt(c1 >> 2);
                    string += base64EncodeChars.charAt((c1 & 3) << 4);
                    string += "==";
                    break;
                }
                c2 = str.charCodeAt(i++);
                if (i == len) {
                    string += base64EncodeChars.charAt(c1 >> 2);
                    string += base64EncodeChars.charAt((c1 & 3) << 4 | (c2 & 240) >> 4);
                    string += base64EncodeChars.charAt((c2 & 15) << 2);
                    string += "=";
                    break;
                }
                c3 = str.charCodeAt(i++);
                string += base64EncodeChars.charAt(c1 >> 2);
                string += base64EncodeChars.charAt((c1 & 3) << 4 | (c2 & 240) >> 4);
                string += base64EncodeChars.charAt((c2 & 15) << 2 | (c3 & 192) >> 6);
                string += base64EncodeChars.charAt(c3 & 63);
            }
            return string;
        }
    };
    module.exports = Utils;
});