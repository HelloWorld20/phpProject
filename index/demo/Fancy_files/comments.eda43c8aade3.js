/*
	this file should can using by anywhere.
	plz make sure
	- working for multiple comment form in one page.
	- working for dynamic adding comment form by ajax loading
*/
jQuery(function($){
	var $form = $('form.comment-form'), $clone_form = null;
	    $textarea = $form.find('textarea[name="comment-msg"]'),
	    $btn_box  = $form.find('.btns-post'),
	    $comment_list = $('.comments > ol'),
	    $loader = $comment_list.find('>li.loading'),
	    $view_all_comments = $('#btn-viewall-comments'),
		$toggle_comments = $('#toggle-comments'),
		$comment_list_new = null,
		// timers
		find_timer = null,
		// Templates
		$tpl_comment_item = $('script#tpl-comment').remove(),
		$tpl_blocked_item = $('script#tpl-block').remove(),
		$tpl_suggest_item = $form.find('.comment-autocomplete > script[type="fancy/template"]').remove(),
		// Constants
		USER_ID = $comment_list.attr('user_id'),
		IS_MODERATOR = ($comment_list.attr('is_moderator') == 'true'),
		ACCESS_TOKEN_URL = '/ms_translator_token.json',
		TRANSLATE_URL = location.protocol + '//api.microsofttranslator.com/V2/Ajax.svc/Translate';

	if(!$tpl_suggest_item[0]) $tpl_suggest_item = $("#comment-autocomplete").remove();

	function addComment(args, add_to_top){
		var $item = $tpl_comment_item.template(args),
		    viewer_id = $comment_list.attr('user_id'),
		    is_moderator = $comment_list.attr('is_moderator') == 'true';

		if(!$comment_list_new) {
			var target = $comment_list;
			if($comment_list.parents(".comments").attr("data-timeline")) target = $comment_list.parents(".comments").find("#toggle-comments");

		    $comment_list_new = $comment_list.eq(0).clone().empty().insertAfter(target.eq(0));
		    $('.comments > ol').removeClass('last').eq(-1).addClass('last');
		}

		if(add_to_top) {
			$item.prependTo($comment_list_new);
		} else {
			$item.appendTo($comment_list.eq(-1));
		}

		// remove edit and delete menu if viewer has no permission
		if(viewer_id != args.USER_ID && !is_moderator) $item.find('.c-reply').remove();

		return $item;
	};

	function addCommentNum(num){
		var $all = $('#btn-viewall-comments,#toggle-comments:not(.collapse) > span'), txt;
		if(!$all.length) return;

		txt = $all.eq(0).text().replace(/\d+/, function($0){ return parseInt($0)+num });
		$all.text(txt);

		try{window.catalog.view_all_comments=txt}catch(e){};
	};

	function getCaretPos(element){
		if(element.selectionStart) return element.selectionStart;
		if(document.selection) return (function(r){r.moveStart('character',-ta.value.length);return r.text.length})(document.selection.createRange());
		return -1;
	};

	function setCaretPos(element,pos){
		element.focus();
		if(element.setSelectionRange){
			element.setSelectionRange(pos,pos);
		}else if(element.createTextRange){
			var rng = element.createTextRange();
			rng.moveEnd('character',pos);
			rng.collapse(false);
			rng.select();
		}
	};

	// expand textarea automatically
	$.fn.autoExpand = function(){
		var $ta=this,$clone,timer=null,mh=40;

		function resize(){
			var h = $clone.val($ta.val()+'\n').get(0).scrollHeight;
			$ta.css('height', (h<mh)?'':h);
		};

		function onfocus(event){
			this.scrollTop = 0;
			clearTimeout(timer);
			timer = setTimeout(resize,50);
		};

		if($clone) $clone.remove();
		$clone = $ta.clone().removeAttr('id').removeAttr('name').css({padding:0,margin:0}).addClass('no-effect').attr('tabindex','-1').insertAfter($ta);

		$ta.css('overflow','hidden').off('focus.expand').on('focus.expand',onfocus);

		return $ta;
	};


	initCommentForm = function($form){
		$form
			.on('focusin', function(){
				$(this).addClass('comment-focus').find('textarea').addClass('focus').css('border-color','#b0b4ba #c7c9cf #c7c9cf #c7c9cf');
			})
			.on('focusout', function(){
				if($(this).find('textarea').val()=='') {$(this).find('textarea').removeClass('focus');}
				$(this).find('textarea').css('border','1px solid #d1d3d9');
	 		})
			.find('textarea')
				.autoExpand()
				// show and control auto completed suggestions
				.keydown(function(event){
					var ta = this, $form=$(this).closest('form'), $post_by_enter, $suggestion, $item, val, pos, username;

					$form = $(this).closest('form');
					$suggestion = $form.find('.comment-autocomplete').filter(':visible');

					switch(event.which){
						case 13: // enter
							if($suggestion.length){
								$suggestion.find('li.selected').mousedown();
								return false;
							} else {
								$post_by_enter = $form.find('input:checkbox');
								if($post_by_enter.prop('checked')) {
									$form.submit();
									return false;
								}
							}
							break;
						case 27: // ESC
							if($suggestion.length) {
								$suggestion.trigger('close');
							} else {
								$form.trigger('close');
							}
							return false;
						case 38: // up
							if($suggestion.length) {
								$suggestion.trigger('move_sel',-1);
								return false;
							}
							return;
						case 40: // down
							if($suggestion.length) {
								$suggestion.trigger('move_sel', 1);
								return false;
							}
							return;
						default:
							setTimeout(function(){
								val = $.trim(ta.value);

								$form.find('button:submit').disable(!val.length);

								if(!val.length || event.which < 47) return;

								// get caret position
								pos = getCaretPos(ta);

								// check @username
								if((pos > 0) && /@(\w*)$/.test(ta.value.substr(0,pos)) ) {
									val = ta.value.substr(pos-RegExp.$1.length).match(/^\w+/) || '';
									clearTimeout(find_timer);
									if(val){
										find_timer = setTimeout(function(){ $suggestion.end().trigger('find', val) }, 200);
									} else {
										$suggestion.trigger('close');
									}
								}
							}, 10);
					}
				})
				.blur(function(event){
					$(this).closest('form').find('.comment-autocomplete:visible').trigger('close');
				})
			.end()
			.find('input:checkbox')
				.click(function(event,by_cookie){
					var $this = $(this);

					setTimeout(function(){
						var checked  = $this.prop('checked'), $wrapper, w;

						$form.add($clone_form)
							.find('input:checkbox').prop('checked',checked).end()
							.find('label[for]')[checked?'addClass':'removeClass']('on').end()
							.find('.btns-post')[checked?'addClass':'removeClass']('checked').end()
							.each(function(){
								var $frm = $(this), w = $frm.find('button:submit').attr('effect-width');
								if(!w) return;
								$frm.find('.button-wrapper').css({left:checked?-w:0});
							});

						if(!by_cookie) {
							setTimeout(function(){ $this.closest('form').find('textarea:not(.no-effect)').focus(); }, 100);
							$.cookie.set('post-by-enter',checked,14);
						}
					}, 10);
				})
			.end()
			.find('button:submit').prop('disabled',true).end()
			.find('.comment-autocomplete')
				.on({
					open : function(){
						var $this = $(this).css('margin-top',$textarea.height()-56+'px').show();
						$this.parents('li.comment:last').addClass('active').siblings('li.comment.active').removeClass('active');
						$this.closest('.activity-item').addClass('focus');
					},
					close : function(){
						var $this = $(this).hide();
						$this.closest('.activity-item').removeClass('focus');
					},
					find : function(event,username){
						var $this = $(this), xhr = $this.data('xhr');

						$.ajax({
							type : 'get',
							url  : '/search-users.json',
							data : {term:username,limit:7},
							dataType : 'json',
							success : function(json){
								var $ul = $this.find('>ul').empty(), args;
								for(var i=0,c=json.length; i < c; i++){
									args = {USERNAME : json[i].username, IMG_SRC : json[i].image_url, FULLNAME : json[i].fullname};
									$tpl_suggest_item.template(args).appendTo($ul);
								}
								$this.trigger( json.length ? 'open' : 'close' ).trigger('move_sel',0);
							}
						});
					},
					move_sel : function(event,dir){
						var $li = $(this).find('>ul>li'), idx = $li.filter('.selected').index();
						if(idx < 0) $li.eq(idx=0).addClass('selected');
						idx = Math.max(Math.min(idx+dir,$li.length-1),0);
						$li.removeClass('selected').eq(idx).addClass('selected');
					}
				})
				.delegate('li', 'mousedown', function(event){
					var $this=$(this), ta, username, pos, $suggestion;

					event.preventDefault();

					$suggestion = $this.closest('.comment-autocomplete').trigger('close');
					username = $this.find('.username').text();
					ta  = $suggestion.closest('form').find('textarea').get(0);
					pos = getCaretPos(ta);

					// insert @username
					if((pos > 0) && /@(\w*)$/.test(ta.value.substr(0,pos))) {
						pos = pos - RegExp.$1.length;
						val = ta.value.substr(pos).match(/^\w+/)[0] || '';
						if(val) ta.value = ta.value.substr(0,pos)+username+ta.value.substr(pos+val.length);
						setCaretPos(ta, pos+username.length);
					}
				})
				.delegate('li', 'mouseover', function(event){
					$(this).addClass('selected').siblings('li').removeClass('selected');
				})
			.end()
			.submit(function(event){
				event.preventDefault();

				var $frm = $(this), $ta = $frm.find('textarea'), txt = $.trim($ta.val()), params={}, url, modifying;
				if(!txt.length) {
					alert(gettext('Please enter your comment'));
					return $ta.focus();
				}

				$comment_list_new = null;
				$comment_list = $(this).parents(".comments").find("ol");

				if($frm.hasClass('loading')) return;
				$frm.addClass('loading').find('button:submit').prop('disabled',true);

				params['comment'] = txt.replace(/@(\w+)/gi, '<a href="/$1">@$1</a>');
				params['object_id'] = $ta.attr('oid');
				params['type'] = $ta.attr('otype');

				if($frm.parent('li.comment').attr('cid')) { // modify
					modifying = true;
					url = '/edit_comment.xml';
					params['comment_id'] = $frm.parent('li.comment').attr('cid');
					params['commenter_id'] = $frm.parent('li.comment').attr('cuid');
				} else { // add
					modifying = false;
					url = '/add_comment.xml';
				}

				$.ajax({
					type : 'post',
					url  : url,
					data : params,
					dataType : 'xml',
					success  : function(xml){
						var $xml = $(xml), $st = $xml.find('status_code'), args;
						if(!$st.length) return;
						if($st.text() == 0) return alert($xml.find('message').text());
						if(modifying){
							$frm.parent('li.comment').find('>.c-text').html(params['comment']).end().end().trigger('close');
						} else {
							args = {
								ID : $xml.find('comment_id').text(),
								NOTE : $xml.find('comment').text(),
								USER_ID  : $xml.find('commenter_id').text(),
								USERNAME : $xml.find('username').text(),
								FULLNAME : $xml.find('fullname').text(),
								FIRST_NAME: $xml.find('fullname').text(),
								USER_IMG_URL : $xml.find('userimage').text()
							};
							addComment(args, false).fadeIn(500);
							addCommentNum(1);
						}

						// clear the form
						$ta.val('');
					},
					complete : function(){
						$frm.removeClass('loading');
					}
				});
			});
	};

	initCommentForm($form);

	// create a clone form for 2-depth comments
	if( !$("section.comments").attr("data-timeline") ) {
		$clone_form = $form.clone(true)
		.find('.close_').click(function(){ $(this).closest('form').trigger('close') }).end()
		.find('textarea').attr('placeholder', gettext('Write a reply')).end()
		.find('input:checkbox').attr('id', 'post-by-enter-1').next('label').attr('for','post-by-enter-1').end().end()
		.on({
			open : function(event, button){
				var $button = $(button).addClass('current'), $li = $button.closest('li.comment');
				$clone_form
					.appendTo($li)
					.show()
					.find('textarea').val('').removeClass('focus').end()
					.find('button:submit').disable().end();
			},
			close : function(){
				$clone_form.removeClass('comment-focus mode-edit mode-reply').hide();
				$('.comments')
					.find('li.comment-edit').removeClass('comment-edit').end()
					.find('a.reply.current').removeClass('current').end();
			}
		});

		// save button's width for slide effect
		$clone_form.insertAfter($form).find('button:submit').text(gettext('Save comment'));

		$form.add($clone_form).each(function(){
			var $this=$(this),$btn=$this.find('button:submit');
			$this
				.find('.btns-post')
					.show()
					.find('button:submit').attr('effect-width', ($this.find('label[for]')[0]?$this.find('label[for]')[0].offsetLeft:0) ).end()
					.find('.button-wrapper').css('left', $this.find('label[for]')[0]?-$this.find('label[for]')[0].offsetLeft+'px':'0').end()
					.css('display','')
				.end();
		});

		$clone_form.hide();

		// restore 'press enter to post' option
		(function(b){
			if(b == null) return;
	 		$('#post-by-enter').prop('checked',(b==='false')).trigger('click',true);
		})($.cookie.get('post-by-enter'));
	}else{
		//$form.add($clone_form).each(function(){
		//	var $this=$(this),$btn=$this.find('button:submit');
		//	$this.find('.btns-post').show().css('display','');
		//});
	}

	$('#content .comments-list')
		// mouse over and out of a comment row
		.delegate('li.comment', {
			mouseenter : function(){ $(this).addClass('hover') },
			mouseleave : function(){ $(this).removeClass('hover').find('p.on').removeClass('on') } // close option popup also
		})
		// Reply button
		.delegate('.c-reply a.reply', 'click', function(event){
			event.preventDefault();
			var $this=$(this), is_open=$(this).hasClass('current'),username;
			$clone_form.trigger('close');
			if(!is_open) $clone_form.trigger('open', [this]);

			username = $this.closest('li.comment').attr('cuname');
			setCaretPos($clone_form.find('textarea').val('@'+username+' ').get(0), username.length+2);
		})
		// Edit button
		.delegate('.c-reply a.edit-comment', 'click', function(event){
			event.preventDefault();

			var $this = $(this), $li = $this.closest('li.comment');
			$clone_form
				.trigger('close')
				.trigger('open', [$this])
				.addClass('mode-edit')
				.find('button:submit').disable(false).end()
				.find('label[for]').html('<i></i> '+gettext('Press enter to save')).end()
				.find('textarea').val( $li.find('>p.c-text').text() ).not('.no-effect').focus().end();

			$li.addClass('comment-edit');
		})
		// Delete button
		.delegate('.c-reply a.delete-comment', 'click', function(event){
			event.preventDefault();

			var $this = $(this), $li = $this.closest('li.comment'), params={};
			if($this.hasClass('disabled')) return;
			$this.addClass('disabled');

			params['comment_id'] = $li.attr('cid');
			params['commenter_id'] = $li.attr('cuid');

			$.ajax({
				type : 'post',
				url  : '/delete_comment.xml',
				data : params,
				dataType : 'xml',
				success : function(xml){
					var $xml = $(xml), $st = $xml.find('status_code');
					if($st.length && $st.text() == 1){
						$li.fadeOut(500, function(){ $li.remove() });
						addCommentNum(-1);
					} else if($st.text() == 0){
						alert($xml.find('message').text());
					}
				},
				complete : function(){
					$this.removeClass('disabled');
				}
			});
		})
		// show dropdown menu when clicks on additional feature icon
		.delegate('.optional p', 'click', function(){
			var $this = $(this).toggleClass('on').siblings('p').removeClass('on');
			if($this.hasClass('on')) {
				$(document).one('mousedown.commment-option', function(event){ if(event.target === this) $this.removeClass('on') });
			} else {
				$(document).off('mousedown.comment-option');
			}
		})
		// translate a comment
		.delegate('.optional a.btn-translate', 'click', function(event){
			event.preventDefault();

			var $this = $(this), $cmt = $this.parents('li.comment').children('p.c-text'), txt = $cmt.text();
			function onerror(){ $cmt.text(txt); alert(gettext('Translation failed.')); };
			$cmt.text(gettext('Translating...'));
			$.ajax({
				type : 'get',
				url  : ACCESS_TOKEN_URL,
				dataType : 'json',
				success  : function(json){
					var params = {to: window.lang, text:txt, contentType:'text/plain', appId:'Bearer '+json.access_token};
					$.ajax({
						url  : TRANSLATE_URL,
						data : params,
						dataType : 'jsonp',
						jsonp    : 'oncomplete',
						success  : function(txt){
							$cmt.text(txt);
						},
						error : onerror
					});
				},
				error : onerror
			});
			$this.closest('p').removeClass('on');
		})
		// report as inapproper...
		.delegate('.optional a.btn-inappro', 'click', function(event){
			event.preventDefault();

			var $this = $(this), params;
			params = {
				comment_id   : $this.attr('data-cid'),
				commenter_id : $this.attr('data-cuid'),
				tid : $this.closest('.comments-list').attr('data-tid')
			};
			$.ajax({
				type : 'post',
				url  : '/report_comment.json',
				data : params,
				dataType : 'json',
				success  : function(json){
					if(json.status_code == undefined) return;
					if(json.response_code == 0 && response.message) alert(response.message);

					var $cmt = $this.closest('li.comment'), $blocked, args={};

					args = {
						ID       : $cmt.attr('cid'),
						USER_ID  : $cmt.attr('cuid'),
						USERNAME : $cmt.attr('cuname'),
						FIRST_NAME   : $cmt.attr('fullname'),
						USER_IMG_URL : $cmt.attr('uimage')
					};

					$blocked = $tpl_blocked_item.template(args);
					$blocked.data('original-comment', $cmt.after($blocked).remove());
				}
			});
		})
		.delegate('.btn-mention_user', 'click', function(event){
			event.preventDefault();

			var $this = $(this), $li = $this.closest('li.comment'), $ta = $form.find('textarea'), v = $ta.val();

			if(v.length) v += ' ';
			v += '@'+$li.attr('cuname')+' ';

			$ta.val(v).focus().end().get(0).scrollIntoView(true);
			$(window).scrollTop( $(window).scrollTop() - event.clientY + 20);

			setCaretPos($ta[0], v.length);
		})
		.delegate('.btn-report-user', 'click', function(event){
			event.preventDefault();

			// TODO : report this user
		})
		.delegate('.btn-block-user', 'click', function(event){
			event.preventDefault();

			// TODO : block this user
		})
		.delegate('.btn-report-undo', 'click', function(event){
			event.preventDefault();

			var $this = $(this), params;
			params = {
				comment_id   : $this.attr('data-cid'),
				commenter_id : $this.attr('data-cuid')
			};
			$.ajax({
				type : 'post',
				url  : '/cancel_report_comment.json',
				data : params,
				dataType : 'json',
				success  : function(json){
					if(json.status_code == undefined) return;
					if(json.response_code == 0 && response.message) alert(response.message);

					var $blocked = $this.closest('li.comment'), $cmt = $blocked.data('original-comment')||$blocked.next();
					$blocked.after($cmt.show()).remove();
				}
			});

		});


	// View all comments
	function comment_hash() {
		return /^#comment-\d+$/.test(location.hash);
	};
	function highlight($elem) {
		if (!$elem.length) return;
		$elem.parent().delay(100).css('background','#fff').animate({backgroundColor:'#fffbc2'},1000).animate({backgroundColor:'#fff'},1000); // scroll to the comment
	};

	window.catalog.view_all_comments = $toggle_comments.eq(0).text()||'View all comments';

	if(!$view_all_comments.length) $toggle_comments.show().click();

	$("#content").delegate("#toggle-comments","click",function(event){
		//window.catalog.view_all_comments = $(this).prev().text();
		$(this).toggleClass('collapse').find('>span').text($(this).hasClass('collapse')?gettext('Hide comments'):window.catalog.view_all_comments);
		//var $comment_list_new = $(this).parents(".comments-list-new")
		if($comment_list_new) $comment_list_new.slideToggle();

		if( $(this).parents(".comments").attr("data-timeline") && !$comment_list.hasClass("last") ){
			if($comment_list.is(":visible")) $comment_list.hide();
			else $comment_list.show();
		}
	});
	$("#content").delegate(".comments-list-new",'transitionend oTransitionEnd msTransitionEnd webkitTransitionEnd', function(event){
		if(this !== event.target) return;
		var $this=$(this).css('overflow','');
	});

	function load_all_comments($el){
		var $this = $el, param = {}, has_hash = false, has_comment = false, $comments = $el.parents(".comments-list").find('ol');
		$toggle_comments = $el.parents(".comments-list").find("#toggle-comments");
        /*
		if($comment_list_new){
			$comment_list_new.remove();
			$comment_list_new = null;
		}*/

		$comment_list_new = $this.parents(".comments").find("ol.last");

		param['tid'] = $this.attr('data-tid');
		param['ts']  = $this.attr('data-next-num');
		param['cts'] = $this.attr('data-c-ts');
		if(!param['ts']) param['ts'] = Math.ceil((new Date().getTime())/1000);
		if(!param['cts']) param['cts'] = Math.ceil((new Date().getTime())/1000);
        param['latest'] = 1;
        param['limit']= 10;
		if(has_hash=comment_hash()) has_comment = ($(location.hash).length > 0);
		if($this.hasClass('loading')) return;
		$this.addClass('loading');
        $loader.show();
		$.ajax({
			method : 'get',
			url    : '/get-more-comments-on-thing.json',
			cache  : false,
			data   : param,
			dataType : 'json',
			success  : function(json){
				var args, cmt, h;
				if(json.status_code != 1) return;

                $this.attr('data-next-num', json.next_comment_num);

                if (json.has_more_comments == 1)
                {
				    $this.removeClass('loading');
                }
                else
                {
                    $this.removeClass('loading').hide();

                    if( !$comment_list.parents(".comments").attr("data-timeline") )
				    	$toggle_comments.show().click();
                }

                var c = json.comments.length;
				for(var i = c-1; i>=0; i--){
					cmt  = json.comments[i];
					args = {
						ID:cmt.id, NOTE:cmt.text, USER_ID:cmt.user.id,
						USERNAME:cmt.user.username,
						FIRST_NAME:cmt.user.first_name ? cmt.user.first_name : cmt.user.username,
						USER_IMG_URL:cmt.user.image_url, USER_HTML_URL:cmt.user.html_url
					};
					addComment(args, true);
				}

				//try { $comment_list_new.hide().slideDown(); } catch(e){};

                $loader.hide();

				if(has_hash && !has_comment){
					location.href = location.hash;
					highlight($(location.hash));
				}
			},
			complete : function(){
				$comments.find('li.loading').hide();
			}
		});
	}

	$("#content").delegate("#btn-viewall-comments","click",function(e) {
		e.preventDefault();
		load_all_comments($(this));
		return false;
	});

	if(comment_hash()) {
		if($(location.hash).length) {
			highlight($(location.hash));
		} else {
			$view_all_comments.click();
		}
	}

});
