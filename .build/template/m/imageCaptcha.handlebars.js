define("pandora/actmodule/1.0.0/template/m/imageCaptcha.handlebars", [ "gallery/handlebars/1.3.0/handlebars-runtime" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.3.0/handlebars-runtime");
    module.exports = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, helper, functionType = "function", escapeExpression = this.escapeExpression;
        buffer += '<div class="zq-actcompt-pop" id="captcha_pop">\r\n	<section class="zq-actcompt-pop-in">\r\n		<header class="zq-actcompt-pop-hd"><h4 class="zq-actcompt-tit">请完成验证码</h4><a href="javascript:;" class="zq-actcompt-pop-close"><i class="zq-actcompt-ico-close"></i></a></header>\r\n		<div class="zq-actcompt-pop-bd">\r\n			<div class="zq-actcompt-form-item-ex">\r\n				<input class="zq-actcompt-form-input" type="text" id="captcha_input" maxlength="4" value="" placeholder="输入验证码">\r\n				<div class="zq-actcompt-verify-img">\r\n					<img src="';
        if (helper = helpers.captcha) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            helper = depth0 && depth0.captcha;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper;
        }
        buffer += escapeExpression(stack1) + '" alt="" id="za_actcompt_captcha">\r\n				</div>\r\n			</div>\r\n		</div>\r\n		<button type="button" class="zq-actcompt-pop-btn-submit" id="submit_image_captcha">提交</button>	\r\n	</section>\r\n</div>';
        return buffer;
    });
});