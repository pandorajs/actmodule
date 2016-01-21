define("pandora/actmodule/1.0.0/template/pc/sms.handlebars", [ "gallery/handlebars/1.3.0/handlebars-runtime" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.3.0/handlebars-runtime");
    module.exports = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        return '<div class="zq-actcompt-pop zq-actcompt-pop-ex" id="sms_pop">\r\n	<span class="zq-actcompt-pop-close"></span>\r\n	<h4 class="zq-actcompt-pop-tit">请完成验证码</h4>\r\n	<div class="zq-actcompt-pcon">\r\n		<div class="zq-actcompt-form-item">\r\n			<div class="zq-actcompt-form-input"><input id="mobile_input" maxlength="11" type="text" value="" placeholder="请输入手机号码"></div>\r\n			<a href="#send" class="zq-actcompt-btn-sendcode" id="send_sms">\r\n				<span id="zq_actcompt_send_sms">发送</span>\r\n				<span id="zq_actcompt_resend_sms">重新发送<span class="lottery-snum">(<span class="zq-actcompt-snum" id="sms_time_left">120</span>)</span></span>\r\n			</a>\r\n		</div>\r\n		<div class="zq-actcompt-form-item">\r\n			<div class="zq-actcompt-form-input zq-actcompt-form-input-ex"><input maxlength="4" id="sms_input" type="text" value="" placeholder=""></div>\r\n		</div>\r\n		<div class="zq-actcompt-btn-box zq-actcompt-tc"><button type="button" class="zq-actcompt-btn-submit" id="submit_sms">提交</button></div>\r\n	</div>\r\n</div>\r\n<div class="zq-actcompt-pop-mask"></div>';
    });
});