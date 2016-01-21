define("pandora/actmodule/1.0.0/template/pc/result.handlebars", [ "gallery/handlebars/1.3.0/handlebars-runtime" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.3.0/handlebars-runtime");
    module.exports = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            return " zq-actcompt-pop-zjjg";
        }
        function program3(depth0, data) {
            return " zq-actcompt-pop-wzj";
        }
        function program5(depth0, data) {
            return "提示";
        }
        function program7(depth0, data) {
            return "中奖结果";
        }
        function program9(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n		<div class="zq-actcompt-zjjg-c1">\r\n			<h4 class="zq-actcompt-tit">恭喜您！获得了<span class="zq-actcompt-or">';
            if (helper = helpers.prizeName) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.prizeName;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + "</span></h4>\r\n\r\n			";
            stack1 = helpers["if"].call(depth0, depth0 && depth0.code, {
                hash: {},
                inverse: self.noop,
                fn: self.program(10, program10, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\r\n\r\n			";
            stack1 = helpers["if"].call(depth0, depth0 && depth0.secretKey, {
                hash: {},
                inverse: self.noop,
                fn: self.program(12, program12, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\r\n\r\n			";
            stack1 = helpers.unless.call(depth0, depth0 && depth0.code, {
                hash: {},
                inverse: self.noop,
                fn: self.program(14, program14, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += '\r\n		</div>\r\n		\r\n		<div class="zq-actcompt-zjjg-c2">\r\n			<h4 class="tit">说明：</h4>\r\n			';
            if (helper = helpers.prizeIntro) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.prizeIntro;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\r\n		</div>\r\n		";
            return buffer;
        }
        function program10(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n			<div class="zq-actcompt-form-item">\r\n				<div class="zq-actcompt-form-tit">帐号：</div>\r\n				<div class="zq-actcompt-form-input"><input id="act_module_code" type="text" value="';
            if (helper = helpers.code) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.code;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + '"></div>\r\n				<a href="#copy" class="zq-actcompt-btn-copy" id="btn_copy_code">复制</a>\r\n			</div>\r\n			';
            return buffer;
        }
        function program12(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n			<div class="zq-actcompt-form-item">\r\n				<div class="zq-actcompt-form-tit">密码：</div>\r\n				<div class="zq-actcompt-form-input"><input id="act_module_secretkey" type="text" value="';
            if (helper = helpers.secretKey) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.secretKey;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + '"></div>\r\n				<a href="#copy" class="zq-actcompt-btn-copy" id="btn_copy_secretkey">复制</a>\r\n			</div>\r\n			';
            return buffer;
        }
        function program14(depth0, data) {
            return '\r\n			<div class="zq-actcompt-btn-box" style="display:none;"><button type="button" class="zq-actcompt-btn-submit" id="btn_fill_info">填写资料</button></div>\r\n			';
        }
        function program16(depth0, data) {
            return '\r\n		<h4 class="zq-actcompt-tit">很抱歉，您未能中奖</h4>\r\n		<p>请继续关注17173，更多活动等着您。</p>\r\n		';
        }
        function program18(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += "\r\n		";
            if (helper = helpers.msg) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.msg;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + "\r\n		";
            return buffer;
        }
        buffer += '<div class="zq-actcompt-pop';
        stack1 = helpers["if"].call(depth0, depth0 && depth0.success, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        stack1 = helpers["if"].call(depth0, depth0 && depth0.failed, {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '" id="result_pop">\r\n	<span class="zq-actcompt-pop-close"></span>\r\n	<h4 class="zq-actcompt-pop-tit">';
        stack1 = helpers["if"].call(depth0, depth0 && depth0.showError, {
            hash: {},
            inverse: self.program(7, program7, data),
            fn: self.program(5, program5, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '</h4>\r\n	<div class="zq-actcompt-pcon ">\r\n		';
        stack1 = helpers["if"].call(depth0, depth0 && depth0.success, {
            hash: {},
            inverse: self.noop,
            fn: self.program(9, program9, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n\r\n		";
        stack1 = helpers["if"].call(depth0, depth0 && depth0.failed, {
            hash: {},
            inverse: self.noop,
            fn: self.program(16, program16, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n\r\n		";
        stack1 = helpers["if"].call(depth0, depth0 && depth0.showError, {
            hash: {},
            inverse: self.noop,
            fn: self.program(18, program18, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\r\n\r\n	</div>\r\n</div>\r\n<div class="zq-actcompt-pop-mask"></div>';
        return buffer;
    });
});