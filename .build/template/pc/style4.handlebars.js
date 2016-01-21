define("pandora/actmodule/1.0.0/template/pc/style4.handlebars", [ "gallery/handlebars/1.3.0/handlebars-runtime" ], function(require, exports, module) {
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
            return '\r\n	<a href="#" class="zq-actcompt-btn zq-actcompt-btn-begin" id="zq_actcompt_not_yet_start">即将开始</a>\r\n	<p class="zq-actcompt-p"><span class="zq-actcompt-or"></span></p>\r\n	';
        }
        function program3(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n	<a href="#" class="zq-actcompt-btn zq-actcompt-btn-in" id="zq_actcompt_in_progress">立即领取</a>\r\n	<p class="zq-actcompt-p">已有<span class="zq-actcompt-or zq-actcompt-fb">';
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
            buffer += escapeExpression(stack1) + "</span>人参与</p>\r\n	";
            return buffer;
        }
        function program5(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n	<a href="#" class="zq-actcompt-btn zq-actcompt-btn-end" id="zq_actcompt_ended">已结束</a>\r\n	<p class="zq-actcompt-p">已有<span class="zq-actcompt-or zq-actcompt-fb">';
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
            buffer += escapeExpression(stack1) + "</span>人参与</p>\r\n	";
            return buffer;
        }
        buffer += '<div class="zq-actcompt zq-actcompt4">\r\n	<h4 class="zq-actcompt-tit">';
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
        buffer += escapeExpression(stack1) + "</h4>\r\n	";
        stack1 = helpers["if"].call(depth0, (stack1 = depth0 && depth0.status, stack1 == null || stack1 === false ? stack1 : stack1.notYetStart), {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n	";
        stack1 = helpers["if"].call(depth0, (stack1 = depth0 && depth0.status, stack1 == null || stack1 === false ? stack1 : stack1.inProgress), {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n	";
        stack1 = helpers["if"].call(depth0, (stack1 = depth0 && depth0.status, stack1 == null || stack1 === false ? stack1 : stack1.ended), {
            hash: {},
            inverse: self.noop,
            fn: self.program(5, program5, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n</div>";
        return buffer;
    });
});