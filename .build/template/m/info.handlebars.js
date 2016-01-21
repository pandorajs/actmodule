define("pandora/actmodule/1.0.0/template/m/info.handlebars", [ "gallery/handlebars/1.3.0/handlebars-runtime" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.3.0/handlebars-runtime");
    module.exports = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, self = this, functionType = "function", escapeExpression = this.escapeExpression;
        function program1(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n			<div class="zq-actcompt-form-item"';
            stack1 = helpers["if"].call(depth0, depth0 && depth0.comment, {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += '>\r\n				<label class="zq-actcompt-form-tit" data-name>';
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
            buffer += escapeExpression(stack1) + '</label>\r\n				<input class="zq-actcompt-form-input" type="text" name="';
            if (helper = helpers.columnName) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.columnName;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + '" maxlength="';
            if (helper = helpers.length) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.length;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + '" value="" placeholder="">\r\n			</div>\r\n			<div class="zq-actcompt-form-error"><i class="zq-actcompt-ico-error"></i><span></span></div>\r\n			';
            return buffer;
        }
        function program2(depth0, data) {
            return ' style="display:none"';
        }
        buffer += '<div class="zq-actcompt-pop" id="info_pop">\r\n	<section class="zq-actcompt-pop-in">\r\n		<header class="zq-actcompt-pop-hd"><h4 class="zq-actcompt-tit">提交联系方式</h4><a href="javascript:;" class="zq-actcompt-pop-close"><i class="zq-actcompt-ico-close"></i></a></header>\r\n		<div class="zq-actcompt-pop-bd">\r\n			<p class="zq-actcompt-pop-tiptxt">请填写真实信息，奖品将通过所填写的联系方式进行发放！</p>\r\n\r\n			';
        stack1 = helpers.each.call(depth0, depth0, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\r\n\r\n		</div>\r\n		<div class="zq-actcompt-btn-box">\r\n			<button type="button" class="zq-actcompt-pop-btn-submit" id="submit_info">提交</button>\r\n			<button type="button" class="zq-actcompt-pop-btn-cancel" id="cancel_submit_info">取消</button>\r\n		</div>\r\n	</section>\r\n</div>';
        return buffer;
    });
});