define("pandora/actmodule/1.0.0/template/pc/style2.handlebars", [ "gallery/handlebars/1.3.0/handlebars-runtime" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.3.0/handlebars-runtime");
    module.exports = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, helper, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n	<div class="zq-actcompt-pic">\r\n		<img src="';
            if (helper = helpers.activityImage) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.activityImage;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + '!a-3-240x.jpg" width="180" height="200" alt="" />\r\n	</div>\r\n	';
            return buffer;
        }
        function program3(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += " ";
            if (helper = helpers.beginTimeFormatted) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.beginTimeFormatted;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + " 至 ";
            if (helper = helpers.endTimeFormatted) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.endTimeFormatted;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + " ";
            return buffer;
        }
        function program5(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += " ";
            if (helper = helpers.lotteryBeginTimeFormatted) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.lotteryBeginTimeFormatted;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + " 至 ";
            if (helper = helpers.lotteryEndTimeFormatted) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.lotteryEndTimeFormatted;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + "  ";
            return buffer;
        }
        function program7(depth0, data) {
            return '\r\n			<a href="#" class="zq-actcompt-btn zq-actcompt-btn-begin" id="zq_actcompt_not_yet_start">即将开始</a>\r\n			<p class="zq-actcompt-state-tt"><span class="zq-actcompt-or"></span></p>\r\n			';
        }
        function program9(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n			<a href="#" class="zq-actcompt-btn zq-actcompt-btn-in" id="zq_actcompt_in_progress">立即领取</a>\r\n			<p class="zq-actcompt-state-tt">已有<span class="zq-actcompt-or zq-actcompt-fb">';
            if (helper = helpers.joins) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.joins;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + "</span>人参与</p>\r\n			";
            return buffer;
        }
        function program11(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n			<a href="#" class="zq-actcompt-btn zq-actcompt-btn-end" id="zq_actcompt_ended">已结束</a>\r\n			<p class="zq-actcompt-state-tt">已有<span class="zq-actcompt-or zq-actcompt-fb">';
            if (helper = helpers.joins) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.joins;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + "</span>人参与</p>\r\n			";
            return buffer;
        }
        buffer += '<div class="zq-actcompt zq-actcompt2">\r\n	';
        stack1 = helpers["if"].call(depth0, depth0 && depth0.showImg, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\r\n	<div class="zq-actcompt-text">\r\n		<h4 class="zq-actcompt-tit">';
        if (helper = helpers.name) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            helper = depth0 && depth0.name;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper;
        }
        buffer += escapeExpression(stack1) + '</h4>\r\n		<p class="zq-actcompt-p">活动时间：';
        stack1 = helpers["if"].call(depth0, depth0 && depth0.collectInfo, {
            hash: {},
            inverse: self.program(5, program5, data),
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '</p>\r\n		<p class="zq-actcompt-p">活动规则：';
        if (helper = helpers.description) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            helper = depth0 && depth0.description;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper;
        }
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '</p>\r\n		<div class="zq-actcompt2-state">\r\n			';
        stack1 = helpers["if"].call(depth0, (stack1 = depth0 && depth0.status, stack1 == null || stack1 === false ? stack1 : stack1.notYetStart), {
            hash: {},
            inverse: self.noop,
            fn: self.program(7, program7, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n			";
        stack1 = helpers["if"].call(depth0, (stack1 = depth0 && depth0.status, stack1 == null || stack1 === false ? stack1 : stack1.inProgress), {
            hash: {},
            inverse: self.noop,
            fn: self.program(9, program9, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "	\r\n			";
        stack1 = helpers["if"].call(depth0, (stack1 = depth0 && depth0.status, stack1 == null || stack1 === false ? stack1 : stack1.ended), {
            hash: {},
            inverse: self.noop,
            fn: self.program(11, program11, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n		</div>\r\n	</div>	\r\n</div>\r\n";
        return buffer;
    });
});