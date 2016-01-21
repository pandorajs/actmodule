define("pandora/actmodule/1.0.0/template/pc/imageCaptcha.handlebars", [ "gallery/handlebars/1.3.0/handlebars-runtime" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.3.0/handlebars-runtime");
    module.exports = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, helper, functionType = "function", escapeExpression = this.escapeExpression;
        buffer += '<div class="zq-actcompt-pop zq-actcompt-pop-ex1" id="captcha_pop">\r\n	<span class="zq-actcompt-pop-close"></span>\r\n	<h4 class="zq-actcompt-pop-tit">请完成验证码</h4>\r\n	<div class="zq-actcompt-pcon">\r\n		<form id="image_captcha_form">\r\n			<div class="zq-actcompt-form-item">\r\n				<div class="zq-actcompt-form-input"><input maxlength="4" id="captcha_input" type="text" value="" placeholder=""></div>\r\n				<div class="zq-actcompt-validcode-img"><img id="za_actcompt_captcha" src="';
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
        buffer += escapeExpression(stack1) + '" width="70" height="27" alt=""></div>\r\n			</div>\r\n			<div class="zq-actcompt-btn-box zq-actcompt-tc">\r\n				<button type="submit" class="zq-actcompt-btn-submit" id="submit_image_captcha">提交</button>\r\n			</div>\r\n		</form>\r\n	</div>\r\n</div>\r\n<div class="zq-actcompt-pop-mask"></div>';
        return buffer;
    });
});