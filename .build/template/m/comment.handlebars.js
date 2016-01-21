define("pandora/actmodule/1.0.0/template/m/comment.handlebars", [ "gallery/handlebars/1.3.0/handlebars-runtime" ], function(require, exports, module) {
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
            var buffer = "", stack1, helper;
            buffer += '\r\n			<p class="zq-actcompt-tp">';
            if (helper = helpers.commentTip) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.commentTip;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + "：</p>\r\n			";
            return buffer;
        }
        buffer += '<div class="zq-actcompt-pop" id="comment_pop">\r\n	<section class="zq-actcompt-pop-in">\r\n		<header class="zq-actcompt-pop-hd"><h4 class="zq-actcompt-tit">填写评论后参与抽奖</h4><a href="#" class="zq-actcompt-pop-close"><i class="zq-actcompt-ico-close"></i></a></header>\r\n		<div class="zq-actcompt-pop-bd">\r\n			';
        stack1 = helpers["if"].call(depth0, depth0 && depth0.commentTip, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\r\n			<div class="zq-actcompt-form-textarea"><textarea id="comment_text" name="textarea" class="" placeholder=""></textarea></div>\r\n			<a href="javascript:;" class="zq-actcompt-pop-btn-submit" id="submit_comment">提交</a>\r\n		</div>\r\n	</section>\r\n</div>	';
        return buffer;
    });
});