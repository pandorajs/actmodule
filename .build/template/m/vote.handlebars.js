define("pandora/actmodule/1.0.0/template/m/vote.handlebars", [ "gallery/handlebars/1.3.0/handlebars-runtime" ], function(require, exports, module) {
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
            buffer += '\r\n        <div class="zq-actcompt-pop-bd" data-voteid="';
            if (helper = helpers.voteid) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.voteid;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + '" data-votetype="';
            if (helper = helpers.voteflag) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.voteflag;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + '">\r\n            <p class="zq-actcompt-tp">';
            if (helper = helpers.title) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.title;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + ':</p>\r\n            <ul class="zq-actcompt-votelist">\r\n                ';
            stack1 = helpers.each.call(depth0, depth0 && depth0.itemlist, {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += '\r\n            </ul>\r\n            <a href="javascript:;" class="zq-actcompt-pop-btn-submit" id="submit_vote">提交</a>\r\n        </div>\r\n        ';
            return buffer;
        }
        function program2(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n                <li class="zq-actcompt-votelist-item" data-itemid="';
            if (helper = helpers.itemid) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.itemid;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + '">';
            if (helper = helpers.itemtitle) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.itemtitle;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + "</li>\r\n                ";
            return buffer;
        }
        buffer += '<div class="zq-actcompt-pop" id="vote_pop" style="display:none;">\r\n    <section class="zq-actcompt-pop-in">\r\n        <header class="zq-actcompt-pop-hd"><h4 class="zq-actcompt-tit">完成投票后参与抽奖</h4><a href="javascript:;" class="zq-actcompt-pop-close"><i class="zq-actcompt-ico-close"></i></a></header>\r\n        ';
        stack1 = helpers.each.call(depth0, depth0 && depth0.votelist, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n    </section>\r\n</div>";
        return buffer;
    });
});