(function(){
	var $btns = $('.viewer li'), $stream = $('ol.stream'), $container=$('.container.timeline'), $wrapper = $('.wrapper-content'), first_id = 'stream-first-item_', latest_id = 'stream-latest-item_', vid = $stream.attr('vid');

    var category = $('.sorting a[data-category].active').data("category");
    slideshow_request_url = '/home_slideshow.json?new-timeline&feed=featured'+(add_thing?("&add_thing="+add_thing):"");

	var feedName = "Everything";
	if( category && category != 'all'){
		slideshow_request_url += '&category='+category;
		feedName = $('.sorting a[data-category].active').text();
	}
	slideshow_header = '<b>'+gettext("Timeline")+'</b><span class="icon arrow"></span> '+gettext(feedName);

	if(!vid){
		$stream.delegate('div.figure-item a', 'click', function(){
			var $this = $(this), requireLogin = $this.attr('require_login'), url = $this.attr('href');

			if (requireLogin !== 'true') return;

			$('#fancy-g-signin').attr('next', url);
			$social = $('.social');
			if ($social.length > 0) {
				 $social.attr('next', url);
			}
			$(".popup.sign.signup")
				.find('input.next_url').val(url).end()
				.find('a.signup').attr('href','/register?next='+url).end()
				.find('a.signin').attr('href','/login?next='+url);
			$.dialog('popup.sign.signup').open();
			return false;
		});
	} else {
		$(function(){
			var $custom_checks = $('div.customize form.options input:checkbox');
			$custom_checks.click(function(){
				if (!$custom_checks.filter(':checked').length) $('#show_featured_items').prop('checked', true);
			});
		});
	}

	// show images as each image is loaded
	$stream.on('itemloaded', function(){

		var $latest = $stream.find('>#'+latest_id).removeAttr('id'),
	 	    $first = $stream.find('>#'+first_id).removeAttr('id'),
		    $target=$(), viewMode;

		var forceRefresh = false;

		if(!$first.length || !$latest.length) {
			$target = $stream.children('li');
		} else {
			var newThings = $first.prevAll('li');
			if(newThings.length) forceRefresh = true;
			$target = newThings.add($latest.nextAll('li'));
		}

		$stream.find('>li:first-child').attr('id', first_id);
		$stream.find('>li:last-child').attr('id', latest_id);

	    viewMode = 'classic';
	    if( $container.hasClass('normal') ) viewMode = 'grid';
	    if( $container.hasClass('recommended') ) viewMode = 'recommended';

		if(viewMode=='classic'){
			$target.find(".figure.grid > img").each(function(){
				$(this).attr("src", $(this).attr('data-src'));
			});
		}

		$target.find("form.comment-form").each(function(){
			if( typeof initCommentForm != "undefined") initCommentForm($(this));
		})

		$(window).trigger("scroll.infiniteshow");

	});

	$stream.trigger('itemloaded');

	// $btns.each(function(){
	// 	var $tip = $(this).find('span');
	// 	$tip.css('margin-left', -$tip.width()/2 - 8 + 'px');
	// });
	//$btns.hover(function(){$container.css('z-index','11');},function(){$container.css('z-index','0');});
	$btns.click(function(event){
		event.preventDefault();
		if($wrapper.hasClass('anim')) return;

		var $btn = $(this);

		if(/\b(normal|classic|recommended)\b/.test($btn.attr('class'))){
			var timelineView = RegExp.$1;
			
			$wrapper.off('before-fadein');
			$wrapper.off('after-fadein');
			if(timelineView!='recommended')
				$wrapper.trigger('timelineViewChanged', [timelineView]);
			setView(timelineView);
			// hightlight this button only
			$btns.find('a.current').removeClass('current');
			$btn.find('a').addClass('current');
		}
	});

	$wrapper.on('redraw', function(event, mode){
		var curMode = '';
		if(/\b(normal|classic|recommended)\b/.test($container.attr('class'))) curMode = RegExp.$1;
		if(mode||curMode) setView(mode||curMode, true);
	});

	var $win = $(window),
		scTop    = $win.scrollTop(),
		stTop    = $stream.offset().top,
		winH     = $win.innerHeight(),
		headerH  = $('#header-new').height(),
		firstTop = -1,
		maxDelay = 0,
		begin    = Date.now();

	function inViewport(el){
		return (stTop + el.offsetTop + el.offsetHeight > scTop + headerH) && (stTop + el.offsetTop < scTop + winH);
	};

	function showLoading() {

		if(!window.Modernizr || !Modernizr.csstransitions ){
			$wrapper.find('.spinner').show().end();
			$wrapper.addClass('loading');
			$wrapper.trigger('before-fadeout');
		} else {
			$stream.addClass('use-css3').removeClass('fadein');

			$stream.find(">li").each(function(i,v){
				if(!inViewport(v)) return;
				if(firstTop < 0) firstTop = v.offsetTop;

				var delay = Math.round(Math.sqrt(Math.pow(v.offsetTop - firstTop, 2)+Math.pow(v.offsetLeft, 2)));

				v.className += ' anim';
				setTimeout(function(){ v.className += ' fadeout'; }, delay+10);

				if(delay > maxDelay) maxDelay = delay;
			});

			//$wrapper.trigger('before-fadeout').addClass('anim').addClass('loading');
		}
	};

	function setView(mode, force){
		if(!force && $container.hasClass(mode)) return;

		var $items = $stream.find('>li');

		if($items.length>50){
			$items.filter(":eq(50)").nextAll().detach();
		}

		if(!window.Modernizr || !Modernizr.csstransitions ){
			$wrapper.removeClass('loading');

			$wrapper.trigger('before-fadein');
			switchTo(mode);


			$stream.find('>li').css('opacity',1);
			$wrapper.trigger('after-fadein');
			return;
		}
		$stream.attr('view', mode);

		var item,
		    $visibles, visibles = [], prevVisibles, thefirst,
		    offsetTop = $stream.offset().top,
		    hh = $('#header-new').height(),
		    sc = $(window).scrollTop(),
		    wh = $(window).innerHeight(),
			f_right, f_bottom, v_right, v_bottom,
			i, c, v, d, animated = 0;

		// get visible elements
		for(i=0,c=$items.length; i < c; i++){
			item = $items[i];
			if (offsetTop + item.offsetTop + item.offsetHeight < sc + hh) {
				//item.style.visibility = 'hidden';
			} else if (offsetTop + item.offsetTop > sc + wh) {
				//item.style.visibility = 'hidden';
				break;
			} else {
				visibles[visibles.length] = item;
			}
		}
		prevVisibles = visibles;
		// get the first animated element
		thefirst = visibles[0];

		if(visibles.length==0){
			$wrapper.trigger('before-fadein');
			fadeIn();
		}
		// fade out elements using delay based on the distance between each element and the first element.
		
		for(i=0,c=visibles.length; i < c; i++){
			v = visibles[i];

			d = Math.sqrt(Math.pow((v.offsetLeft - thefirst.offsetLeft),2) + Math.pow(Math.max(v.offsetTop-thefirst.offsetTop,0),2));
			delayOpacity(v, 0, d/5);

			if(i == c - 1){
				setTimeout(function(){
					$wrapper.trigger('before-fadein');
				}, d/5);
				setTimeout(function(){
					fadeIn()
				}, 200 + d/5);
			}
		}		

		function fadeIn(){

			if($wrapper.hasClass("wait")){
				setTimeout(fadeIn, 20);
				return;
			}

			var i, c, v, thefirst, COL_COUNT, visibles = [], item;

			if($items.length !== $stream.get(0).childNodes.length || $items.get(0).parentNode !== $stream.get(0)) $items = $stream.find('>li');
			$stream.height($stream.parent().height());

			switchTo(mode);

			// get visible elements
			for(i=0,c=$items.length; i < c; i++){
				item = $items[i];
				if (offsetTop + item.offsetTop + item.offsetHeight < sc + hh) {
					//item.style.visibility = 'hidden';
				} else if (offsetTop + item.offsetTop > sc + wh) {
					//item.style.visibility = 'hidden';
					break;
				} else {
					visibles[visibles.length] = item;
					item.style.opacity = 0;
				}
			}
			$(visibles).css({opacity:0,visibility:''});
			//$wrapper.addClass('anim');

			COL_COUNT = Math.floor($stream.width()/$(visibles[0]).width());

			// get the first animated element
			thefirst = visibles[0];
			
			// fade in elements using delay based on the distance between each element and the first element.
			if(visibles.length==0) done();

			for(i=0,c=visibles.length; i < c; i++){
				v = visibles[i];
				d = Math.sqrt(Math.pow((v.offsetLeft - thefirst.offsetLeft),2) + Math.pow(Math.max(v.offsetTop-thefirst.offsetTop,0),2));
				v.d = d/5;
			}
			for(i=0,c=visibles.length; i < c; i++){
				v = visibles[i];
				delayOpacity(v, 1, v.d);
				if(i == c -1) setTimeout(done, 300+v.d);
			}
			
		};

		function done(){			
			//$wrapper.removeClass('anim');
			$stream.find('>li').css('opacity',1);
			$wrapper.trigger('after-fadein');		
		};

		function delayOpacity(element, opacity, interval){
			setTimeout(function(){ $(element).animate({opacity:opacity}, 300)}, Math.floor(interval));
		};

		function switchTo(mode){
			var currentMode = 'normal';
			$container.hasClass('classic') && (currentMode='classic');
			$container.hasClass('recommended') && (currentMode='recommended');
			$container.removeClass('normal classic recommended').addClass(mode);

			if(mode=='classic'){
				$stream.find("li.big .figure.grid > img").each(function(){
					$(this).attr("src", $(this).attr('data-src'));
				});
			}

			if($.browser.msie) $.infiniteshow.option('prepare',1000);
			var feed = $("a.current[data-feed]").attr('data-feed');
			if(mode != 'recommended') {
				$.cookie.set('timeline-view',mode,9999);
				$.infiniteshow.option('prepare',4000);
			}else{
				$.infiniteshow.option('prepare',8000);				
			}

		};

        var feed = $("a.current[data-feed]").attr('data-feed');
        mixpanel_log('Timeline', { 'type': feed, 'view': mode });
	};

	$notibar = $('.new-content');
	$notibar.off('click').on('click', function(){
		setTimeout(function(){
			$.jStorage.flush();
		    //$.jStorage.deleteKey('fancy.prefetch.stream.new');
		    //$.jStorage.deleteKey('first-'+vid+'-featured.new');
		    //$.jStorage.deleteKey('first-'+vid+'-all.new');
		    //$.jStorage.deleteKey('first-'+vid+'-following.new');
			$stream.trigger('itemloaded');

		},100);
	});

	// category selection
	var $categorytabs = $('.sorting a[data-category]');
	var init_ts = $stream.attr("ts");
	var ttl  = 5 * 60 * 1000;

	$categorytabs.click(function(e){
		var $el = $(e.currentTarget);
		var category = $el.attr("data-category")||"all";
		$('.sorting a.current').html($el.text()+" <i class='arrow'></i><i class='arrow2'></i>");
		$('.sorting .trick').trigger("click");
		switchTab('featured',category);
		e.preventDefault();
	});

	// feed selection
	var $feedtabs = $('.menu a[data-feed]');

	$feedtabs.click(function(e){
		var $el = $(e.currentTarget);
		var feed = $el.attr("data-feed")||"featured";
		$('.menu a.current').removeClass("current");
		$(this).addClass('current');
		window.st = new Date().getTime();
		if( $(this).hasClass('_prefetching') ){
			$(this).addClass('_switchNow');
		}else{
			switchTab(feed);
		}
		e.preventDefault();
	});

	if( $("a.current[data-feed]").attr('data-feed') == 'featured'){
		prefetchTab('recommended');
	}else{
		prefetchTab('featured');
	}

	$(".mn-home").click(function(e){
		var feed = "featured";
		$('.menu a.current').removeClass("current");
		$('.menu a[data-feed=featured]').addClass('current');
		switchTab(feed);
		e.preventDefault();
	})

	function prefetchTab(feed, category){
		if(!category) category = 'all';
		var result = $.jStorage.get('first-'+vid+'-'+feed+"-"+category+'.new');
		if(!result){
			$feedtabs.filter("[data-feed="+feed+"]").addClass('_prefetching');
			$.ajax({
				url : '/_featured_feed?feed='+feed+'&category='+category,
				dataType : 'html',
				success : function(data, st, xhr) {
					result = data;
					$.jStorage.set('first-'+vid+'-'+feed+'-'+category+'.new', result, {TTL:5*60*1000});
					if( $feedtabs.filter("[data-feed="+feed+"]").hasClass('_switchNow') ){
						$feedtabs.filter("[data-feed="+feed+"]").removeClass('_switchNow');
						switchTab(feed);
					}
				}
				,complete : function(){
					$feedtabs.filter("[data-feed="+feed+"]").removeClass('_prefetching');
				}
			});			
		}
	}

	function switchTab(feed, category){
		if(!category) category = "all";
		$categorytabs.filter(".active").removeClass("active");

		$.jStorage.deleteKey("fancy.prefetch.stream.new");

		var $currentTab = $categorytabs.filter("[data-category="+category+"]");

		$currentTab.addClass("active");

		$url = $('a.btn-more').hide();
		$win = $(window);

		var result = null, resultFromCache = false;
		$wrapper.addClass("wait");

		// hide notibar if it showing
		$notibar.hide();
		$stream.attr('ts','').data('feed-url', '/user-stream-updates?feed='+feed+'&category='+category);
		var loc = "featured."+feed+"."+category;
		var keys = {
			timestamp : 'fancy.home.timestamp.'+loc,
			stream  : 'fancy.home.stream.'+loc,
			latest  : 'fancy.home.latest.'+loc,
			nextURL : 'fancy.home.nexturl.'+loc
		};

		result = $.jStorage.get('first-'+vid+'-'+feed+"-"+category+'.new');

		var swapContent = function(){
			if(!result){
				setTimeout(swapContent,20);
				return;
			}

			if($wrapper.hasClass("swapping")) return;
			$wrapper.addClass("swapping");
			$stream.find(">li").detach();

			var $sandbox = $('<div>'),
		    $contentBox = $('#content ol.stream'),
			$next, $rows;

			$sandbox[0].innerHTML = result.replace(/^[\s\S]+<body.+?>|<((?:no)?script|header|nav)[\s\S]+?<\/\1>|<\/body>[\s\S]+$/ig, '');
			$next = $sandbox.find('a.btn-more');
			$rows = $sandbox.find('#content ol.stream > li');

			$contentBox.append($rows);
			if(window.Modernizr && Modernizr.csstransitions )	$rows.css('opacity',0);

			$stream.trigger('itemloaded');

			// get fancyd state if the result comes from cache
			(function(){
				if(!resultFromCache) return;

				var ids = [];
				$rows.each(function(){
					var tid = this.getAttribute('tid');
					if(tid) ids.push(tid)
				});

				if(!ids.length) return;

				$.ajax({
					type : 'GET',
					url  : '/user_fancyd_things.json',
					data : {object_ids:ids.join(',')},
					dataType : 'json',
					success : function(json){
						var ids = {};

						$.each(json, function(i,v){ ids[v.object_id] = v.id });
						$rows.each(function(){
							var $this = $(this), btn, rtid;
							if(rtid=ids[this.getAttribute('tid')]) {
								btn = $this.find('a.button.fancy').attr('rtid', rtid).toggleClass('fancy fancyd').get(0);
								if(btn) btn.lastChild.nodeValue = gettext("Fancy'd");
							} else {
								btn = $this.find('a.button.fancyd').removeAttr('rtid').toggleClass('fancy fancyd').get(0);
								if(btn) btn.lastChild.nodeValue = gettext("Fancy");
							}
						});
					}
				});
			})();

			if ($next.length) {
				if(!$url[0]){
					$url = $("<div class='pagination' style='display:none'><a href='' class='btn-more' ts='' ><span>Show more...</span></a>").appendTo($("#content")).find("a.btn-more");
				}
				url = $next.attr('href');
				$url.attr({
					'href' : $next.attr('href'),
					'ts'   : $next.attr('ts')
				});
				$stream.attr("ts",$currentTab.data("ts")||init_ts);
				$(window).trigger("prefetch.infiniteshow");
			} else {
				url = ''
				$url.attr({
					'href' : '',
					'ts'   : ''
				});
			}

			var feedName = "Everything";

			slideshow_request_url = '/home_slideshow.json?new-timeline';
			if(feed){
				if(feed=='recommended') feedName = 'Recommended';
				else feedName = 'Featured'
				slideshow_request_url += "&feed="+feed;
				if(add_thing) slideshow_request_url += "&add_thing="+add_thing;

			}else if( category && category != 'all'){
				slideshow_request_url += '&category='+category;
				feedName = $categorytabs.filter('[data-category='+category+']').text();
			}

			slideshow_header = '<b>'+gettext("Timeline")+'</b><span class="icon arrow"></span> '+gettext(feedName);

			Fancy.slideshow.reset();

			$wrapper.removeClass("wait");
			$wrapper.removeClass("swapping");
		}

		var done = function(){
			//setTimeout(function(){$('#content ol.stream > li').css('opacity',1)},500);
			$(window).trigger("prefetch.infiniteshow");
			if(feed=='recommended'){
				$(window).trigger("scroll.infiniteshow");
			}
		}

		showLoading();

		var mode = null;
		if(feed=='recommended'){
			$btns.find('a.current').removeClass('current').end().filter('.recommended').find("a").addClass('current');
			mode = 'recommended';
		} else if($container.hasClass('recommended')){
			var view = $.cookie.get('timeline-view')||'classic';
			if(view == 'recommended') view = 'classic';
			$btns.find('a.current').removeClass('current').end().filter('.'+view).find("a").addClass('current');				
			mode = view;
		}

		if(result){
			resultFromCache = true;
			$stream.trigger("changeloc");
			$wrapper.off('before-fadein').on('before-fadein', swapContent);
			$wrapper.off('after-fadein').on('after-fadein', done);
			$wrapper.trigger("redraw", mode);
		} else {
			$.ajax({
				url : '/_featured_feed?feed='+feed+'&category='+category,
				dataType : 'html',
				success : function(data, st, xhr) {
					result = data;
					$.jStorage.set('first-'+vid+'-'+feed+'-'+category+'.new', result, {TTL:5*60*1000});
				},
				error : function(xhr, st, err) {
					url = '';
				},
				complete : function(){					
					$stream.trigger("changeloc");
					$wrapper.off('before-fadein').on('before-fadein', swapContent);
					$wrapper.off('after-fadein').on('after-fadein', done);
					$wrapper.trigger("redraw", mode);
				}
			});
		}

		$.cookie.set('timeline-feed',feed,9999);
		$.cookie.set('timeline-category',category,9999);
	}

	$stream.on('changeloc',function(){
		var feed = ($feedtabs.filter(".current").attr("data-feed")||"featured");
		$stream.attr("loc", "featured."+feed+'.'+($categorytabs.filter(".active").attr("data-category")||"all") );		
		if (feed=='recommended') {
			$('.viewer li.classic, .viewer li.normal').hide();
		}else{
			$('.viewer li.classic, .viewer li.normal').show();
		}
	})

	$(window).load(function(){
		$(window).trigger("prefetch.infiniteshow");
	})
	$(window).unload(function(){
		$.jStorage.flush();
	});

	$stream.find('select[name=option_id]').on('change', function(event) {
		var $this = $(this);
		var $selectedOption = $this.children('option:selected');
		var $quantitySelectTags = $this.siblings('select[name=quantity]');
		var remainingQuantity = parseInt($selectedOption.attr('remaining-quantity'));

		var currentlySelectedQuantity = parseInt($quantitySelectTags.val());
		if (currentlySelectedQuantity > remainingQuantity) {
			currentlySelectedQuantity = remainingQuantity;
		}
		$quantitySelectTags.empty();
		for (var i=1; i<=remainingQuantity && i<=10; i++) {
			$quantitySelectTags.append('<option value="' + i + '">' + i + '</option>');
		}
		$quantitySelectTags.val(currentlySelectedQuantity);
	});

	$stream
		.on('click', 'input[type="text"][readonly],textarea[readonly]', function(event){
			event.preventDefault();
			$(this).focus().select();
		})
		.on('keyup', 'input[name="email-recv"],textarea[name="email-msg"]', function(event){
			var $email = $(this).closest('.email'), recv = $.trim($email.find('input[name="email-recv"]').val()), msg = $.trim($email.find('textarea').val()), $btn = $email.find('button');
			var emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

			$btn[0].disabled = !(emailRegEx.test(recv) && msg);
		})
		.on('click', 'button[name="email-send"]', function(event){
			var $this = $(this);
			var $email = $this.closest('.email'), recv = $.trim($email.find('input[name="email-recv"]').val()), msg = $.trim($email.find('textarea').val());
			var $li = $email.closest('li'), tid = $li.attr('tid'), params;
			var emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
			if (!emailRegEx.test(recv)) return;

			if ($this.hasClass('loading')) return;
			$this.addClass('loading');

			params = {
				type : 'nt',
				url  : $li.find('input[name="share-link"]').val(),
				name : $.trim($li.find('figcaption > a').text()),
				oid  : $li.attr('tid'),
				ooid : $li.attr('tuserid'),
				emails : recv,
				message : msg
			};

			$.post('/share-with-someone.json', params)
				.then(function(data){
					alert('Sent!');
					$li.removeClass('active').find('.opened').removeClass('opened').end().find('.show_share').hide();
				})
				.always(function(){
					$this.removeClass('loading');
				});
		})
		.on('click', '.via > .more', function(event){
			event.preventDefault();
			$(this).closest('.via').toggleClass('show');
		})
		.on('mouseover', '.via > .others > a', function(event){
			var $em = $(this).find('em');
			$em.css('margin-left',-($em.width()/2)-13+'px');
		})
		.on('click', '.select-boxes2', function(event){
			event.preventDefault();
			$(this).closest('.customize').toggleClass('opened');
		})
		.on('keyup', 'input[name="embed-width"]', function(event){
			updateEmbedOption($(this).closest('li'));
		})
		.on('click', 'input[name="embed-info"]', function(event){
			updateEmbedOption($(this).closest('li'));
		})
		.on('click', '.show-code', function(event){
			$(this).parent().hide().next('code').show();
			updateEmbedOption($(this).closest('li'));
		})
		.on('click', '.sns > .via a:not(.more)', function(event){
			event.preventDefault();
			var $this = $(this);

			if ($this.is('.fb') && window.FB) {
				var params = {
					method: 'feed',
					link: $this.closest('.popup').data('url')||$this.data('url'),
					name: $this.data('text'),
					caption: '',
					description: ''
				};
				FB.ui(params, $.noop);
			} else {
				var w = $this.data('width') || 620, h = $this.data('height') || 380, t = Math.max(Math.round((screen.availHeight-h-80)/2), 20), l = Math.max(Math.round((screen.availWidth-w)/2), 5);
				try{ window.open($this.attr('href'), $this.attr('class'), 'top='+t+',left='+l+',width='+w+',height='+h+',menubar=no,status=no,toobar=no,location=no,personalbar=no,scrollbars=no,resizable=yes').focus(); }catch(e){};
			}
		});

	function updateEmbedOption($li) {
		var $thumb = $li.find('.embed-thum'), $options = $li.find('input[name="embed-info"]'), types=[];

		$options.each(function(){
			this.checked ? $thumb.addClass(this.value)&&types.push(this.value) : $thumb.removeClass(this.value);
		});

		var width = parseInt($li.find('input[name="embed-width"]').val(), 10)||'';

		var code = '<script src="//'+location.hostname+'/embed.js?v=150608" class="fancy-embed" async data-id="'+$li.attr('tid')+'"';
		if(window.viewer) code += ' data-ref="'+viewer.username+'"';
		if(types.length) code += ' data-type="'+types.join(',')+'"';
		if(width) code += ' data-width="'+width+'"';
		code += '></script>';

		$li.find('textarea[name="embed-code"]').val(code);
	}

	var closePopupTimer = null;
	$(window).scroll(function(){
		if(closePopupTimer) clearTimeout(closePopupTimer);
		closePopupTimer = setTimeout(function(){
			var scrollTop = $(window).scrollTop();
			$("ol.stream li.active").each(function(){
				var $this = $(this);
				if( $this.offset().top + $this.height() < scrollTop || $this.offset().top > scrollTop + $(window).height()){
					$this.find(".show_cart.opened, .menu-container.opened").removeClass('opened').end().removeClass("active");
					$this.find(".menu-container .show_share, .menu-container .show_someone").hide();
				}
			})
		},200);
	});
})();
