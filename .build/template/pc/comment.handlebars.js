define("pandora/actmodule/1.0.0/template/pc/comment.handlebars", [ "gallery/handlebars/1.3.0/handlebars-runtime" ], function(require, exports, module) {
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
            buffer += '\r\n		<h4 class="zq-actcompt-fb">';
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
            buffer += escapeExpression(stack1) + "</h4>\r\n		";
            return buffer;
        }
        buffer += '<div class="zq-actcompt-pop" id="comment_pop">\r\n	<span class="zq-actcompt-pop-close"></span>\r\n	<h4 class="zq-actcompt-pop-tit">填写评论后参与抽奖</h4>\r\n	<div class="zq-actcompt-pcon">\r\n		';
        stack1 = helpers["if"].call(depth0, depth0 && depth0.commentTip, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\r\n		<div class="zq-actcompt-form-textarea"><textarea id="comment_text" name="textarea" class="" placeholder=""></textarea></div>\r\n		<div class="zq-actcompt-btn-box  zq-actcompt-tr"><button type="button" class="zq-actcompt-btn-submit" id="submit_comment">提交</button></div>\r\n	</div>\r\n</div>\r\n<div class="zq-actcompt-pop-mask"></div>';
        return buffer;
    });
});