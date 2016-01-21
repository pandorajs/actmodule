define("pandora/actmodule/1.0.0/template/m/sms.handlebars", [ "gallery/handlebars/1.3.0/handlebars-runtime" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.3.0/handlebars-runtime");
    module.exports = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        return '<div class="zq-actcompt-pop" id="sms_pop">\r\n	<section class="zq-actcompt-pop-in">\r\n		<header class="zq-actcompt-pop-hd"><h4 class="zq-actcompt-tit">请完成验证码</h4><a href="#" class="zq-actcompt-pop-close"><i class="zq-actcompt-ico-close"></i></a></header>\r\n		<div class="zq-actcompt-pop-bd">\r\n			<div class="zq-actcompt-form-item-ex1">\r\n				<input class="zq-actcompt-form-input" id="mobile_input" maxlength="11" type="text" value="" placeholder="输入手机号">\r\n\r\n				<button type="button" class="zq-actcompt-pop-btn-send" id="zq_actcompt_send_sms">发送</button>\r\n				<button type="button" class="zq-actcompt-pop-btn-send" id="zq_actcompt_resend_sms">重新发送(<span id="sms_time_left">120</span>)</button>\r\n\r\n			</div>\r\n			<input class="zq-actcompt-form-input" type="text" maxlength="4" id="sms_input" value="" placeholder="输入验证码">\r\n		</div>\r\n		<button type="button" class="zq-actcompt-pop-btn-submit" id="submit_sms">提交</button>	\r\n	</section>\r\n</div>';
    });
});