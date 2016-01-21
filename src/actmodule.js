define(function(require, exports, module) {
	/**
	* 通用活动组件 
	* @module ActModule
	*/

	var $ = window.$ = window.jQuery = require('$'),
		Core = require('./core'),
		Utils = require('./utils'),
		ZeroClipboard = window.ZeroClipboard = require('./jquery.zclip');

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
					if($(e.currentTarget).hasClass('disabled')){
						return;
					}
					this.submitVote(e.currentTarget);
				},
				'click .zq-actcompt-pop-close': function(e){
					this.closePopup(e);
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
				'click #send_sms': function(e){
					if($(e.currentTarget).hasClass('lottery-btn-sendcode-disabled')){
						return;
					}
					this.validateMobile();
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
				'keyup .zq-actcompt-form-input input': function(e){
					this.inputKeyupHandler(e);
				},
				'click #cancel_submit_info': function(e){
					$(e.currentTarget).parents('.zq-actcompt-pop').find('.zq-actcompt-pop-close').trigger('click');
				},
				'click #submit_info': function(e){
					this.submitInfo();
				},
				'click #btn_fill_info': function(){
					this.element.find('#result_pop, .zq-actcompt-pop-mask').remove();
					this.showInfoPop();
				},
				'submit #image_captcha_form': function(e){
					e.preventDefault();
				}
			}
		},
		setup: function(){
			ActModule.superclass.setup.apply(this);

			if(this.mobile){
				$('<link rel="stylesheet" href="http://ue.17173cdn.com/a/module/zq/2015/act-lottery/m/css/style.css">').appendTo("head");
				$.getScript('http://passport.17173.com/themes/default/static/js/topbar/topbar.js', function(){
					window.wap.init();
				});
			} else{
				typeof Passport === 'undefined' && $.getScript('http://ue.17173cdn.com/a/www/index/2015/js/passport.js');
				$('<link rel="stylesheet" href="http://ue.17173cdn.com/a/module/zq/2015/act-lottery/css/layout.css">').appendTo("head");
			}
			$(this.element).html('');
		},


	    /**
	     * @method getTemplates 引入模板
	     *
	     */
		getTemplates: function(){
			this.templates = {
				pc: {
					template1: require('./template/pc/style1.handlebars'),
					template2: require('./template/pc/style2.handlebars'),
					template3: require('./template/pc/style3.handlebars'),
					template4: require('./template/pc/style4.handlebars'),
					comment: require('./template/pc/comment.handlebars'),
					imageCaptcha: require('./template/pc/imageCaptcha.handlebars'),
					info: require('./template/pc/info.handlebars'),
					result: require('./template/pc/result.handlebars'),
					SMS: require('./template/pc/sms.handlebars'),
					vote: require('./template/pc/vote.handlebars')
				},
				mobile: {
					template1: require('./template/m/style1.handlebars'),
					template2: require('./template/m/style2.handlebars'),
					template3: require('./template/m/style3.handlebars'),
					comment: require('./template/m/comment.handlebars'),
					imageCaptcha: require('./template/m/imageCaptcha.handlebars'),
					info: require('./template/m/info.handlebars'),
					result: require('./template/m/result.handlebars'),
					SMS: require('./template/m/sms.handlebars'),
					vote: require('./template/m/vote.handlebars')
				}
			}
		},

		/**
		 * @method closePopup 关闭弹出框
		 * @param  {object}   e 事件对象
		 */
		closePopup: function(e){
			if(this.mobile){
				$(e.currentTarget).parents('.zq-actcompt-pop').remove();
			} else{
				var $popup = $(e.currentTarget).parent(),
					$mask = $popup.next('.zq-actcompt-pop-mask');
				$popup.remove();
				$mask.remove();				
			}
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
				endTime = this.option('collectInfo') ? actInfo.endTime : actInfo.lotteryEndTime;

			this.endTime = Utils.datetimeToUnix(endTime);
			actInfo.status = self.checkStatus(startTime, endTime);

			if(this.option('style') == 4 && this.mobile){
				console.error('样式4不支持移动端。');
				return;
			}

			switch(+self.option('style')){
				case 1:
					$(self.templates[self.platform].template1(actInfo)).appendTo(self.element);
					break;
				case 2:
					$(self.templates[self.platform].template2(actInfo)).appendTo(self.element);
					break;
				case 3:
					$(self.templates[self.platform].template3(actInfo)).appendTo(self.element);
					break;
				case 4:
					$(self.templates[self.platform].template4(actInfo)).appendTo(self.element);
					break;
			}

			if(!actInfo.status.ended){
				self.initAct();
			}

			//活动未开始
			if(actInfo.status.notYetStart){

				var timeElement = this.mobile ? '.many' : '.zq-actcompt-or';
				self.element.find(timeElement).text(Utils.formatSeconds(actInfo.status.timeLeft));

				var timeInterval = setInterval(function(){
					var timeLeft = self.checkStatus(startTime, endTime).timeLeft;
					self.element.find(timeElement).text(Utils.formatSeconds(timeLeft));

					if(timeLeft <= 0){
						clearInterval(timeInterval);
						if(self.mobile){
							switch(+self.option('style')){
								case 1:
									self.element.find('#zq_actcompt_not_yet_start').replaceWith('<a href="javascript:;" class="zq-actcompt-btn-get" id="zq_actcompt_in_progress"><span class="text">立即<br />领取</span><span class="many">已有' + self.actInfo.joins + '人参与</span></a>');
									self.element.find('.zq-actcompt1-begin').attr('class', 'zq-actcompt1 zq-actcompt');
									break;
								case 2:
									self.element.find('#zq_actcompt_not_yet_start').replaceWith('<a href="javascript:;" class="zq-actcompt-btn" id="zq_actcompt_in_progress"><span class="many"><i class="zq-actcompt-ico-per1"></i>已有' + self.actInfo.joins + '人参与</span><span class="sep"></span>立即领取</a>');
									break;
								case 3:
									var winnerHtml = self.option('winnerUrl') ? '<a href="' + self.option('winnerUrl') + '"  title="查看中奖名单" class="zq-actcompt-btn-winners">查看中奖名单&gt;&gt;</a>' : '';
									$('#zq_actcompt_not_yet_start').replaceWith('<a href="javascript:;"  title="" class="zq-actcompt-btn-cj" id="zq_actcompt_in_progress">我要抽奖<i class="zq-actcompt-ico-play"></i></a>');
									$('.zq-actcompt-num').html('<i class="zq-actcompt-ico-per2"></i>已有 <span class="zq-actcompt-or">' + self.actInfo.joins + '</span>人参与' + winnerHtml);
									break;
							}
						} else{
							switch(+self.option('style')){
								case 1:
									$('.zq-actcompt-state-tt').html('已有<span class="zq-actcompt-or zq-actcompt-fb">' + self.actInfo.joins + '</span>人参与');
									self.element.find('#zq_actcompt_not_yet_start').attr('id', 'zq_actcompt_in_progress').text('立即领取').removeClass('zq-actcompt-btn-begin').addClass('zq-actcompt-btn-in');
									break;
								case 2:
									$('.zq-actcompt-state-tt').html('已有<span class="zq-actcompt-or zq-actcompt-fb">' + self.actInfo.joins + '</span>人参与');
									self.element.find('#zq_actcompt_not_yet_start').attr('id', 'zq_actcompt_in_progress').text('立即领取').removeClass('zq-actcompt-btn-begin').addClass('zq-actcompt-btn-in');
									break;
								case 3:
									var winnerHtml = self.option('winnerUrl') ? '<a href="' + self.option('winnerUrl') + '" target="_blank" title="查看中奖名单" class="zq-actcompt-fr zq-actcompt-btn-winners ">查看中奖名单&gt;&gt;</a>' : '';
									$('.zq-actcompt-or').replaceWith('<div class="zq-actcompt-oz"><span class="zq-actcompt-fl">已有<span class="zq-actcompt-or zq-actcompt-fb">' + self.actInfo.joins + '</span>人参与</span>' + winnerHtml + '</div>');
									self.element.find('#zq_actcompt_not_yet_start').replaceWith('<a href="#lottery" title="我要抽奖" class="zq-actcompt-btn-cj" id="zq_actcompt_in_progress">我要抽奖<i class="zq-actcompt-ico zq-actcompt-ico-play"></i></a>');
									break;
								case 4:
									$('.zq-actcompt-p').html('已有<span class="zq-actcompt-or zq-actcompt-fb">' + self.actInfo.joins + '</span>人参与');
									self.element.find('#zq_actcompt_not_yet_start').attr('id', 'zq_actcompt_in_progress').text('立即领取');
									break;
							}
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
			$('#vote_pop, .zq-actcompt-pop-mask').show();
		},

		/**
		 * @method renderVote 加载投票模板
		 * @param  {object}   data 投票数据
		 */			
		renderVote: function(){
			$(this.templates[this.platform].vote(this.voteJSON)).appendTo(this.element);
		},

		/**
		 * @method handleVoteOptions 处理点击投票选项
		 * @param  {object}   option 当前点击的投票元素
		 */				
		handleVoteOptions: function(option){
			//如果是单选
			if($(option).parents('[data-voteid]').data('votetype') == 0){ 
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
			var $vote = $(submit).parents('[data-voteid]'); 
			if($vote.find('.on').length < 1){
				alert('请选择一个选项');
				return;
			}
			$(submit).addClass('disabled').text('提交中...');
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
		},

		/**
		 * @method voteSuccess 投票成功的回调函数，提交后隐藏投票弹窗，然后检查是否登录
		 */
		voteSuccess: function(){
			$('#vote_pop, .zq-actcompt-pop-mask').remove();
			if(this.option('collectInfo')){
				this.showInfoPop();
			} else{
				this.needLoggedIn ? this.checkLogin() : this.checkInfo();
			}
		},

		/**
		 * @method showCommentPop 显示评论弹窗
		 */	
		showCommentPop: function(){
			var self = this,
				data = {commentTip: self.option('commentTip')};
			$('#comment_pop').length ? $('#comment_pop, .zq-actcompt-pop-mask').show() : $(self.templates[self.platform].comment(data)).appendTo(this.element);
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
			$('#comment_pop, .zq-actcompt-pop-mask').remove();
			if(this.option('collectInfo')){
				this.showInfoPop();
			} else{
				this.needLoggedIn ? this.checkLogin() : this.checkInfo();
			}
		},

		/**
		 * @method checkLogin 检查是否登录
		 */	
		checkLogin: function(){
			var self = this;
			if(this.mobile){
				if(!wap){
					return;
				}
				if(wap.isLogin()){
					this.checkInfo();
				} else{
					wap.on('loginSuccess', function(){
						self.checkInfo();
					});
					wap.show();
				}
			} else{
				if(this.isLoggedIn()){
					this.checkInfo();
				} else{
					var loginSuccessHandler = function(){
						self.checkInfo();
					}
					Passport.on('loginSuccess', loginSuccessHandler);
					Passport.off(loginSuccessHandler);
					Passport.Dialog.show();
				}
			}
		},

		/**
		 * @method showSmsPop 显示短信验证码弹窗
		 */
		showSmsPop: function(){
			$(this.templates[this.platform].SMS()).appendTo(this.element);
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
			var el = this.mobile ? '#sms_pop .zq-actcompt-form-item-ex1' : '#send_sms';
			this.mobile ? $(el).addClass('sms-send-success') : $(el).addClass('lottery-btn-sendcode-disabled')

			var timeleft = 120;
			var resendInterval = setInterval(function(){
				$('#sms_time_left').text(--timeleft);
				if(timeleft <= 0){
					clearInterval(resendInterval);
					$(el).removeClass('lottery-btn-sendcode-disabled sms-send-success');
					$('#sms_time_left').text('120');
				}
			}, 1000);
			$('#sms_pop .zq-actcompt-pop-close').click(function(){
				clearInterval(resendInterval);
			})
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
			$(this.templates[this.platform].info(this.fieldSet)).appendTo(this.element);
			this.element.find('[name=comment]').val(this.commentContent || '/');
		},

		/**
		 * @method submitInfoSuccess 个人信息提交成功的回调. 有三种情况：1 人工抽奖 2 在抽奖流程里，提交后进入填验证码步骤 3 配置了不需要收集信息，但是抽奖结果为实物时
		 */
		submitInfoSuccess: function(){ 
			$('#info_pop, .zq-actcompt-pop-mask').remove();
			if(this.option('collectInfo')){
				alert('您的信息已经成功提交。' + this.option('collectInfoTip'));
			} else if(this.option('needInfo')){
				this.checkValidate();
			} else{
				alert('您的信息已经成功提交。');
			}
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
				reQQ = /^[1-9]\d{4,11}$/,
				$input = this.mobile ? $('.zq-actcompt-form-input') : $('.zq-actcompt-form-input input');
				

			$input.each(function(){
				var val = $.trim($(this).val()),
					name = $(this).attr('name'),
					cName = $(this).parents('.zq-actcompt-form-item').find('[data-name]').text(),
					$error = this.mobile ? $(this).parent().next('.zq-actcompt-form-error') : $(this).parents('.zq-actcompt-form-item').next('.zq-actcompt-form-error'),
					$errorText = this.mobile ? $error : $error.find('span');
				if(val === ''){
					$error.show();
					$errorText.text('请填写您的' + cName);
					pass = false;
				} else if(name === 'email' && !reMail.test(val)){
					$error.show();
					$errorText.text('请输入正确的' + cName);
					pass = false;				
				} else if(name === 'phone' && !reMobile.test(val)){
					$error.show();
					$errorText.text('请输入正确的' + cName);
					pass = false;
				} else if(name === 'qq' && !reQQ.test(val)){
					$error.show();
					$errorText.text('请输入正确的' + cName)
					pass = false;
				} else{
					$error.hide();
					$errorText.text('');
					formData[name] = val;
				}
			});
			if(pass){
				return formData;
			} else{
				return false;
			}
		},

		inputKeyupHandler: function(e){
			if(this.mobile){
				$(e.currentTarget).parent().next('.zq-actcompt-form-error').hide().find('span').text('');
			} else{
				$(e.currentTarget).parents('.zq-actcompt-form-item').next('.zq-actcompt-form-error').hide().text('');
			}
		},

		/**
		 * @method showImageCaptcha 显示图片验证码弹窗
		 */		
		showImageCaptcha: function(){
			var data = {
					captcha: this.host + '/lottery/' + this.option('lotteryId') + '/captchaCode?' + new Date().getTime()
				};
			if($('#captcha_pop').length){
				this.imageCaptchaRefresh();
				$('#captcha_pop, .zq-actcompt-pop-mask').show();
			} else{
				$(this.templates[this.platform].imageCaptcha(data)).appendTo(this.element);
			}
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

			var joins = +this.element.find('.zq-actcompt-or').text();
			this.element.find('.zq-actcompt-or').text(joins+1);

			$('.zq-actcompt-pop, .zq-actcompt-pop-mask').remove();

			if(this.option('style') === 3 && resultType === 1){
				$('#zq_actcompt_in_progress').addClass('disabled');
				this.animateIt(data.prizeId, data, '.zq-actcompt-item');
			} else{
				this.animateEnd(data);

	        	// $(template(data)).appendTo(this.element);
	        	// this.copy();
			}
		},

		animateEnd: function(data){
        	$(this.templates[this.platform].result(data)).appendTo(this.element);
        	if(!this.option('needInfo') && !data.code){//实物
        		this.element.find('.zq-actcompt-pop .zq-actcompt-btn-box').show();
        	}
        	!this.mobile && this.copy();
        	$('#zq_actcompt_in_progress').removeClass('disabled');
		},

		/**
		 * @method copy 复制按钮功能
		 */	
		copy: function(){
			if(window.clipboardData){
				$('#btn_copy_code').click(function(){
					window.clipboardData.setData('Text', $('#act_module_code').val());
					alert('已复制到剪贴板: ' + $('#act_module_code').val());
				})
				$('#btn_copy_secretkey').click(function(){
					window.clipboardData.setData('Text', $('#act_module_secretkey').val());
					alert('已复制到剪贴板: ' + $('#act_module_secretkey').val());
				})
			} else{
				$('#btn_copy_code').zclip({
					path: '/src/ZeroClipboard.swf',
					copy: function(){
						return $('#act_module_code').val();
					},
					afterCopy: function(){
						alert('已复制到剪贴板: ' + $('#act_module_code').val());
					}
				});
				$('#btn_copy_secretkey').zclip({
					// path: 'http://ue.17173cdn.com/a/lib/clipboard/ZeroClipboard.swf',
					path: '/src/ZeroClipboard.swf',
					copy: function(){
						return $('#act_module_secretkey').val();
					},
					afterCopy: function(){
						alert('已复制到剪贴板: ' + $('#act_module_secretkey').val());
					}
				});	
			}

		}
	});

	module.exports = ActModule;
});