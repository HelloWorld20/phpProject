(function($){

	// Class MoreShare
	function MoreShare () {
		this.$container = null;
		this.$mores = null;
		this.$current = null;
		this.apiSearchFriendXHR = null;
		this.shortcutURL = {};

		this.init = this.init.bind(this);
		this.repositionOverlay = this.repositionOverlay.bind(this);
		this.initUserList = this.initUserList.bind(this);
		this.filterUserList = this.filterUserList.bind(this);
		this.openSharePopup = this.openSharePopup.bind(this);
		this.updateSocialLink = this.updateSocialLink.bind(this);
		this.apiSearchFriend = this.apiSearchFriend.bind(this);
		this.initFriendList = this.initFriendList.bind(this);
		this.clearFriendList = this.clearFriendList.bind(this);
	}

	MoreShare.prototype.init = function init(containerSelector, logged_in) {
		var self = this;
		var isSingleMode = !$('#timeline-more-menu').length;
		self.$container = $(containerSelector||'.stream');

		self.$container.on('click', '.btn-more', function(event){
			self.$current = $(this).parent();
			self.repositionOverlay();
			if(!isSingleMode)
				self.$current.append(self.$mores).closest('li');
			self.$current.addClass('opened').closest('li').addClass('active');

			self.$current.find(".trick").show();

			// click share button if more button is actually share button. ex) timeline recommended feed recommended view
			if(!$("#more-menu").is(":visible")){
				self.$mores.find('button.share').click();
			}
			return false;
		});

		if(!isSingleMode) {
			self.$mores = $('#timeline-more-menu').remove().children();
		} else {
			self.$mores = self.$container.find("em.menu-container").children();
		}

		self.$mores.filter('.trick').on('click', function(event){
			self.$current.removeClass('opened').closest('li').removeClass('active');
			self.$mores.filter('div, .trick').hide();
			if ($('html').hasClass('fixed')) {
				$('html').removeClass('fixed');
				$(window).scrollTop($('.container').attr('position'));
				$('.container').removeAttr('style');
			}
			return false;
		});

		self.$mores.find('button.share').on('click', function(event){
			if(isSingleMode){
				self.$current = $(this).closest("em.menu-container");
				self.$mores = self.$current.children();
				self.$current.find(".trick").show();
			}
			self.repositionOverlay();
			$(this).closest('.menu-container').removeClass('opened').find("#show-addlist").hide().end().find('#show-share').show();
			self.openSharePopup(location.protocol+'//'+location.hostname+self.$current.data('url'));
			return false;
		});

		self.$mores.find('button.add-list').on('click', function(event){
			if (!logged_in) {
					require_login();
					return;
			}
			if(isSingleMode){
				self.$current = $(this).closest("em.menu-container");
				self.$mores = self.$current.children();
				self.$current.find(".trick").show();
			}
			var fixTop = $(window).scrollTop();
			self.repositionOverlay();
			$(this).closest('.menu-container').removeClass('opened').find('#show-share').hide().end().find('#show-addlist').show();
			self.drawUserList(self.$current.attr('data-tid'));
			$('html').addClass('fixed').find('.container').attr('position',fixTop).css('top',-fixTop + 'px');
			return false;
		});

		if (logged_in) {
			// init user's lists
			self.initUserList();
			// init friend lists
			self.initFriendList();
		} else {
			self.$mores.filter('#show-share').find('.tit > a[href=#more-share-sns]').css('width','100%');
			self.$mores.filter('#show-share').find('.tit > a[href=#more-share-send]').hide();
		}
	}

	MoreShare.prototype.repositionOverlay = function repositionOverlay() {
		if (this.$current.offset().top-$(window).scrollTop() < $(window).height()/2 - 50) {
			this.$mores.filter('[id]').addClass('bot');
		} else {
			this.$mores.filter('[id]').removeClass('bot');
		}
	}

	MoreShare.prototype.initUserList = function initUserList() {
		var self = this;
		self.drawUserList(0);
		var $addlist = self.$mores.filter('#show-addlist');
    var via = '';
    var $container = $('#container-wrapper > div.container');

    if ($container.is(".timeline")) via = 'timeline';
    else if ($container.is(".thing-detail")) via ='thing detail';

		$addlist.find('.search > input').on('keyup', function(event){
			self.filterUserList(this.value);
		});

		$addlist
			.on('click', 'input[type="checkbox"].tag', function(event){
				var tid = self.$current.attr('data-tid'), params = {owned:false, wanted:false};

				if (this.checked) {
					params[this.name] = true;
					$addlist.find('input[name="'+(this.name==='wanted'?'owned':'wanted')+'"]').prop('checked', false);
				}

        if (params.wanted) {
          if (dataLayer) {
            dataLayer.push({'event': 'Add_to_Wishlist_Check', 'product_id': undefined, 'products_info': undefined, 'products': undefined, 'revenue': undefined });
          }
        }

        $.ajax('/rest-api/v1/things/'+tid, {type:'PUT', data:params}).done(function(){ self.drawUserList(tid) });
        try {
          var event = this.checked ? "Add to List" : "Remove from List";
          mixpanel_log(event, { 'thing id': tid, 'list name': $(this).attr('name'), 'list id': -1, 'via': via });
        } catch(e) {};
			})
			.on('click', 'input[type="checkbox"]:not(.tag)', function(event){
				var tid = self.$current.attr('data-tid'), checked = [], unchecked = [], $this = $(this);
				$this.closest('ul').find('input[type="checkbox"]:not(.tag)').each(function(){
					this.checked ? checked.push(this.id) : unchecked.push(this.id);
				});

				$.post('/save_list_items', {tid:tid, checked_list_ids:checked.join(','), unchecked_list_ids:unchecked.join(',')})
					.done(function(){ self.drawUserList(tid) });
                try {
                    var event = this.checked ? "Add to List" : "Remove from List";
                    mixpanel_log(event, { 'thing id': tid, 'list name': $.trim($this.parent().text()), 'list id': this.id, 'via': via });
                } catch(e) {};
			});

		$addlist.find('#quick-create-list')
			.on('focus', function(){
				$(this).prev('label').hide();
			})
			.on('blur', function(){
				$(this).prev('label').css('display', 'block');
			})
			.on('keyup', function(event){
				if (event.which !== 13) return;
				$(this).nextAll('button').click();
			})
			.nextAll('button')
				.on('click', function(event){
					var $input = $('#quick-create-list'), val = $input.val();
					// save new list
					$.post('/create_list.xml', {list_name:val, reaction:0})
						.done(function(res){
							if($(res).find("created").text()=='False'){
								alertify.alert("A list with this name already exists");
								return;
							}
							$input.val('').focus();
							self.drawUserList(self.$current.attr('data-tid'));
						});
                    try {
                        mixpanel_log('Create New List', { 'thing id': self.$current.attr('data-tid'), 'list name': val, 'via': via });
                    } catch(e) {};
					})
			.end();

		self.$mores.filter('#show-share').find('.tit > a').on('click', function(event){
			var $this = $(this), $indicator = $this.nextAll('.indicator');
			if ($this.is(':first-child')) {
				$indicator.css({left:12, right:'50%'});
			} else {
				$indicator.css({left:'50%', right:12});
			}
			$this.addClass('current').siblings('a').removeClass('current');
			$this.closest('#show-share').find($this.attr('href')).show().siblings().hide();
			return false;
		}).end()
        .find('#more-share-sns .via a').click(function() {
            try {
                var $this = $(this);
                var t = { "fb": "Facebook", "tw": "Twitter", "gg": "GooglePlus", "tb": "Tumblr" }[$this.attr('class')];
                mixpanel_log('Complete Share', { "thing id": $this.attr('data-tid'), "type": t });
            } catch (e) {}
        }).end()
        .find('#more-share-link').on('copy', function() {
            try { mixpanel_log('Complete Share', { "thing id": $(this).attr('data-tid'), "type": "Clipboard" }); } catch (e) {}
        });

		self.$mores.find('#more-share-email').on('keyup', function(event){
			var val = $.trim(this.value);
			if (!val || this.prevVal === val) return;

			self.apiSearchFriend(this.prevVal = val).done(function(json){
				var result = [];

				$.each(json, function(){
					var $li = $('<li />'), $a = $('<a class="before-bg-share2" />').appendTo($li);
					$a.data(this);
					$('<img alt="" />').attr('src', this.profile_image_url).appendTo($a);
					$('<b />').text(this.fullname).appendTo($a);
					$('<small />').text('@'+this.username).appendTo($a);
					result.push($li[0]);
				});

				var $send = $('#more-share-send');
				if (result.length) {
					$send.find('> .empty').hide();
					$send.find('> .send').show();
					$send.find('> .lists').show().empty().append(result);
				} else {
					$send.children('.lists, .send').hide();
					$send.find('> .empty').removeClass('default').addClass('no-result').show();
				}
			});
		});
	}

	MoreShare.prototype.drawUserList = function drawUserList(tid) {
		var self = this;
		var $ul = $('#show-addlist .lists');
		return $.get('/_get_list_checkbox.html', {tid:tid}).done(function(html){
			var $html = $(html),
				  $items = $html.filter('li').find('img').remove().end(),
				  listArr = $items.get();

			listArr.sort(function(a, b){
				var aText = $.trim($(a).text()), bText = $.trim($(b).text());
				return aText < bText ? -1 : 1;
			});

			$ul.empty().append(listArr);
			//$(listArr[0]).prevAll().remove();

			// wishlist and owns
			var rand = Math.floor(Math.random()*1000), wanted, owned;
			wanted = $html.filter('input[name="wanted"]').val() === 'true' ? ' checked' : '';
			//owned = $html.filter('input[name="owned"]').val() === 'true' ? ' checked' : '';
			$('<li><label for="wanted-'+rand+'"><input type="checkbox" name="wanted" id="wanted-'+rand+'" class="tag"'+wanted+'> Wishlist</label></li>').prependTo($ul);
			//$('<li><label for="owned-'+rand+'"><input type="checkbox" name="owned" id="owned-'+rand+'" class="tag"'+owned+'> Owns</label></li>').prependTo($ul);

			self.filterUserList($('#show-addlist .search > input.text').val());
		});
	}

	// FIXME: This does not work always
	MoreShare.prototype.filterUserList = function filterUserList(term) {
		var $list = $('#show-addlist .lists li').css('display', '');

		term = $.trim(term).toLowerCase();
		if (!term) return;

		$list
			.filter(function(){ return $(this).text().toLowerCase().indexOf(term) === -1 })
			.hide();

		$list.slice(0, 2).hide();
	}

	MoreShare.prototype.openSharePopup = function openSharePopup(url) {
		var self = this;
		var $current = self.$current;
		var $link = self.$mores.find('#more-share-link');
		var title = $current.data('title');
		var img = 'https://' + $current.data('img');

    mixpanel_log('Share', { 'thing id': $current.attr('data-tid') });
    $("#show-share .via a").attr('data-tid', $current.attr('data-tid'));
    $link.attr('data-tid', $current.attr('data-tid'))
		self.updateSocialLink($link.val(), title, img);
		if (!self.shortcutURL[url]) {
			if (window.viewer && viewer.username) url += '?ref='+viewer.username;
			$link.val(url);
			$.post('/get_short_url.json', {thing_id:$current.attr('data-tid')}).done(function(data){
				if(data.short_url) {
					self.shortcutURL[url] = data.short_url;
					$link.val(data.short_url);
					self.updateSocialLink($link.val(), title, img);
				}
			});
		} else {
			$link.val(self.shortcutURL[url]);
		}

		// select first tab
		self.$mores.filter('#show-share').find('.tit > a:first-child').click();

		self.clearFriendList();
	}

	MoreShare.prototype.updateSocialLink = function updateSocialLink(url, txt, img) {
		url = encodeURIComponent(url);
		txt = encodeURIComponent(txt);
		img = encodeURIComponent(img);

		$('#show-share .via')
			.find('a.tw').attr('href', 'http://twitter.com/share?text='+txt+'&url='+url+'&via=fancy').data({width:540,height:300}).end()
			.find('a.fb').attr('href', 'http://www.facebook.com/sharer.php?u='+url).data({url:url,text:txt}).end()
			.find('a.gg').attr('href', 'https://plus.google.com/share?url='+url).end()
			.find('a.tb').attr('href', 'http://www.tumblr.com/share/link?url='+url+'&name='+txt+'&description='+txt).end();
			/*
			.find('a.li').attr('href', 'http://www.linkedin.com/shareArticle?mini=true&url='+enc_url+'&title='+enc_txt+'&source=thefancy.com').end()
			.find('a.vk').attr('href', 'http://vkontakte.ru/share.php?url='+enc_url).end()
			.find('a.wb').attr('href', 'http://service.weibo.com/share/share.php?url='+enc_url+'&appkey=&title='+enc_txt+(img?'&pic='+enc_img:'')).end()
			.find('a.mx').attr('href', 'http://mixi.jp/share.pl?u='+enc_url+'&k=91966ce7669c34754b21555e4ae88eedce498bf0').data({width:632,height:456}).end()
			.find('a.qz').attr('href', 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+enc_url).end()
			.find('a.rr').attr('href', 'http://share.renren.com/share/buttonshare.do?link='+enc_url+'&title='+enc_txt).end()
			.find('a.od').attr('href', 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=2&st.noresize=on&st._surl='+enc_url).end()
			*/
	}

	MoreShare.prototype.apiSearchFriend = function apiSearchFriend(str) {
		if (this.apiSearchFriendXHR) this.apiSearchFriendXHR.abort();
		this.apiSearchFriendXHR = $.get('/search-users.json', {
			term: str,
			check_messages_permission: true,
			filter_messages_permission: true
		});

		return this.apiSearchFriendXHR;
	}

	MoreShare.prototype.initFriendList = function initFriendList() {
		var self = this;
		var $send = self.$mores.find('#more-share-send');

		$send.find('.lists').on('click', 'a', function(event){
			var $this = $(this), selected = !$this.hasClass('selected');
			$this.closest('ul').find('a').removeClass('selected');
			if (selected) $this.addClass('selected');
			$send.find('button.btn-send').prop('disabled', !selected);
			return false;
		});

		$send.find('.btn-send').click(function(event){
			var $this = $(this), text = $.trim($send.find('textarea').val());

			// users
			var users = $('#more-share-send a.selected').map(function(){ return $(this).data('id'); }).get();
			if (!users.length) return;

			var params = {things:self.$current.attr('data-tid'), user_id:users.join(',')};
			if(text) params.message = text;

			$this.prop('disabled', true);
			$.post('/messages/send-message.json', params)
				.done(function(json){
					if (json.status_code !== 1) {
						// TODO: show error message
						return;
					}

					self.clearFriendList();
					self.$mores.find('#more-share-send')
						.find('.empty').removeClass('default').addClass('success').end()
						.find('>.textbox').hide();
          mixpanel_log('Complete Share', { "thing id": params.things, "type": "FancyMessage" });
				})
				.always(function(){
					$this.prop('disabled', false);
				});

			return false;
		});

		$send.find('.continue').on('click', function(event){
			self.clearFriendList();
			$send.find('#more-share-email').focus();
			return false;
		});

	}

	MoreShare.prototype.clearFriendList = function clearFriendList() {
		// remove search history for users
		this.$mores.find('#more-share-email').val('');
		// clear all states
		this.$mores.find('#more-share-send')
			.find('.lists').hide().end()
			.find('.empty').show().removeClass('no-result success').addClass('default').end()
			.find('textarea').val('').end()
			.find('>.textbox').show().end()
			.find('>.send').hide().end()
			.find('.btn-send').prop('disabled', true);
	}

	window.MoreShare = {
		init: function init (containerSelector, logged_in) {
			var ms = new MoreShare();
			ms.init(containerSelector, logged_in);
			return ms;
		}
	};
})(window.jQuery);
