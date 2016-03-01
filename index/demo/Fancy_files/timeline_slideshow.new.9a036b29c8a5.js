/**
 * Timeline slideshow for fancy
 * @author taggon
 **/

jQuery(function($){
	var
	    $win  = $(window),
		$html = $('html:first'),
	    $body = $('body:first'),
		$box  = $('#slideshow-box'),
		$img_list   = $('#img-list'),
		$slideshow  = $('#slideshow'),
		$current    = $img_list.find('span.current'),
		$figure     = $slideshow.find('>figure'),
		$figure_img = $figure.find('>img:first'),
		$slide_btns = $('#slideshow-buttons'),
		$footer = $box.find('footer:first'),
  	    curPage = 1, // current page
	    itemCount = 11, // number of thumbnails per page
		rowCount = 4, // row count
		totalCount = +$img_list.find('.total').text(),
		req_url = window.slideshow_request_url || '/user_fancyd_slideshow.json',
		dummy_img = '/_ui/images/common/blank.gif',
		SLIDE_INTERVAL = 7000, // interval
		show_timer = null,
		stop    = true,
		useLoop = false,
		imgSize = 100,
		movingImage = false;
	
	if(!window.Fancy) window.Fancy = {};
	if(!window.Fancy.slideshow) Fancy.slideshow = {};

	$img_list
		.addClass('first')
		.on('click', 'li > a', function(){
			var $this = $(this),
			    thing = $this.data('thing'),
			    $holder = $slideshow.find('.img-wrap._real img.holder'),
			    offset  = $this.data('offset');

			if (!thing) return;

			var img_src = thing.image_url,
				img_h   = thing.image_url_height,
				img_w   = thing.image_url_width,
				slideH  = $slideshow.height(),
				speed   = 300,
				animInfo  = {},
				maxWidth  = 880, maxHeight = 0,
				maxHeight = slideH-90,
				marginTop = 0;

			if ($this.hasClass('selected') || typeof(offset)=='undefined') return false;
			
			$this
				.closest('ul')
 					.find('>li>a').removeClass('selected').end()
				.end()
				.addClass('selected');

			$current.text(offset+1);
			$slideshow.removeClass('first last');
			if (offset == 0) {
				$slideshow.addClass('first');
			} else if (offset == totalCount - 1) {
				$slideshow.addClass('last');
			}

			if (img_w > maxWidth) {
				img_h = maxWidth/img_w * img_h;
				img_w = maxWidth;
			}
			if (img_h > maxHeight) {
				img_w = maxHeight/img_h * img_w;
				img_h = maxHeight;
			}

			var animateObj = {
				//width  : img_w+'px',
				//height : img_h+'px',
				opacity : 1
			};

			if (img_h) marginTop = (slideH - img_h)/2 ;
			
			animInfo = $slideshow.data('animation-info');
			if (animInfo && animInfo.$obj && animInfo.$obj[0] === this) speed -= animInfo.startTime||0;

			// cache next 2 images
			if (things[offset+2]) (new Image).src = things[offset+2].image_url_1280 || things[offset+2].image_url;
			if (things[offset+1]) (new Image).src = things[offset+1].image_url_1280 || things[offset+1].image_url;

			//$slide_btns.css('top', (img_h/2+10)+'px');


			var price = "";
			var isSSD = false;
			if(thing.sales){
				var price = parseInt(thing.sales[0].deal_price).toFixed(0) + '', regex = /(\d)(\d{3})([,\.]|$)/;
				var isSSD = thing.sales[0].is_sameday_delivery_item;
				while(regex.test(price)) price = price.replace(regex, '$1,$2$3');
			}
			
			$slideshow.find(".img-wrap._ghost").stop().remove();
			$slideshow.find(".img-wrap._real").clone().insertAfter( $slideshow.find(".img-wrap._real") )
					.addClass("_ghost").removeClass("_real")
					.animate( {opacity:0}, speed, function(){ $slideshow.find(".img-wrap._ghost").remove() });

			$slideshow
				//.addClass('loading')
				.data('animation-info', {$obj:$this, startTime:(new Date).getTime(), width:img_w, height:img_h})
				.removeClass('active')
				.find('.img-wrap._real')
					.css({marginLeft: -(img_w/2)+"px" , marginTop:Math.max(marginTop,0)+"px"})
					.find('img.holder')
						.addClass('loading')
						.prop('loaded', false)
						.data('offset', offset)
						//.filter('[src="'+img_src+'"]').attr('src',dummy_img).end()
						.attr('src', img_src)
						.css({'background-image':'url('+img_src+')', width: img_w+"px", height: img_h+"px", opacity:0})
						//.removeClass('loading')
						//.stop()
						//.animate(animateObj, speed, function(){ var t=this; setTimeout(function(){ $(t).trigger('ready') }, 0) })
					.end()
				.end()
				//.find('.img-wrap._real').stop().animate({marginTop : Math.max(marginTop/2,0)+'px'}, speed).end()
				.find('figcaption')
					.find('>a.title').attr('href', thing.url).text(thing.name||'').end()
					.find('>span').html((thing.sales?'<b class="price">$'+price+'</b>':'')+(isSSD?'<span class="daily"><em>'+gettext("Same-Day Delivery")+'<b></b></em></span>':'')+(thing.sales?' · ':'')+'<a href="/'+thing.user.username+'">'+thing.user.username+'</a>'+(thing.fancys>1?' + '+(thing.fancys-1):'')).end()
				.end()
				.find('a.fancy, a.fancyd')
					.removeClass('fancy fancyd')
					.addClass(thing["fancy'd"]?'fancyd':'fancy')
					.html(thing["fancy'd"]?"<i class='icon'></i>"+gettext("Fancy'd"):'<i class="icon"></i>'+gettext('Fancy'))
					.data('thing-offset', offset)
					.data('image-src', img_src)
					.attr('tid', thing.thing_id||thing.id)
					.attr('rtid', thing["fancy'd"]?(thing.rtid||thing.thing_id||thing.id):null )
					.attr('item_img_url', img_src)
					.attr('item_name', thing.name)
				.end()
				.find('a.add')
					.data('thing-offset', offset)
					.data('image-src', img_src)
					.attr('tid', thing.thing_id||thing.id)
					.attr('rtid', thing.rtid||null)
					.attr('item_img_url', img_src)
					.attr('item_name', thing.name)
				.end()
				.find('button.btn-share')
					.attr('uid', thing.user.id)
					.attr('tuser', thing.user.is_private?'':thing.user.username)
					.attr('price', thing.sales?price:'')
					.attr('reacts', thing.fancys>1?(thing.fancys-1):'' )
					.attr('tid', thing.thing_id||thing.id)
					.attr('tname', thing.name||null)
					.attr('timage', thing.image_url)
				.end()
				.find('a.btn-cart')
					.attr('data-id', thing.sales?thing.sales[0].sale_id:'')
				.end()
				.find('span.button')
					.attr('data-tid', thing.thing_id||thing.id)
					.show()
				.end()
				.find('#show-share').hide()
				.end();

				if( thing.external && thing.external.hermes){
					$slideshow
						.find(".img-wrap._real")
							.find("video").remove().end()
							.append('<video autoplay loop style="position:absolute;left:0;top:0;width:100%;height:100%;" poster="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGP6CQAA/wD8Wgiy6QAAAABJRU5ErkJggg=="><source src="'+thing.external.hermes.parameter1+'" type="video/mp4"></video>')
						.end()
						.find("figcaption")
							.find(">a.title").attr('href', thing.external.hermes.parameter2)
						.end();
				}else{
					$slideshow
						.find(".img-wrap._real video").remove();
				}

				if( thing.sales ) {
					$slideshow.find('a.btn-cart').show();

					var salesOption = null;
					if( thing.sales[0].options.length > 0 ) {
						salesOption = "";
						_.each(thing.sales[0].options, function(option) {
							var leftQtyStr = option.available_for_sale ? '' : ' - SOLD OUT';
							salesOption += '<option value="' + option.id + '" soldout="' + option.available_for_sale + '" remaining_quantity="' + option.quantity + '">';
							salesOption += option.option + leftQtyStr + '</option>';
						});
					}

					var quantityOption = '';
					if( thing.sales[0].available_for_sale ) {
						_.times(10, function(i) {
							quantityOption += '<option value="' + (i+1) + '">' + (i+1) + '</option>';
						});
					} else {
						quantityOption += '<option value="1">1</option>';
					}
					if( salesOption && salesOption !== '') {
						$slideshow.find('select[name=option_id]').html(salesOption);
					} else {
						$slideshow.find('select[name=option_id]')
							.attr('disable', '')
							.html('<option>' + thing.name + '</option>');
					}
					$slideshow.find('select[name=quantity]').html(quantityOption);

					$slideshow.find('.sale-item-input .frm button.add_to_cart').remove();
					$slideshow.find('.sale-item-input .frm')
						.append('<button class="add_to_cart btns-green-embo" sii="' + thing.sales[0].sale_id + '" sisi="' + thing.sales[0].seller.id + '" tid="' + thing.id + '">Add to Cart</button>');
				}
				else $slideshow.find('a.btn-cart').hide();

			var tmpImg = new Image();
			tmpImg.onload = function(){
				$slideshow.find(".img-wrap._real").find("img.holder")
					.attr('src', img_src)
					.stop()
					.animate(animateObj, speed, function(){ var t=this; setTimeout(function(){ $(t).trigger('ready') }, 0) })
			}
			tmpImg.src = img_src

			if(thing.sales && thing.sales[0].show_ribbon && thing.sales[0].discount_percentage){
				if( thing.sales[0].remaining_quantity > 0)
					$slideshow.find('.img-wrap._real .left_num').html(thing.sales[0].remaining_quantity+" Left").show();
				else
					$slideshow.find('.img-wrap._real .left_num').html("Sold out").show();
			}else{
				$slideshow.find('.img-wrap._real .left_num').hide();
			}

			if(thing.sales && thing.sales[0].discount_percentage > 0){
				$slideshow.find('figcaption')
					.find('>span').html((thing.sales?'<b class="price">$'+price+' <small class="before">$'+thing.sales[0].fancy_price+'</small></b> <em class="percentage">'+Math.round(parseFloat(thing.sales[0].discount_percentage))+'% Off</em>':'')+(isSSD?'<span class="daily"><em>'+gettext("Same-Day Delivery")+'<b></b></em></span>':'')+(thing.sales?' · ':'')+'<a href="/'+thing.user.username+'">'+thing.user.username+'</a>'+(thing.fancys>1?' + '+(thing.fancys-1):'')).end()
			}

			if (thing["fancy'd"]) {
				$box.find('footer a[href=#F] > span').text(txtFancyUnFancy[1]);
			} else {
				$box.find('footer a[href=#F] > span').text(txtFancyUnFancy[0]);
			}

			return false;
		})
		.on('focus', 'li > a', function(){
			var $this = $(this),
			    offset = $this.data('offset'),
			    start  = $holder.eq(itemCount).data('offset'),
				end    = $holder.eq(itemCount*2-1).data('offset');

			if (offset < start) $holder.eq(itemCount).focus();
			else if (offset > end) $holder.eq(itemCount*2-1).focus();
		})
		.mouseenter(function(){
			$(this).children('a.prev,a.next').stop().show().css('opacity',0).fadeTo('normal', 0.6);
		})
		.mouseleave(function(){
			$(this).children('a.prev,a.next').stop().fadeOut();
		})
		.children('a.prev,a.next')
			.mouseover(function(){ $(this).stop().fadeTo('normal', 1) })
			.mouseout(function(){ $(this).stop().fadeTo('normal', 0.6) })
			.click(function(){
				var $this = $(this), $ul = $img_list.find('>ul'), prev, next, lastPage = Math.ceil(totalCount/itemCount);

				if ($ul.is(':animated') ) return false;
				if ((prev=$this.hasClass('prev')) && curPage == 1) return false;
				if ((next=$this.hasClass('next')) && curPage == lastPage) return false;

				if (prev) {
					setPage(curPage-1);
				} else if (next) {
					setPage(curPage+1);
				}

				return false;
			})
		.end();

	// slideshow
	var entered_on_slideshow = false, timer_to_hide_buttons = null;
	$slideshow
		.find('.img-wrap._real img.holder')
			.load(function(){ $(this).prop('loaded', true).trigger('ready') })
			.on('ready', function(){
				var $this = $(this);
				//if ($this.prop('loaded') && !$this.is(':animated')) {
				if (!$this.is(':animated')) {
					$this.removeClass('loading');
					$slideshow.removeClass('loading');
					//$this.hide().css('opacity','').stop().fadeIn();

					if (!stop) play(true);
				}
			})
		.end()
		.on({
			mouseenter : function(){
				entered_on_slideshow = true;
				clearTimeout(timer_to_hide_buttons);
				$(this).find('a.prev,a.next').stop().show().css('opacity',0).fadeTo('normal', 0.6);
				timer_to_hide_buttons = setTimeout(function(){ $slideshow.mouseleave(); }, 5000);
			},
			mouseleave : function(){
				entered_on_slideshow = false;
				clearTimeout(timer_to_hide_buttons);
				$(this).find('a.prev,a.next').stop().fadeOut();
			},
			mousemove : function(){
				if (entered_on_slideshow) return;
				$(this).mouseenter();
			},
			click : function(event){
				return;
			}
		})
		.on('do:close', function(){
			$box.removeClass('slide');
		})
		.find('a.prev,a.next')
			.mouseover(function(){ $(this).stop().fadeTo('normal', 1) })
			.mouseout(function(){ $(this).stop().fadeTo('normal', 0.6) })
			.click(function(){
				if(movingImage) return;
				movingImage = true;

				var $this = $(this), $selected, $li, $a, idx, prev = $this.hasClass('prev'), next = $this.hasClass('next');


				if (prev && $slideshow.hasClass('first')) {
					movingImage=false; 
					return false;
				}
				if (next && $slideshow.hasClass('last')) {

					if (!useLoop){ 
						movingImage=false;
						return false;
					}
					if (curPage > 1) {
						$img_list.one('paged', function(){ $img_list.find('li > a').eq(11).click(); movingImage=false; });
						setPage(1);
					} else {
						$img_list.find('li > a').eq(11).click();
						movingImage=false;
					}
					return false;
				}

				$li = $img_list.find('li');
				$selected = $li.find('>a.selected');
				if (!$selected.length) $selected = $li.find('>a').eq(itemCount).addClass('selected');
				idx = $li.index($selected.parent());

				function a_click(){ $a.click(); movingImage=false; };

				if (prev) {
					$a = $li.eq(idx-1).children('a');
					if(idx == itemCount) {
						$img_list.one('paged', a_click);
						setPage(curPage-1);
					} else {
						a_click();
					}
				} else {
					$a = $li.eq(idx+1).children('a');
					if(idx == itemCount*2-1) {
						$img_list.one('paged', a_click);
						setPage(curPage+1);
					} else {
						a_click();
					}
				}

				return false;
			})
		.end()
		.delegate('.btn-share', 'click', function(e){
			e.preventDefault();
			clearTimeout(show_timer);
		})
		.delegate('.btn-cart', 'click', function(e){
			e.preventDefault();
			clearTimeout(show_timer);
			$slideshow.find('.show_cart').addClass('opened');
		})
		.delegate('.show_cart .trick', 'click', function(e){
			e.preventDefault();
			clearTimeout(show_timer);
			$slideshow.find('.show_cart').removeClass('opened');
		});

	// create new thumbnail holders
	var itemHTML = '<li ><a class="blank" style="width:##SIZE##px;height:##SIZE##px"><img /></a></li>';
	function createHolders(num) {
		if (num <= 0) return $(null);

		var html = '', i;
		for (i=0; i < num; i++) html += itemHTML.replace(/##SIZE##/g,imgSize);

		return $(html).find('img').load(holderOnload).end();
	};
	function holderOnload(){
		var w = this.width, h = this.height, p = this.parentNode, pw = p.offsetWidth, ph = p.offsetHeight;
		if (!w  || !h) return;
		if (w > h) {
			this.width  = ph/h * w;
			this.height = ph;
		} else {
			this.height = pw/w * h;
			this.width  = pw;
		}

		this.style.marginLeft = parseInt((pw-this.width)/2)+'px';
		this.style.marginTop  = parseInt((ph-this.height)/2)+'px';

		p.className = '';
	};

	// create thumbnail holders
	$img_list.find('>ul').empty().append(createHolders(itemCount*3));

	// set page
	var $holder = $img_list.find('li > a'), things=[];
	function setPage(page) {
		function action() {
			var lastPage = Math.ceil(totalCount/itemCount), reqCount = 0, cursor, speed = 'normal', margin = -((imgSize+6)*11-2);

			drawPage(page);

			(page == 1)?$img_list.addClass('first'):$img_list.removeClass('first');
			(page == lastPage)?$img_list.addClass('last'):$img_list.removeClass('last');

			function trigger_paged(){ setTimeout(function(){ $img_list.trigger('paged') }, 10); };

			if (page < curPage) {
				$img_list.find('>ul')
					.animate({'margin-left':0}, speed, function(){
  						$holder.slice(itemCount*2).parent().remove();
  						$holder = $(this).prepend(createHolders(itemCount)).css('margin-left', margin+'px').find('li>a');
						trigger_paged();
					});
			} else if (page > curPage) {
				$img_list.find('>ul')
					.animate({'margin-left':(margin*2)+'px'}, speed, function(){
  						$holder.slice(0, itemCount).parent().remove();
  						$holder = $(this).append(createHolders(itemCount)).css('margin-left', margin+'px').find('li>a');
						trigger_paged();
					});
			} else {
				trigger_paged();
			}

			if (curPage === page) setTimeout(function(){ $holder.eq(itemCount).click() }, 100);

			curPage = page;
		};

		var start = (page-1)*itemCount, end = start + itemCount - 1, offset = Math.max(start, things.length), cursor;

		if ((things.length == (totalCount||1)) || (things.length >= page*itemCount)) return action();
		if (offset && !things[offset-1].next_cursor){
			movingImage=false
			return;
		}

		cursor = (page == 1) ? '' : things[offset-1].next_cursor;

		requestData(cursor, offset, function(){ setPage(page) });
	};

	function drawPage(page) {

		var start = itemCount;

		$figure.removeClass('initializing');

		if (page < curPage) {
			start = 0;
		} else if (page > curPage) {
			start = itemCount * 2;
		}
		for(var i=0,offset; i < itemCount; i++) {
			offset = i + itemCount*(page-1);
			if(!things[offset]) continue;
			$holder.eq(start+i)
				.attr('href', things[offset].url)
				.data('offset', offset)
				.data('thing', things[offset])
				.find('img')
					.removeAttr('width')
					.removeAttr('height')
					.attr('src', dummy_img)
					.attr('src', things[offset].thumb_image_url_200||things[offset].image_url);
		}
	};

	function reset(){
		req_url = window.slideshow_request_url || '/user_fancyd_slideshow.json';
		$img_list.off('paged').find('>ul').empty().append(createHolders(itemCount*3));

		// set page
		$holder = $img_list.find('li > a');
		things=[];

		$win.resize();
		setPage(curPage = 1);
	};
	Fancy.slideshow.reset = reset;

	function requestData(cursor,offset,callback) {
		param = 'thumbs=200'+(cursor?'&cursor='+cursor:'')+'&offset='+offset+(window.owner_id?'&user_id='+window.owner_id:'');

		$.ajax({
			url : req_url + (req_url.indexOf('?')<0?'?':'&') + param,
			dataType : 'json',
			success : function(data) {
				var coll = data.response.collection||data.response.posts, offset = +data.response.offset;
				for(var i=0,j=0,c=coll.length; i < c; i++) {
					if (coll[i].type != 'thing') continue;
					if (!coll[i].image_url_1280_width && !coll[i].image_url_width) continue;
					things[offset+j] = coll[i];
					j++;
				}
				if (!data.response.next_cursor) {
					totalCount = things.length;
					$img_list.find('.total').text(totalCount);
				} else {
					things[offset+j-1].next_cursor = data.response.next_cursor;
				}

				if (typeof data.response.top_cursor != "undefined" && data.response.top_cursor==null){movingImage=false;return;}
                if (totalCount == 0){movingImage=false;return;}
				
                setTimeout(callback, 10);
			}
		});
	};

	// Fancy/Unfancy button
	$box.find('a.fancy, a.fancyd')
		.on({
			click : function(){ clearTimeout(show_timer); },
			fancy : function(){
				var $this = $(this), offset = $this.data('thing-offset'), rtid = $this.attr('rtid');

				if (!things[offset]) return;
				things[offset]["fancy'd"] = true;
				if (rtid) things[offset].rtid = rtid;
				$this.html("<i class='icon'></i>"+gettext("Fancy'd"));
			},
			unfancy : function(){
				var $this = $(this), offset = $this.data('thing-offset');

				if (!things[offset]) return;
				things[offset]["fancy'd"] = false;
				delete things[offset].rtid;
				$this.html("<i class='icon'></i>"+gettext("Fancy"));
			}
		})
		.on('mouseover', function(){
			if ($(this).hasClass('fancyd')){
				$(this).html("<i class='icon'></i>"+gettext("Unfancy"));
			}
		})
		.on('mouseout', function(){
			if ($(this).hasClass('fancyd')){
				$(this).html("<i class='icon'></i>"+gettext("Fancy'd"));
			}
		});

	// Show fancy button
	/*$slideshow.find('img.holder')
		.mouseover(function(event){
			if (event.target != this || $slideshow.hasClass('loading')) return;
			$slideshow.find('a.button').show();
		})
		.mouseout(function(event){
			var $rel = $(event.relatedTarget);
			if ($rel.is('a.fancy,a.fancyd') || $rel.closest('a').is('.fancy,.fancyd')) return;
			$slideshow.find('a.button').hide();
		});*/

	// extract Play/Pause text
	var txtPlayPause = $box.find('footer a[href="#P"] > span').text().split('/');
	$box.find('footer a[href="#P"] > span').text(txtPlayPause[1]);

	// extract Fancy/Unfancy text
	var txtFancyUnFancy = $box.find('footer a[href="#F"] > span').text().split('/');
	$box.find('footer a[href="#F"] > span').text(txtFancyUnFancy[0]);

	// Fullscreen
	if($.support.fullscreen) {
		$('#btn-fullscreen').click(function(){
			$box.fullScreen({'callback':function(){ $win.resize() }});
			return false;
		});
	}

	// Tooltip
	var $a_tooltip = $('#btn-fullscreen');
	$a_tooltip.each(function(){
		var $this = $(this);
		$this.attr('title', $this.text()).html('');
	});
	if ($a_tooltip.tipsy) $a_tooltip.tipsy({fade:false});

	var _resize_timer = null;
	$win.resize(function(){
	    
	    var width = $win.innerWidth();

		if ($win.innerHeight() < 700) {
			$box.addClass('tiny');
		} else {
			$box.removeClass('tiny');
		}

		clearTimeout(_resize_timer);
		_resize_timer = setTimeout(function(){
			try{
				$slideshow.data('animation-info').$obj.removeClass('selected').click();
			}catch(e){}
		}, 300);

		/*var listTop  = $img_list[0].offsetTop, slideTop = $slideshow.offset().top;

		if ($box.hasClass('tiny')) {
			$slideshow.height(listTop);
		} else {
			$slideshow.height(listTop - slideTop - parseInt($slideshow.css('padding-top')) - 10);
		}*/
		$slideshow.height( $win.innerHeight() - 125);

		imgSize = Math.ceil(width/11) - 6;

		$img_list.height( imgSize+49)
			.find("a.prev, a.next").height(imgSize).end()
			.find("li a").width(imgSize).height(imgSize).find("img").each(holderOnload).end().end()
			.find("ul").css('margin-left', (-((imgSize+6)*11-2))+'px').end()
	});

	// bottom controls
	function pause(slient){
		stop = true;
		clearTimeout(show_timer);
		$box.find('footer a[href=#P] > span').text(txtPlayPause[0]);

		if (slient) return;

		var anim_info = $slideshow.data('animation-info');
		if (!anim_info) return;

		$slide_btns.removeClass('play hidden animation').addClass('pause');
		if ($slide_btns.hasClass('compat')) {
			$slide_btns.stop().hide().css({opacity:''}).fadeIn(200).delay(300).fadeOut(300);
		} else {
			setTimeout(function(){ $slide_btns.addClass('animation') }, 10);
			setTimeout(function(){ $slide_btns.addClass('hidden') }, 500);
		}
	};
	function play(slient){
		stop = false;
		clearTimeout(show_timer);
		$box.find('footer a[href=#P] > span').text(txtPlayPause[1]);
		show_timer = setTimeout(function(){ $slideshow.find('a.next').click() }, SLIDE_INTERVAL);

		if (slient) return;

		var anim_info = $slideshow.data('animation-info');
		if (!anim_info) return;

		$slide_btns.removeClass('pause hidden animation').addClass('play');
		if ($slide_btns.hasClass('compat')) {
			$slide_btns.stop().hide().css({opacity:''}).fadeIn(200).delay(300).fadeOut(300);
		} else {
			setTimeout(function(){ $slide_btns.addClass('animation') }, 10);
			setTimeout(function(){ $slide_btns.addClass('hidden') }, 500);
		}
	};

	var txtLoopUnloop = $box.find('footer a[href=#L] > span').text().split('/');

	$box.find('footer').find('a')
		.filter('[href=#L]').find('>span').text(txtLoopUnloop[0]).end().end()
		.click(function(){
			var $this = $(this);

			if (!/#([A-Z])/.test($this.attr('href'))) return false;

			switch(RegExp.$1) {
				case 'P': stop?play():pause(); break;
				case 'F':
					$slideshow.find('.fancy, .fancyd').trigger('click');
					break;
				case 'A':
					$slideshow.find('.add').trigger('click');
					break;
				case 'B':
					$slideshow.find('.btn-cart').trigger('click');
					break;
				case 'L':
					//$box.find('footer a[href=#L] > span').text(txtLoopUnloop[(useLoop=!useLoop)?1:0]);
					break;
			}

			return false;
		});

	function activate() {
		try{ $.infiniteshow.option('disabled', true) }catch(e){};

		// Keyboard navigation
		$(document).on('keydown.slideshow', function(event){
			switch(event.keyCode){
				case 27: // ESC
					if( $.dialog('add-to-list').showing() ){
						$.dialog('add-to-list').close();
					}else{
						deactivate();
					}
					break;
				case 37: // left
				case 74: // 'J'
					$slideshow.find('a.prev').click();
					break;
				case 39: // right
				case 75: // 'K'
					$slideshow.find('a.next').click();
					break;
				case 70: // 'F'
					$box.find('a[href=#F]').click();
					break;
				case 72: // 'H'
					$box.find('a[href=#H]').click();
					break;
				case 76: // 'L'
					//$box.find('a[href=#L]').click();
					break;
				case 80: // 'P'
					$box.find('a[href=#P]').click();
					break;
				case 65: // 'A'
					$box.find('a[href=#A]').click();
			}
		});

		$html.addClass('slideshow');
		$body.addClass('slideshow');

		$box.find("header h1").html(slideshow_header||"");
		$slideshow.show();

		$win.resize();
		setPage(curPage=1);
	};

	function deactivate() {
		try{ $.infiniteshow.option('disabled', false) }catch(e){};

		$win.off('scroll.slideshow resize.slideshow');
		$(document).off('keydown.slideshow');

		$html.removeClass('slideshow');
		$body.removeClass('slideshow');

		clearTimeout(show_timer);
	};

	// Activation/Deactivation button
	$(document.body).on('click', '.slideshow-button a, a.btn-slideshow', function(){
		if ($(this).is('a.btn-slideshow')) {
			totalCount = 1000;
			$img_list.find('em').hide();
		}
		activate();
		return false;
	});

	$('#btn-exit').click(function(){
		deactivate();
		return false;
	});

	// detect svg support
	(function(){
		var img = new Image();
		img.onload = function(){ $slide_btns.removeClass('compat'); };
		img.setAttribute('src', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNzUiIGhlaWdodD0iMjc1Ij48L3N2Zz4%3D');
	})();
});

/**
 * @name		jQuery FullScreen Plugin
 * @author		Martin Angelov
 * @version 	1.0
 * @url			http://tutorialzine.com/2012/02/enhance-your-website-fullscreen-api/
 * @license		MIT License
 */
(function(e){function t(){var e=document.documentElement;return"requestFullscreen"in e||"mozRequestFullScreen"in e&&document.mozFullScreenEnabled||"webkitRequestFullScreen"in e}function n(e){e.requestFullscreen?e.requestFullscreen():e.mozRequestFullScreen?e.mozRequestFullScreen():e.webkitRequestFullScreen&&e.webkitRequestFullScreen()}function r(){return document.fullscreen||document.mozFullScreen||document.webkitIsFullScreen}function i(){document.exitFullscreen?document.exitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitCancelFullScreen&&document.webkitCancelFullScreen()}function s(t){e(document).on("fullscreenchange mozfullscreenchange webkitfullscreenchange",function(){t(r())})}e.support.fullscreen=t(),e.fn.fullScreen=function(t){if(!e.support.fullscreen||this.length!=1)return this;if(r())return i(),this;var o=e.extend({background:"#111",callback:function(){}},t),u=e("<div>",{css:{"overflow-y":"auto",background:o.background,width:"100%",height:"100%"}}),a=this;return a.addClass("fullScreen"),u.insertBefore(a),u.append(a),n(u.get(0)),u.click(function(e){e.target==this&&i()}),a.cancel=function(){return i(),a},s(function(e){e||(a.removeClass("fullScreen").insertBefore(u),u.remove()),o.callback(e)}),a}})(jQuery);
