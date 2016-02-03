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
			style: 1,
			fieldset: ''
		},
		setup: function(){
			var host = this.host = 'http://p.act.dev.17173.com/api/v1/activity/' + this.option('actId'),
				lotteryId = this.option('lotteryId'),
				fieldSetId = this.option('fieldSetId');
			this.urls = {
				voteInfo: 'http://vote.17173.com/port/getvote_interface.php?callback=?',
				voteProc: 'http://vote.17173.com/action/vote_process_interface.php?callback=?',
				lottery: host + '/lottery/' + lotteryId + '?callback=?',
				fieldset: host + '/form?formId=' + fieldSetId + '&callback=?',
				actInfo: host + '/info?callback=?',
				lotteryInfo: host + '/lotteryInfo?lotteryId=' + lotteryId + '&callback=?',
				sms: host + '/lottery/' + lotteryId + '/smsCaptchaCode?callback=?',
				saveInfo: host + '/form/' + this.option('fieldSetId') + '/saveData?callback=?',
				checkLogin: host + '/lottery/' + lotteryId + '/chkLogin?callback=?',
				cyanLoad: 'http://changyan.sohu.com/api/2/topic/load?callback=?',
				commentSubmit: 'http://act.17173.com/comment/submit.php?callback=?',
				join: host + '/join?callback=?'
			};
			this.mobile = this.option('forceMobile') || Utils.isMobile();
			this.getActInfo();
			this.ajaxPrefilter();
			this.getTemplates();
			this.platform = this.mobile ? 'mobile' : 'pc';
		},

		/**
		 * @method ajaxPrefilter 防止重复发送AJAX请求
		 * @private
		 */
		ajaxPrefilter: function(){
			var pendingRequests = {};
			function generatePendingRequestKey(options){
				return options.url;
			}
			function storePendingRequest(key, jqXHR){
				pendingRequests[key]=jqXHR;
				jqXHR.pendingRequestKey = key;
			}

			$.ajaxPrefilter(function(options, originalOptions, jqXHR){
				var key = generatePendingRequestKey(options);
				if (!pendingRequests[key]) {
					storePendingRequest(key, jqXHR);
				} else {
					jqXHR.abort();
				}
				var success = options.success;
				options.success = function(jqXHR, textStatus) {
					if ($.isFunction(success)) {
						success.apply(this, arguments);
					}
				}
			  
				var error = options.error;
				options.error = function(jqXHR, textStatus) {
					if ($.isFunction(error)) {
						error.apply(this, arguments);
					}
				};
				  
				var complete = options.complete;
				options.complete = function(jqXHR, textStatus) {
					pendingRequests[jqXHR.pendingRequestKey] = null;
					if ($.isFunction(complete)) {
						complete.apply(this, arguments);
					}
				}
			})
		},

		/**
		 * @method getActInfo 获取活动数据
		 * @private
		 */
		getActInfo: function(){
			var self = this;
			$.getJSON(self.urls.actInfo, function(actInfo){
				//如果有错误信息，直接退出
				if(actInfo.result){
					return;
				}
				actInfo.beginTimeFormatted = actInfo.beginTime.substring(0, 10).replace(/-/g, '.');
				actInfo.endTimeFormatted = actInfo.endTime.substring(0, 10).replace(/-/g, '.');
				actInfo.collectInfo = self.option('collectInfo');
				self.getLotteryInfo(actInfo);
				self.actInfo = actInfo;
			});
		},

	    /**
	     * @method getLotteryInfo 获取抽奖数据
	     * @param  {object}   actInfo 活动数据
	     * @private
	     */
		getLotteryInfo: function(actInfo){
			var self = this;
			if(self.option('collectInfo')){
				actInfo.showImg = self.option('showImg');
				self.render(actInfo);
			} else{
				$.getJSON(this.urls.lotteryInfo, function(lotteryData){
					self.validateType = lotteryData.isVeriCode;
					self.needLoggedIn = lotteryData.limitCond.indexOf('login') > -1;
					var info = {
						prizeList: lotteryData.prizeList,
						prizeCount: lotteryData.prizeList.length + 1,
						showImg: self.option('showImg'),
						lotteryBeginTime: lotteryData.startTime,
						lotteryEndTime: lotteryData.endTime,
						lotteryBeginTimeFormatted: lotteryData.startTime.substring(0, 10).replace(/-/g, '.'),
						lotteryEndTimeFormatted: lotteryData.endTime.substring(0, 10).replace(/-/g, '.')
					}
					actInfo = $.extend({}, actInfo, info);
					self.render(actInfo);
				});			
			}
		},

	    /**
	     * @method getInfoFields 获取个人信息表单
	     * @private
	     */
		getInfoFields: function(){
			var self = this;
			if(!this.option('fieldSetId')){
				return;
			}
			$.getJSON(self.urls.fieldset, function(data){
				for(var i = 0; i < data.formField.length; i++){
					if(data.formField[i].columnName == 'comment'){
						data.formField[i].comment = true;
						if(data.formField.length === 1){
							self.notShowInfo = true;
						}
					}
					self.fieldSet = data.formField;
				}
				if(!self.fieldSet){
					alert('无法读取ID为' + self.option('fieldSetId') + '的表单，请检查后重新配置.')
				}
			})
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
				if(this.option('collectInfo')){
					this.showInfoPop();
				} else{
					this.needLoggedIn ? this.checkLogin() : this.checkInfo();
				}
			}
		},

	    /**
	     * @mehod getVoteInfo 获取投票数据
	     * @private
	     */
		getVoteInfo: function(){
			var self = this;
			$.ajax({
				url: self.urls.voteInfo,
				data: {
					id: self.option('voteId')
				},
				dataType: 'jsonp',
				success: function(data){
					self.voteJSON = data;
					self.renderVote();
				}
			})
		},

	    /**
	     * @method initAct 取投票和信息字段
	     * @private
	     */
		initAct: function(){
			//如果需要投票, 取回投票数据
			if(this.option('voteId')){
				this.getVoteInfo();
			} 
			//只要配置了fieldSetId，就取回个人信息表单项
			if(this.option('fieldSetId')){
				this.getInfoFields();
			}
		},

	    /**
	     * @method doVote 执行投票
	     * @param  {object}   voteData 投票数据
	     * @private
	     */
		doVote: function(voteData){
			var self = this;
			$.getJSON(self.urls.voteProc, voteData, function(data){
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

			$.getJSON(this.urls.checkLogin, function(data){
				if(data.loginStatus == 0){
					return false;
				}
				return true;
			})
		},

	    /**
	     * @method doComment 执行评论, 如果个人信息表单只有一个评论项时，需要同时提交评论到收集表单。并且不用显示个人信息表单。
	     * @param  {String}   val 评论内容
	     * @param  {String}   sid 畅言ID
	     * @param  {String}   btn 提交按钮的选择器
	     * @private
	     */		
		doComment: function(val, sid){
			var self = this;
			$.getJSON(this.urls.cyanLoad, {
				source_id: sid, //评论SID,不可为空
                topic_url: location.href, //需要评论文章的URL,不可为空
                client_id: 'cyqvqDTV5' //固定，不要更改
			}, function(data){
				data = self.mapCommentData(data);
				var topicId = data.topic_id;
				$.getJSON(self.urls.commentSubmit, {
                    client_id: 'cyqvqDTV5',//固定，不要更改
                    topic_id: topicId,
                    content: val,
                    access_token: 'P9YIlfiDcC45SbJInp7DCfvA-Bhgu1ZG'//固定，不要更改
				}, function(json){
					self.commentContent = val; //把评论数据存起来
					if(!self.option('collectInfo')){ //如果是即时抽奖
						if(self.notShowInfo){ //且收集表单里只有一个评论字段，就在这里把评论提交到收集表单
							self.submitInfo({comment: val});
						}
					}
					self.commentSuccess();
				})
			})
		},
		mapCommentData: function(data){
			return data;
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
			} else{
				this.doLottery();
			}
		},

	    /**
	     * @method checkInfo 判断是否需要显示个人信息弹窗
	     * @private
	     */	
		checkInfo: function(){
			if(this.option('needInfo') && !this.notShowInfo){
				this.showInfoPop();
			} else{
				this.checkValidate();
			}
		},

	    /**
	     * @method sendSms 发送短信验证码
	     * @param  {String}   mobile 手机号码
	     * @private
	     */
		sendSms: function(mobile){
			var self = this;
			$.getJSON(this.urls.sms, {mobile: mobile}, function(data){
				if(data.result === 'info.sms.success'){ 
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
		submitInfo: function(commentData){
			// if(Math.floor(new Date().getTime()/1000) > this.endTime){
			// 	alert('活动已结束.');
			// 	return;
			// }
			var self = this;
			var url = this.collectInfo ? this.urls.actInfo : this.urls.lotteryInfo;
			$.getJSON(url, function(data){
				if(data.timestamp > this.endTime){
					alert('活动已结束.');
					return;
				}
				var formData = commentData || self.validateInfoForm();
				if(!!formData){
					var info = {
						lotteryId: self.lotteryId,
						formData: formData
					}
					$.getJSON(self.urls.saveInfo, info, function(data){
						if(data.result === 'info.form.success'){
							self.submitInfoSuccess();
						} else{
							alert(data.msg);
							if(data.result == 'info.act.close'){
								self.actClose();
							}
						}
					});
				}
			})
		},


	    /**
	     * @method animateIt 样式三的抽奖动画
	     * @param  {String}   prizeId 奖品ID，未中奖为0
	     * @param  {object}   data 抽奖接口返回的数据
	     * @param  {String}   el 奖品的类名
	     * @private
	     */	
		animateIt: function(prizeId, data, el){
			var self = this;
			var moving = false;
		    var timer = null;
		    var index = 0;  //起始位置
		    var obj = $(el);
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
		            	self.animateEnd(data);
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

			$.getJSON(this.urls.lottery, data, function(resultData){
				// resultData.code = '25235236236236';
				// resultData.secretKey = 'secretKey';
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
			//对应的操作：1. 弹结果框, 关输入框 2. 弹错误信息，保留输入框 3.弹错误信息，关闭输入框
			//所有抽奖结果文档见: http://p.act.dev.17173.com/docs/document/V1/LotteryController
			var resultType;

			switch(data.result){
				case 'info.lottery.failed': //未中奖
					data.prizeId = 0;
					data.failed = true;
					resultType = 1;
					break;
				case 'info.prize.sendEnd': //中奖了但是奖品发完了。按未中奖处理
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
			if(resultType == 1){
				this.join();
			}
			
		},

		join: function(){
			$.getJSON(this.urls.join); //发送参与标识
		}
	});

	module.exports = Core;
});