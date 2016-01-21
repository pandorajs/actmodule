define("pandora/actmodule/1.0.0/template/m/result.handlebars", [ "gallery/handlebars/1.3.0/handlebars-runtime" ], function(require, exports, module) {
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
            return "提示";
        }
        function program3(depth0, data) {
            return "中奖结果";
        }
        function program5(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n			<p class="zq-actcompt-pop-zjtit">恭喜您！获得了：<br> \r\n			<span class="zq-actcompt-tx1 zq-actcompt-pop-tiptxt">';
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
            buffer += escapeExpression(stack1) + "</span></p>\r\n\r\n			";
            stack1 = helpers["if"].call(depth0, depth0 && depth0.code, {
                hash: {},
                inverse: self.noop,
                fn: self.program(6, program6, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\r\n\r\n			";
            stack1 = helpers["if"].call(depth0, depth0 && depth0.secretKey, {
                hash: {},
                inverse: self.noop,
                fn: self.program(8, program8, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\r\n\r\n			";
            stack1 = helpers.unless.call(depth0, depth0 && depth0.code, {
                hash: {},
                inverse: self.noop,
                fn: self.program(10, program10, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += '\r\n\r\n			<div class="zq-actcompt-pop-line"></div>\r\n			<div class="zq-actcompt-pop-info"><span>说明：</span><br>\r\n				';
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
            buffer += "\r\n			</div>\r\n			";
            return buffer;
        }
        function program6(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n			<div class="zq-actcompt-form-item">\r\n				<label class="zq-actcompt-form-tit">帐号</label>\r\n				<div class="zq-actcompt-form-input">';
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
            buffer += escapeExpression(stack1) + "</div>\r\n			</div>\r\n			";
            return buffer;
        }
        function program8(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n			<div class="zq-actcompt-form-item">\r\n				<label class="zq-actcompt-form-tit">密码</label>\r\n				<div class="zq-actcompt-form-input">';
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
            buffer += escapeExpression(stack1) + "</div>\r\n			</div>\r\n			";
            return buffer;
        }
        function program10(depth0, data) {
            return '\r\n			<button type="button" class="zq-actcompt-pop-btn-submit zq-actcompt-btn-box" id="btn_fill_info">填写资料</button>\r\n			';
        }
        function program12(depth0, data) {
            return '\r\n			<p class="zq-actcompt-pop-zjtit zq-actcompt-tx1">很抱歉，您未能中奖！<br>请继续关注17173，更多活动等着您。</p>\r\n			';
        }
        function program14(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n			<p class="zq-actcompt-sub-tit">';
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
            buffer += escapeExpression(stack1) + "</p>\r\n			";
            return buffer;
        }
        buffer += '<div class="zq-actcompt-pop" id="result_pop">\r\n	<section class="zq-actcompt-pop-in">\r\n		<header class="zq-actcompt-pop-hd"><h4 class="zq-actcompt-tit">';
        stack1 = helpers["if"].call(depth0, depth0 && depth0.showError, {
            hash: {},
            inverse: self.program(3, program3, data),
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '</h4><a href="javascript:;" class="zq-actcompt-pop-close"><i class="zq-actcompt-ico-close"></i></a></header>\r\n		<div class="zq-actcompt-pop-bd">\r\n\r\n			';
        stack1 = helpers["if"].call(depth0, depth0 && depth0.success, {
            hash: {},
            inverse: self.noop,
            fn: self.program(5, program5, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n\r\n			";
        stack1 = helpers["if"].call(depth0, depth0 && depth0.failed, {
            hash: {},
            inverse: self.noop,
            fn: self.program(12, program12, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n\r\n			";
        stack1 = helpers["if"].call(depth0, depth0 && depth0.showError, {
            hash: {},
            inverse: self.noop,
            fn: self.program(14, program14, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n		</div>\r\n	</section>\r\n</div>\r\n";
        return buffer;
    });
});