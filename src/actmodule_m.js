define(function(require, exports, module) {
	/**
	* 通用活动组件移动端 TODO:合并PC和移动端
	* @module ActModule
	*/

	var $ = window.$ = require('$'),
		Core = require('./core'),
		Utils = require('./utils');

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
				'click #zq_actcompt_in_progress': function(e){
					if($(e.currentTarget).hasClass('disabled')){
						return;
					}
					this.startFromHere();
				},
				'click #submit_vote': function(e){
					this.submitVote(e.currentTarget);
				},
				'click .zq-actcompt-pop-close': function(e){
					$(e.currentTarget).parents('.zq-actcompt-pop').remove();
				},
				'click #za_actcompt_captcha': function(e){
					this.imageCaptchaRefresh();
				},
				'click .zq-actcompt-votelist-item': function(e){
					this.handleVoteOptions(e.currentTarget);
				},
				'click #submit_image_captcha': function(e){
					this.submitImageCaptcha();
				},
				'click #submit_comment': function(e){
					if($(e.currentTarget).hasClass('disabled')){
						return;
					}
					this.submitComment();
				},
				'click .zq-actcompt-pop-btn-send': function(e){
					if($(e.currentTarget).parent().hasClass('sms-send-success')){
						return;
					}
					this.validateMobile();
				},
				'click #submit_sms': function(e){
					this.submitSms();
				},
				'click #cancel_submit_info': function(e){
					$(e.currentTarget).parents('.zq-actcompt-pop').find('.zq-actcompt-pop-close').trigger('click');
				},
				'click #submit_info': function(e){
					this.submitInfo();
				},
				'keyup .zq-actcompt-form-input': function(e){
					$(e.currentTarget).parent().next('.zq-actcompt-form-error').hide().find('span').text('');
				},
				'click #btn_fill_info': function(){
					this.element.find('#result_pop, .zq-actcompt-pop-mask').remove();
					this.showInfoPop();
				}
			}
		},
		setup: function(){
			ActModule.superclass.setup.apply(this);
			$('<link rel="stylesheet" href="http://ue.17173cdn.com/a/module/zq/2015/act-lottery/m/css/style.css">').appendTo("head");
			$.getScript('http://passport.17173.com/themes/default/static/js/topbar/topbar.js', function(){
				window.wap.init();
			});
			$(this.element).html('');
		},

	    /**
	     * @method getTemplates 引入样式表及获取3个样式的模板
	     *
	     */
		getTemplates: function(){
			this.template1 = require('./template/m/style1_m.handlebars');
			this.template2 = require('./template/m/style2_m.handlebars');
			this.template3 = require('./template/m/style3_m.handlebars');
		},

		/**
		 * @method checkStatus 判断活动状态
		 * @return {object} 返回的对象会加到接口的活动数据里，填充到handlebars模板里
		 * @private
		 */
		checkStatus: function(beginTime, endTime){
			var beginTimeUnix = Utils.datetimeToUnix(beginTime),
				endTimeUnix = Utils.datetimeToUnix(endTime),
				nowUnix = ~~($.now() / 1000),
				winnerUrl = this.option('winnerUrl') ? this.option('winnerUrl') : false;
			if(nowUnix < beginTimeUnix){
				return {
					timeLeft: beginTimeUnix - nowUnix,
					notYetStart: true
				};
			}
			if(nowUnix > endTimeUnix){
				return {
					ended: true,
					winnerUrl: winnerUrl
				};
			}
			return {
				inProgress: true,
				timeLeft: 0,
				winnerUrl: winnerUrl
			};
		},

		/**
		 * @method render 渲染组件。 活动开始结束时间说明：1.人工抽奖的情况下，读取活动信息接口里的beginTime/endTime; 2.即时抽奖读取抽奖信息接口里的 startTime/endTime
		 * @param  {object}   actInfo 活动数据
		 */		
		render: function(actInfo){
			var self = this,
				startTime = this.option('collectInfo') ? actInfo.beginTime : actInfo.lotteryBeginTime,
				endTime = this.option('collectInfo') ? actInfo.endTime : actInfo.lotteryEndTime;;
			actInfo.status = self.checkStatus(startTime, endTime);

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
			}

			//活动进行中 
			if(actInfo.status.inProgress){
				self.initAct();
			}
			//活动未开始
			else if(actInfo.status.notYetStart){
				self.element.find('.many').text(Utils.formatSeconds(actInfo.status.timeLeft));

				var timeInterval = setInterval(function(){
					var timeLeft = self.checkStatus(startTime, endTime).timeLeft;
					self.element.find('.many').text(Utils.formatSeconds(timeLeft));
					if(timeLeft <= 0){
						clearInterval(timeInterval);
						switch(self.option('style')){
							case 1:
								self.element.find('#zq_actcompt_not_yet_start').replaceWith('<a href="javascript:;" class="zq-actcompt-btn-get" id="zq_actcompt_in_progress"><span class="text">立即<br />领取</span><span class="many">已有0人参与</span></a>');
								self.element.find('.zq-actcompt1-begin').attr('class', 'zq-actcompt1 zq-actcompt');
								break;
							case 2:
								self.element.find('#zq_actcompt_not_yet_start').replaceWith('<a href="javascript:;" class="zq-actcompt-btn" id="zq_actcompt_in_progress"><span class="many"><i class="zq-actcompt-ico-per1"></i>已有0人参与</span><span class="sep"></span>立即领取</a>');
								break;
							case 3:
								var winnerHtml = self.option('winnerUrl') ? '<a href="' + self.option('winnerUrl') + '"  title="查看中奖名单" class="zq-actcompt-btn-winners">查看中奖名单&gt;&gt;</a>' : '';
								$('#zq_actcompt_not_yet_start').replaceWith('<a href="javascript:;"  title="" class="zq-actcompt-btn-cj" id="zq_actcompt_in_progress">我要抽奖<i class="zq-actcompt-ico-play"></i></a>');
								$('.zq-actcompt-num').html('<i class="zq-actcompt-ico-per2"></i>已有 <span class="zq-actcompt-or">0 </span>人参与' + winnerHtml);
								break;
						}
					}
					
				}, 1000);
			}
		},

		/**
		 * @method showVotePop 显示投票弹窗
		 */			
		showVotePop: function(){
			if($('#vote_pop').length < 1){
				this.renderVote();
			}
			$('#vote_pop').show();
		},

		/**
		 * @method renderVote 加载投票模板
		 * @param  {object}   data 投票数据
		 */
		renderVote: function(){
			var voteTemplate = require('./template/m/vote_m.handlebars');
			$(voteTemplate(this.voteJSON)).appendTo(this.element);
		},

		/**
		 * @method handleVoteOptions 处理点击投票选项
		 * @param  {object}   option 当前点击的投票元素
		 */				
		handleVoteOptions: function(option){
			//如果是单选
			if($(option).parents('.zq-actcompt-pop-bd').data('votetype') == 0){
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
			var $vote = $(submit).parents('.zq-actcompt-pop-bd');
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
			$('#vote_pop').remove();
			this.needLoggedIn ? this.checkLogin() : this.checkValidate();
		},

		/**
		 * @method showCommentPop 显示评论弹窗
		 */	
		showCommentPop: function(){
			var self = this,
				template = require('./template/m/comment_m.handlebars'),
				data = {commentTip: self.option('commentTip')};
			$('#comment_pop').length ? $('#comment_pop').show() : $(template(data)).appendTo(this.element);
		},

		/**
		 * @method submitComment 提交评论
		 */		
		submitComment: function(){
			var val = $.trim($('#comment_text').val()),
				sid = $('#SOHUCS').attr('sid');
			if(!sid){
				return;
			}
			if(val === ''){
				alert('请输入评论内容');
				return;
			}
			$('#submit_comment').addClass('disabled').text('提交中...');
			this.doComment(val, sid);
		},

		/**
		 * @method commentSuccess 评论成功的回调函数, 删除评论弹窗并检查登录状态
		 */	
		commentSuccess: function(){
			$('#comment_pop').remove();
			if(this.option('collectInfo')){
				this.showInfoPop();
			} else{
				this.needLoggedIn ? this.checkLogin() : this.checkValidate();
			}
		},


		/**
		 * @method checkLogin 检查是否登录
		 */	
		checkLogin: function(){
			var self = this;
			if(!wap){
				return;
			}

			if(wap.isLogin()){
				this.checkValidate();
			} else{
				wap.on('loginSuccess', function(){
					self.checkValidate();
				});
				wap.show();
			}
		},

		/**
		 * @method showSmsPop 显示短信验证码弹窗
		 */
		showSmsPop: function(){
			var	template = require('./template/m/sms_m.handlebars');
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
			$('#sms_pop .zq-actcompt-form-item-ex1').addClass('sms-send-success');

			var timeleft = +$('#sms_time_left').text();
			var resendInterval = setInterval(function(){
				$('#sms_time_left').text(--timeleft);
				if(timeleft <= 0){
					clearInterval(resendInterval);
					$('#sms_pop .zq-actcompt-form-item-ex1').removeClass('sms-send-success');
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
			var template = require('./template/m/info_m.handlebars');
			$(template(this.fieldSet)).appendTo(this.element);
			this.element.find('[name=comment]').val(this.commentContent || '/');
		},

		/**
		 * @method submitInfoSuccess 个人信息提交成功的回调
		 */			
		submitInfoSuccess: function(){
			$('#info_pop').remove();
			if(this.option('collectInfo')){
				alert('您的信息已经成功提交。' + this.option('collectInfoTip'));
			} else{
				
			}
			// this.doLottery();
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

			$('.zq-actcompt-form-input').each(function(){
				var val = $.trim($(this).val()),
					name = $(this).attr('name'),
					cName = $(this).prev('.zq-actcompt-form-tit').text(),
					$error = $(this).parent().next('.zq-actcompt-form-error');
				if(val === ''){
					$error.show().find('span').text('请填写您的' + cName);
					pass = false;
				} else if(name === 'email' && !reMail.test(val)){
					$error.show().find('span').text('请输入正确的' + cName);
					pass = false;				
				} else if(name === 'phone' && !reMobile.test(val)){
					$error.show().find('span').text('请输入正确的' + cName);
					pass = false;
				} else if(name === 'qq' && !reQQ.test(val)){
					$error.show().find('span').text('请输入正确的' + cName);
					pass = false;
				} else{
					$error.hide().text('');
					formData[name] = val;
				}
			});
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
				template = require('./template/m/imageCaptcha_m.handlebars');
			$(template(data)).appendTo(this.element);
		},

		/**
		 * @method imageCaptchaRefresh 刷新图片验证码
		 */			
		imageCaptchaRefresh: function(){
			$('#za_actcompt_captcha').attr('src', '').attr('src', this.host + '/lottery/' + this.option('lotteryId') + '/captchaCode?' + new Date().getTime());
		},

		/**
		 * @method submitImageCaptcha 提交图片验证码
		 */				
		submitImageCaptcha: function(){
			var self = this,
				captcha = $.trim($('#captcha_input').val());
			if(captcha.length < 4){
				console.log(captcha)
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
			}

			var template = require('./template/m/result_m.handlebars');
			$('.zq-actcompt-pop').remove();

			if(this.option('style') === 3 && resultType === 1){
				$('#zq_actcompt_in_progress').addClass('disabled');
				this.animateIt(data.prizeId, data, template, '.zq-actcompt-item');
			} else{
	        	$(template(data)).appendTo(this.element);
			}
		},

		animateEnd: function(data, template){
        	$(template(data)).appendTo(this.element);
        	$('#zq_actcompt_in_progress').removeClass('disabled');
		}

	});

	module.exports = ActModule;
});