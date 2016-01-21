define("pandora/actmodule/1.0.0/template/m/style3.handlebars", [ "gallery/handlebars/1.3.0/handlebars-runtime" ], function(require, exports, module) {
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
            buffer += '\r\n		<div class="zq-actcompt-item zq-actcompt-item';
            if (helper = helpers.index) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.index;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + '" data-prizeId="';
            if (helper = helpers.prizeId) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.prizeId;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + '">\r\n			<img src="';
            if (helper = helpers.prizePicture) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.prizePicture;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + '" alt="" />\r\n			<div></div>\r\n		</div>\r\n		';
            return buffer;
        }
        function program3(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n	<a href="javascript:;"  title="" class="zq-actcompt-btn-cj" id="zq_actcompt_in_progress">我要抽奖<i class="zq-actcompt-ico-play"></i></a>\r\n	<div class="zq-actcompt-num">\r\n		<i class="zq-actcompt-ico-per2"></i>已有 <span class="zq-actcompt-or">';
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
            buffer += escapeExpression(stack1) + " </span>人参与\r\n		";
            stack1 = helpers["if"].call(depth0, (stack1 = depth0 && depth0.status, stack1 == null || stack1 === false ? stack1 : stack1.winnerUrl), {
                hash: {},
                inverse: self.noop,
                fn: self.program(4, program4, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\r\n	</div>\r\n	";
            return buffer;
        }
        function program4(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n		<a href="' + escapeExpression((stack1 = (stack1 = depth0 && depth0.status, 
            stack1 == null || stack1 === false ? stack1 : stack1.winnerUrl), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '"  title="查看中奖名单" class="zq-actcompt-btn-winners">查看中奖名单&gt;&gt;</a>\r\n		';
            return buffer;
        }
        function program6(depth0, data) {
            return '\r\n	<a href="javascript:;"  title="" class="zq-actcompt-btn-cj-begin" id="zq_actcompt_not_yet_start">即将开始<i class="zq-actcompt-ico-play"></i></a>\r\n	<div class="zq-actcompt-num">\r\n		 <span class="zq-actcompt-or many"></span>\r\n	</div>\r\n	';
        }
        function program8(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n	<a href="javascript:;"  title="" class="zq-actcompt-btn-cj-end" id="zq_actcompt_ended">活动已结束</a>\r\n	<div class="zq-actcompt-num">\r\n		 已有<span class="zq-actcompt-or">';
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
            buffer += escapeExpression(stack1) + " </span>人参与\r\n	</div>\r\n	";
            return buffer;
        }
        buffer += '<div class="zq-actcompt3 zq-actcompt">\r\n	<h4 class="zq-actcompt-tit">';
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
        buffer += escapeExpression(stack1) + '</h4>\r\n	<div class="zq-actcompt-box">\r\n		';
        stack1 = helpers.each.call(depth0, depth0 && depth0.prizeList, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\r\n		<div class="zq-actcompt-item" data-prizeId="0">\r\n			<img src="http://ue.17173cdn.com/a/module/zq/2015/act-lottery/img/gn.png" alt="" />\r\n			<div></div>\r\n		</div>\r\n	</div>\r\n\r\n	';
        stack1 = helpers["if"].call(depth0, (stack1 = depth0 && depth0.status, stack1 == null || stack1 === false ? stack1 : stack1.inProgress), {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n\r\n	";
        stack1 = helpers["if"].call(depth0, (stack1 = depth0 && depth0.status, stack1 == null || stack1 === false ? stack1 : stack1.notYetStart), {
            hash: {},
            inverse: self.noop,
            fn: self.program(6, program6, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n\r\n	";
        stack1 = helpers["if"].call(depth0, (stack1 = depth0 && depth0.status, stack1 == null || stack1 === false ? stack1 : stack1.ended), {
            hash: {},
            inverse: self.noop,
            fn: self.program(8, program8, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n\r\n	<p>活动时间：<br/>";
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
        buffer += escapeExpression(stack1) + " - ";
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
        buffer += escapeExpression(stack1) + "</p>\r\n	<p>活动规则：<br>";
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
        buffer += "</p>\r\n	\r\n</div>\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n";
        return buffer;
    });
});