define(function(require, exports, module) {
	var $ = require('$'),
		Widget = require('widget'),
		Handlebars = require('handlebars'),
		Utils = require('./utils');

	/**
	* 数据及基础类
	*
	* @class Core
	* @constructor
	*/
	var Core = Widget.extend({
		/**
		 * 默认参数
		 *
		 * @property {object} defaults 默认参数
		 * @type {object}
		 */
		defaults: {
			actId: 0,
			style: 1
		},
		setup: function(){
			var host = this.host = 'http://p.act.dev.17173.com/api/v1/activity/' + this.option('actId'),
				lotteryId = this.option('lotteryId');
			this.url = {
				voteInfoUrl: 'http://vote.17173.com/port/getvote_interface.php?callback=?',
				voteProcUrl: 'http://vote.17173.com/action/vote_process_interface.php?callback=?',
				lotteryUrl: host + '/lottery/' + lotteryId + '?callback=?',
				fieldsetUrl: host + '/form?callback=?',
				actInfoUrl: host + '/info?callback=?',
				lotteryInfoUrl: host + '/lottery/' + lotteryId + '/info?callback=?',
				smsUrl: host + '/lottery/' + lotteryId + '/smsCaptchaCode?callback=?',
				saveInfoUrl: host + '/form/' + this.option('fieldSetId') + '/saveData?callback=?',
				checkLoginUrl: host + '/lottery/' + lotteryId + '/chkLogin?callback=?'
			};
			this.getActInfo();
			this.getTemplates();
			this.prizeText = $(this.element).find('.prize-text').html();
			$(this.element).html('');
		},

		/**
		 * @method getActInfo 获取活动数据
		 * @private
		 */
		getActInfo: function(){
			var self = this;
			$.getJSON(self.url.actInfoUrl, function(actInfo){
				if(actInfo.result){
					alert(actInfo.msg);
				} else{
					self.getLotteryInfo(actInfo);
				}			
			});
		},

	    /**
	     * @method getLotteryInfo 获取抽奖数据
	     * @param  {object}   actInfo 活动数据
	     * @private
	     */
		getLotteryInfo: function(actInfo){
			var self = this;
			$.getJSON(this.url.lotteryInfoUrl, function(lotteryData){
				self.validateType = lotteryData.isVeriCode;
				actInfo.prizeList = lotteryData.prizeList;
				self.render(actInfo);
			});
		},


	    /**
	     * @method startFromHere 根据配置决定显示第二步的投票或者评论弹窗，或者跳过第二步执行第三步的验证码
	     * @private
	     */
		startFromHere: function(){
			if(this.option('voteId')){
				this.showVotePop();
			} else if(this.option('needComment')){
				this.showCommentPop();
			} else{
				this.checkValidate();
			}
		},

	    /**
	     * @mehod getVoteInfo 获取投票数据
	     * @private
	     */
		getVoteInfo: function(){
			var self = this;
			$.ajax({
				url: self.url.voteInfoUrl,
				data: {
					id: self.option('voteId')
				},
				dataType: 'jsonp',
				success: function(data){
					self.renderVote(data);
				}
			})
		},

	    /**
	     * @method doVote 执行投票
	     * @param  {object}   voteData 投票数据
	     * @private
	     */
		doVote: function(voteData){
			var self = this;
			$.getJSON(self.url.voteProcUrl, voteData, function(data){
				self.voteSuccess();
			})
		},

	    /**
	     * @method isLoggedIn 判断用户是否登录
	     * @return {boolean} true-已登录 false-未登录
	     * @private
	     */		
		isLoggedIn: function(){
			if(typeof Passport !== 'undefined' && Passport.isLoggedIn()){
				return true;
			}
			if(typeof Passport !== 'undefined' && !Passport.isLoggedIn()){
				return false;
			}

			$.getJSON(this.url.checkLoginUrl, function(data){
				if(data.loginStatus == 0){
					return false;
				}
				return true;
			})
		},

	    /**
	     * @method doComment 执行评论
	     * @param  {String}   val 评论内容
	     * @param  {String}   sid 畅言ID
	     * @private
	     */		
		doComment: function(val, sid){
			var self = this;
			$.getJSON('http://changyan.sohu.com/api/2/topic/load?callback=?', {
				source_id: sid, //评论SID,不可为空
                topic_url: location.href, //需要评论文章的URL,不可为空
                client_id: 'cyqvqDTV5' //固定，不要更改
			}, function(data){
				var topicId = data.topic_id;
				$.getJSON('http://act.17173.com/comment/submit.php?callback=?', {
                    client_id: 'cyqvqDTV5',//固定，不要更改
                    topic_id: topicId,
                    content: encodeURIComponent(val),
                    access_token: 'P9YIlfiDcC45SbJInp7DCfvA-Bhgu1ZG'//固定，不要更改
				}, function(json){
					self.commentSuccess();
				})
			})
		},

	    /**
	     * @method checkValidate 判断验证码类型显示对应弹窗
	     * @private
	     */	
		checkValidate: function(){
			if(this.validateType === 'sms'){
				this.showSmsPop();
			} else if(this.validateType === 'image'){
				this.showImageCaptcha();
			} else if(this.option('needInfo')){
				this.showInfoPop();
			} else{
				this.doLottery();
			}
		},

	    /**
	     * @method sendSms 发送短信验证码
	     * @param  {String}   mobile 手机号码
	     * @private
	     */	
		sendSms: function(mobile){
			$.getJSON(this.url.smsUrl, {mobile: mobile}, function(data){
				if(data.result === 'info.sms.failed'){ //TODO: !! 这里改成成功的
					self.smsSended = true;
					self.smsSendSuccess();
				} else{
					alert(data.msg);
				}
			})
		},

	    /**
	     * @method submitInfo 提交个人信息
	     * @private
	     */			
		submitInfo: function(){
			var self = this,
				formData = this.validateInfoForm();
			if(!!formData){
				var info = {
					lotteryId: self.lotteryId,
					formData: formData
				}
				$.getJSON(self.url.saveInfoUrl, info, function(data){
					if(data.result === 'info.form.success'){
						self.submitInfoSuccess();
					} else{
						alert(data.msg);
					}
				});
			}		
		},

	    /**
	     * @method validateInfoForm 验证个人信息表单
	     * @return {object} formData 验证通过返回表单数据 {boolean} 不通过返回false
	     * @private
	     */			
		validateInfoForm: function(){
			var pass = true,
				formData = {},
				reMail = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
				reMobile = /^1\d{10}$/,
				reQQ = /^[1-9]\d{4,11}$/;
			$('.lottery-form-input').each(function(){
				var val = $.trim($(this).find('input').val()),
					name = $(this).find('input').attr('name'),
					cName = $(this).prev('.lottery-form-tit').text();
				if(val === ''){
					$(this).find('.lottery-form-error').show().text('请填写您的' + cName);
					pass = false;
				} else if(name === 'email' && !reMail.test(val)){
					$(this).find('.lottery-form-error').show().text('请输入正确的' + cName);
					pass = false;				
				} else if(name === 'phone' && !reMobile.test(val)){
					$(this).find('.lottery-form-error').show().text('请输入正确的' + cName);
					pass = false;
				} else if(name === 'qq' && !reQQ.test(val)){
					$(this).find('.lottery-form-error').show().text('请输入正确的' + cName);
					pass = false;
				} else{
					$(this).find('.lottery-form-error').hide().text('');
					formData[name] = val;
				}
			})
			if(pass){
				return formData;
			} else{
				return false;
			}
		},

	    /**
	     * @method animateIt 样式三的抽奖动画
	     * @param  {String}   prizeId 奖品ID，未中奖为0
	     * @param  {object}   data 抽奖接口返回的数据
	     * @param  {object}   template 中奖结果弹窗的模板
	     * @private
	     */	
		animateIt: function(prizeId, data, template){
			var self = this;
			var moving = false;
		    var timer = null;
		    var index = 0;  //起始位置
		    var obj = $('.lottery-item');
		    var len = obj.length;
		    var circle = 10;  //转10圈                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
		    var stopAt;      //最终奖品位置
		    var speed = 12;  //速度
		    var base = 30;   //减速度
		    var timt = speed * base;

		    obj.removeClass('blink');

		    for(var i = 0; i < len; i++){
		    	var id = obj.eq(i).attr('data-prizeId');
		    	if(id == prizeId){
		    		stopAt = i + 1;
		    		break;
		    	}
		    }

		    turntableOpt();

		    function turntableOpt(callback) {
		        index++;
		        if (index <= speed) {
		            timt = timt - base;
		            timer = setInterval(function() {
		                turntableMove(callback);
		            }, timt);
		        } else if (index > speed && index <= circle * len + stopAt - speed / 2) {
		            timer = setInterval(function() {
		                turntableMove(callback);
		            }, 30);
		        } else if (index > circle * len + stopAt - speed / 2 && index < circle * len + stopAt) {
		            timt = timt + base;
		            timer = setInterval(function() {
		                turntableMove(callback);
		            }, timt);
		        } else {
		            moving = false;
		            clearInterval(timer);
		            setTimeout(function() {
		            	$(template(data)).appendTo(self.element);
		            	typeof self.copy === 'function' && self.copy();
		            }, 500);
		        }
		    }

		    function turntableMove(callback) {
		        clearInterval(timer);
		        var cur = index % len;
		        if (cur === 0) {
		            obj.eq(len - 1).removeClass("blink");
		            obj.eq(0).addClass("blink");
		        } else {
		            obj.eq(cur - 1).removeClass("blink");
		            obj.eq(cur).addClass("blink");
		        }
		        turntableOpt(callback);
		    }
		},

	    /**
	     * @method doLottery 执行抽奖
	     * @param  {object}   data 验证码(如有)
	     * @private
	     */		
		doLottery: function(data){
			var self = this,
				data = data ? data : {};

			$.getJSON(this.url.lotteryUrl, data, function(resultData){
				resultData.code = '25235236236236';
				resultData.secretKey = 'secretKey';


				resultData.prizeText = self.prizeText;
				self.handleLotteryResult(resultData);
			});
		},

	    /**
	     * @method handleLotteryResult 处理抽奖结果
	     * @param  {object}   data 抽奖接口返回的数据
	     * @private
	     */	
		handleLotteryResult: function(data){
			
			//这里把抽奖结果分为三类：1. 正常抽奖 2. 用户端错误 3.系统端错误
			//对应的操作：1. 弹结果框 2.弹错误信息，保留输入框 3.弹错误信息，关闭输入框
			//所有抽奖结果文档见: http://p.act.dev.17173.com/docs/document/V1/LotteryController
			var resultType;

			switch(data.result){
				case 'info.lottery.failed': //未中奖
					data.prizeId = 0;
					data.failed = true;
					resultType = 1;
					break;
				case 'info.lottery.success': //中奖
					data.success = true;
					resultType = 1;
					break;
				case 'info.login.error': //未登录
					resultType = 2;
					break;
				case 'info.captcha.error': //验证码错误
					resultType = 2;
					break;
				case 'info.mobile.error': //手机号错误
					resultType = 2;
					break;
				default:
					data.showError = true;
					resultType = 3;
			}

			this.done(data, resultType);
		}

	});

	module.exports = Core;
});