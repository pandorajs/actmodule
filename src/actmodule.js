define(function(require, exports, module) {
	/**
	* 通用活动组件PC端
	* @module ActModule
	*/

	var $ = window.$ = require('$'),
		Core = require('./core'),
		Utils = require('./utils'),
		importStyle = require('./css/layout.css'),
		ZeroClipboard = require('./jquery.zclip');

	/**
	* 表现层类
	*
	* @class ActModule
	* @constructor
	*
	* @example
	* ```
    * new ActModule({
    *     element: '#act',
    *     actId: 4959, //活动ID
    *     lotteryId: 62, //抽奖ID
    *     style: 1, //样式
    *     voteId: 10132, //投票ID
    *     needComment: true, //是否需要评论
    *     commentTip: '这里你要评论下', //评论导语
    *     fieldSetId: 39, //收集信息的表单ID
    *     needInfo: true //是否需要填写个人信息
    * });
	* ```
	*/
	var ActModule = Core.extend({
	    /**
	     * 默认参数
	     *
	     * @property {object} defaults 默认参数
	     * @type {object}
	     */

		defaults: {
			delegates: {
				'click .lottery-btn-in': function(e){
					if($(e.currentTarget).hasClass('disabled')){
						return;
					}
					this.startFromHere();
				},
				'click #submit_vote': function(e){
					this.submitVote(e.currentTarget);
				},
				'click .lottery-pop-close': function(e){
					$('.lottery-pop, .lottery-mask').hide();
				},
				'click .captcha': function(e){
					this.imageCaptchaRefresh();
				},
				'click .lottery-votelist-item': function(e){
					this.handleVoteOptions(e.currentTarget);
				},
				'click #submit_image_captcha': function(e){
					this.submitImageCaptcha();
				},
				'click #submit_comment': function(e){
					this.submitComment();
				},
				'click #send_sms': function(e){
					if($(e.currentTarget).hasClass('lottery-btn-sendcode-disabled')){
						return;
					}
					this.validateMobile();
				},
				'click #submit_sms': function(e){
					this.submitSms();
				},
				'keyup .lottery-form-input input': function(e){
					$(e.currentTarget).next('div').text('').hide();
				},
				'click #cancel_submit_info': function(e){
					$(e.currentTarget).parents('.lottery-pop').find('.lottery-pop-close').trigger('click');
				},
				'click #submit_info': function(e){
					this.submitInfo();
				}
			}
		},


	    /**
	     * @method getTemplates 获取4个样式的模板
	     *
	     */
		getTemplates: function(){
			importStyle();
			this.template1 = require('./style1.handlebars');
			this.template2 = require('./style2.handlebars');
			this.template3 = require('./style3.handlebars');
			this.template4 = require('./style4.handlebars');
		},

		/**
		 * @method checkStatus 判断活动状态
		 * @return {object} 返回的对象会加到接口的活动数据里，填充到handlebars模板里
		 * @private
		 */
		checkStatus: function(beginTime, endTime){
			var beginTimeUnix = Utils.datetimeToUnix(beginTime),
				endTimeUnix = Utils.datetimeToUnix(endTime),
				nowUnix = ~~(new Date().getTime() / 1000);
			if(nowUnix < beginTimeUnix){
				return {
					text: '即将开始',
					className: 'lottery-btn-begin',
					html: '<span class="lottery-or"></span>',
					timeLeft: beginTimeUnix - nowUnix,
					notYetStart: true
				};
			}
			if(nowUnix > endTimeUnix){
				return {
					text: '活动结束',
					className: 'lottery-btn-end',
					html: '已有<span class="lottery-or lottery-fb">0</span>人参与',
					ended: true
				};
			}
			return {
				text: '立即领取',
				className: 'lottery-btn-in',
				html: '已有<span class="lottery-or lottery-fb">0</span>人参与',
				inProgress: true
			};
		},

		/**
		 * @method render 渲染组件
		 * @param  {object}   actInfo 活动数据
		 */		
		render: function(actInfo){
			var self = this;
			actInfo.status = self.checkStatus(actInfo.beginTime, actInfo.endTime);

			switch(self.option('style')){
				case 1:
					$(self.template1(actInfo)).appendTo(self.element);
					break;
				case 2:
					$(self.template2(actInfo)).appendTo(self.element);
					break;
				case 3:
					$(self.template3(actInfo)).appendTo(self.element);
					break;
				case 4:
					$(self.template4(actInfo)).appendTo(self.element);
					break;
			}

			//活动进行中 
			if(actInfo.status.inProgress){
				self.element.find('.lottery-or').text(actInfo.joins);
				//如果需要投票, 取回投票数据
				if(self.option('voteId')){
					self.getVoteInfo();
				} 
				//如果需要填写个人信息，取回个人信息表单项
				if(self.option('needInfo')){
					$.getJSON(self.url.fieldsetUrl, function(data){
						self.fieldSet = data[0].formField;
					})
				}
			} 
			//活动结束
			else if(actInfo.status.ended){
				self.element.find('.lottery-or').text(actInfo.joins);
			} 
			//活动未开始
			else{
				self.element.find('.lottery-or').text(Utils.formatSeconds(actInfo.status.timeLeft));
				var timeInterval = setInterval(function(){
					var timeLeft = self.checkStatus(actInfo.beginTime, actInfo.endTime).timeLeft;
					if(timeLeft <= 0){
						clearInterval(timeInterval);
						self.element.find('.lottery-btn-begin').removeClass('lottery-btn-begin').addClass('lottery-btn-in').text('立即领取');
						self.element.find('.lottery-state-tt').html('已有<span class="lottery-or lottery-fb">0</span>人参与');
					}
					self.element.find('.lottery-or').text(Utils.formatSeconds(timeLeft));
				}, 1000);
			}
		},

		/**
		 * @method showVotePop 显示投票弹窗
		 */			
		showVotePop: function(){
			$('#vote_pop, .lottery-mask').show();
		},

		/**
		 * @method renderVote 加载投票模板
		 * @param  {object}   data 投票数据
		 */			
		renderVote: function(data){
			var voteTemplate = require('./vote.handlebars');
			$(voteTemplate(data)).appendTo(this.element);
		},

		/**
		 * @method handleVoteOptions 处理点击投票选项
		 * @param  {object}   option 当前点击的投票元素
		 */				
		handleVoteOptions: function(option){
			//如果是单选
			if($(option).parents('.lottery-vote').data('votetype') == 0){
				if(!$(option).hasClass('on')){
					$(option).addClass('on').siblings().removeClass('on');
				}
			} 
			//如果是多选
			else{
				$(option).hasClass('on') ? $(option).removeClass('on') : $(option).addClass('on');
			}
		},

		/**
		 * @method submitVote 提交投票
		 * @param  {object}   submit 投票按钮元素
		 */			
		submitVote: function(submit){
			var self = this;
			var $vote = $(submit).parents('.lottery-vote');
			if($vote.find('.on').length < 1){
				alert('请选择一个选项');
			} else{
				var voteid = $vote.data('voteid'),
					voteitem = [];
				$vote.find('.on').each(function(){
					voteitem.push($(this).data('itemid'));
				});
				var data = {
					voteitem: voteitem.join(),
					voteid: voteid
				};
				self.doVote(data);
			}
		},

		/**
		 * @method voteSuccess 投票成功的回调函数，提交后隐藏投票弹窗，然后检查是否登录
		 */				
		voteSuccess: function(){
			$('#vote_pop, .lottery-mask').hide();
			this.checkLogin(); 
		},

		/**
		 * @method showCommentPop 显示评论弹窗
		 */	
		showCommentPop: function(){
			var self = this,
				template = require('./comment.handlebars'),
				data = {commentTip: self.option('commentTip')};
			$('#comment_pop').length ? $('#comment_pop, .lottery-mask').show() : $(template(data)).appendTo(this.element);
		},

		/**
		 * @method submitComment 提交评论
		 */		
		submitComment: function(){
			var val = $.trim($('#comment_text').val()),
				sid = $('#SOHUCS').attr('sid');
			if(val === '' || !sid){
				return;
			}
			this.doComment(val, sid);
		},

		/**
		 * @method commentSuccess 评论成功的回调函数, 隐藏评论弹窗并检查登录状态
		 */	
		commentSuccess: function(){
			$('#comment_pop, .lottery-mask').remove();
			this.checkLogin();
		},

		/**
		 * @method checkLogin 检查是否登录
		 */	
		checkLogin: function(){
			if(this.isLoggedIn()){
				this.checkValidate();
			} else if(typeof Passport !== 'undefined'){
				Passport.Dialog.show();
			} else{
				alert('请先登录');
			}
		},

		/**
		 * @method showSmsPop 显示短信验证码弹窗
		 */
		showSmsPop: function(){
			var	template = require('./sms.handlebars');
			$(template()).appendTo(this.element);
		},

		/**
		 * @method validateMobile 验证手机号码格式
		 */	
		validateMobile: function(){
			var reMobile = /^1\d{10}$/,
				mobile = $('#mobile_input').val();
			if(!reMobile.test(mobile)){
				alert('请输入正确的手机号码');
				return;
			}
			this.sendSms(mobile);
		},

		/**
		 * @method smsSendSuccess 短信下发成功的回调函数
		 */		
		smsSendSuccess: function(){
			$('#send_sms').addClass('lottery-btn-sendcode-disabled');
			var timeleft = +$('#sms_time_left').text();
			var resendInterval = setInterval(function(){
				$('#sms_time_left').text(--timeleft);
				if(timeleft <= 0){
					clearInterval(resendInterval);
					$('#send_sms').removeClass('lottery-btn-sendcode-disabled');
					$('#sms_time_left').text('120');
				}
			}, 1000);
		},

		/**
		 * @method submitSms 提交短信验证码
		 */	
		submitSms: function(){
			var sms = $('#sms_input').val();
			if(!this.smsSended){
				alert('请先获取短信验证码');
				return;
			}
			if(sms.length !== 4){
				alert('请输入4位验证码');
				return;
			}
			this.doLottery({captcha: sms});
		},

		/**
		 * @method showInfoPop 显示个人信息弹窗
		 */		
		showInfoPop: function(){
			var template = require('./info.handlebars');
			$(template(this.fieldSet)).appendTo(this.element);
		},

		/**
		 * @method submitInfoSuccess 个人信息提交成功的回调
		 */			
		submitInfoSuccess: function(){
			$('#info_pop, .lottery-mask').remove();
			this.doLottery();
		},

		/**
		 * @method validateInfoForm 验证个人信息表单
		 * @return {object} formData验证通过返回表单数据 {boolean} 验证失败返回false
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
		 * @method showImageCaptcha 显示图片验证码弹窗
		 */		
		showImageCaptcha: function(){
			var data = {
					captcha: this.host + '/lottery/' + this.option('lotteryId') + '/captchaCode'
				},
				template = require('./imageCaptcha.handlebars');
			$(template(data)).appendTo(this.element);
		},

		/**
		 * @method imageCaptchaRefresh 刷新图片验证码
		 */			
		imageCaptchaRefresh: function(){
			$('.captcha').attr('src', '').attr('src', this.host + '/lottery/' + this.option('lotteryId') + '/captchaCode');
		},

		/**
		 * @method submitImageCaptcha 提交图片验证码
		 */				
		submitImageCaptcha: function(){
			var self = this,
				captcha = $.trim($('#captcha_input').val());
			if(captcha.length < 4){
				alert('请输入正确的验证码');
				return;
			}
			this.doLottery({captcha: captcha});
		},

		/**
		 * @method done 处理中奖结果
		 * @param  {object}   data 投票按钮元素
		 * @param  {Number}   resultType 中奖结果类型
		 */	
		done: function(data, resultType){
			if(resultType === 2){
				alert(data.msg);
				return;
			} else{
				$('.lottery-btn-in').addClass('disabled');
			}

			var template = require('./result.handlebars');
			$('.lottery-pop, .lottery-mask').remove();

			if(this.option('style') === 3){
				this.animateIt(data.prizeId, data, template);
			} else{
	        	$(template(data)).appendTo(this.element);
	        	this.copy();
			}

		},

		/**
		 * @method copy 复制按钮功能
		 */	
		copy: function(){
			$('#btn_copy_code').zclip({
				path: '../src/ZeroClipboard.swf',
				copy: 'xxx',
				beforeCopy: function(){
					alert(353)
				},
				afterCopy: function(){
					alert('复制完成.');
				}
			})
		}

	});

	module.exports = ActModule;
});