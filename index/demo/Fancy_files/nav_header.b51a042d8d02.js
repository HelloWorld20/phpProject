
// top menu bar
jQuery(function($){
    var $nav = $('.v2 #navigation'), $cur = null, cur_len = 0, timer, sc, $container = $('.container:visible');
    var delay = 500;

    clearTimeout(timer);

    if( $nav.hasClass('hover_submenu') ){
        delay = 0;
        $nav
            .on('click', 'a[class^="mn"]', function(e){
                if( !$("#nav-search-form").hasClass("focus") ) return;

                e.preventDefault();
                if(!$(this).is(".mn-search")) $nav.find('li.gnb.active').removeClass('active').end().find('.search').removeClass('focus').find('input').val('');
                var $this = $(this);                
                clearTimeout(timer);

                if( !$this.is(".mn-menu, .mn-lang, .mn-noti, .mn-seller") ) return;

                timer = setTimeout(function(){
                    var sc = $(window).scrollTop();
                    $container.attr('position',sc);
                    $('html').addClass('fixed');
                    $container.css('top',-sc+'px');
                    $this.closest('#navigation').find('.gnb').removeClass('active').end().end().closest('li.gnb').addClass('active');                    
                }, delay);
                
            })
            .on('mouseover focus', 'a[class^="mn"]', function(e){

                if( $("#nav-search-form").hasClass("focus")) return;

                var $this = $(this);                
                clearTimeout(timer);

                if( !$this.is(".mn-menu, .mn-lang, .mn-noti, .mn-seller") ) return;

                timer = setTimeout(function(){
                    var sc = $(window).scrollTop();
                    $container.attr('position',sc);
                    $('html').addClass('fixed');
                    $container.css('top',-sc+'px');
                    $this.closest('#navigation').find('.gnb').removeClass('active').end().end().closest('li.gnb').addClass('active');                    
                }, delay);
                
            })
            .on('mouseleave', 'li.gnb', function(){
                var $this = $(this);
                clearTimeout(timer);
                if( !$this.find(".mn-menu, .mn-lang, .mn-noti, .mn-seller").length ) return;
                if( !$this.hasClass('active') ) return;

                $('html').removeClass('fixed');
                $(window).scrollTop($container.attr('position'));
                $container.removeAttr('style');
                $this.closest('#navigation').find('.gnb').removeClass('active');
                $nav.find('[class^="menu-contain"], [class^="feed-"]').removeClass('show');
                $('html').removeClass('hover');
            })
            .on('mouseover focus', 'li.gnb span.trick', function(){
                var $this = $(this);
                clearTimeout(timer);
                if( !$this.closest('li.gnb').find(".mn-menu, .mn-lang, .mn-noti, .mn-seller").length ) return;
                if( !$this.closest('li.gnb').hasClass('active') ) return;

                $('html').removeClass('fixed');
                $(window).scrollTop($container.attr('position'));
                $container.removeAttr('style');
                $this.closest('#navigation').find('.gnb').removeClass('active');
                $nav.find('[class^="menu-contain"], [class^="feed-"]').removeClass('show');
                $('html').removeClass('hover');
            })
    }

    $('#notification-bar').on('after', function(){
        $nav.find('.trick').css('top',$('#header.v2').height()+'px').end();
    })

    $nav
        .find('.trick').css('top',$('#header.v2').height()+'px').end()
        .removeClass('without-js')
        .on('click', 'li.gnb', function(e){
            $this = $(this);
            if ($('#navigation').find('li.active').length<1){
                //$('.menu-contain-shop').removeClass('store');
                $(this).addClass('hover').siblings('li.hover').removeClass('hover');
                if ($(this).hasClass('_shop')) {
                    clearTimeout(timer);
                    timer = setTimeout(function(){            
                        $('html').addClass('hover');
                        $('.menu-contain-shop').addClass('show').removeClass('store');
                    },delay);
                }else if ($(this).hasClass('_store')) {
                    clearTimeout(timer);
                    timer = setTimeout(function(){            
                        $('html').addClass('hover');
                        $('.menu-contain-shop').addClass('show').addClass('store');
                    },delay);                
                }else{
                    $('.menu-contain-shop').removeClass('show').removeClass('store');
                }
            }
        })
        .on('mouseover focus', 'li.gnb', function(e){
            $this = $(this);
            if ($('#navigation').find('li.active').length<1){
                //$('.menu-contain-shop').removeClass('store');
                $(this).addClass('hover').siblings('li.hover').removeClass('hover');
                if ($(this).hasClass('_shop')) {
					clearTimeout(timer);
                    timer = setTimeout(function(){            
    					$('html').addClass('hover');
                        $('.menu-contain-shop').addClass('show').removeClass('store');
                    },delay);
                }else if ($(this).hasClass('_store')) {
					clearTimeout(timer);
                    timer = setTimeout(function(){            
    					$('html').addClass('hover');
                        $('.menu-contain-shop').addClass('show').addClass('store');
                    },delay);                
                }else{
                    $('.menu-contain-shop').removeClass('show').removeClass('store');
                }
            }
        })
        .on('mouseover', '.menu-contain-shop .shop, .menu-contain-shop .store', function(){
            clearTimeout(timer);
            if ($(this).hasClass('store')) {
                $nav.find('.mn-merchant').closest('li.gnb').addClass('hover');
            }else{
                $nav.find('.mn-shop').closest('li.gnb').addClass('hover');
            }        
        })
        .on('mouseleave', '.menu-contain-shop .shop, .menu-contain-shop .store', function(){
            clearTimeout(timer);
            timer = setTimeout(function(){$('.menu-contain-shop').removeClass('show');timer = setTimeout(function(){$('html').removeClass('hover');},400);},100);
            if ($(this).hasClass('store')) {
                $nav.find('.mn-merchant').closest('li.gnb').removeClass('hover');
            }else{
                $nav.find('.mn-shop').closest('li.gnb').removeClass('hover');
            }
        })
        .on('mouseleave', 'li.gnb', function(){
            $this = $(this);
            if ($(this).hasClass('_shop') || $(this).hasClass('_store')){
				clearTimeout(timer);
				timer = setTimeout(function(){$('.menu-contain-shop').removeClass('show');timer = setTimeout(function(){$('html').removeClass('hover');},400);},100);
            }else{
                $('.menu-contain-shop').removeClass('show');
				$('html').removeClass('hover');
            }
            $(this).removeClass('hover');
        })
        .on('click','.logo, .logo a',function(){
            if ($('body').hasClass('home')) {
				$(window).scrollTop(0);
				return false;
            }
        })
        .on('click','span.trick',function(){
			if ($('html').hasClass('fixed')) {
				$('html').removeClass('fixed');
				$(window).scrollTop($container.attr('position'));
				$container.removeAttr('style');
				$(this).closest('#navigation').find('.gnb').removeClass('active').end().find('.search').removeClass('focus').find('input').val('');
				setTimeout(function(){$nav.find('[class^="menu-contain"], [class^="feed-"]').removeClass('show');$('html').removeClass('hover');},100);
			}
        })
        .on('click','.add-web, .add-file',function(){
            $('html').removeClass('fixed');
            $(window).scrollTop($container.attr('position'));
            $container.removeAttr('style');
            $(this).closest('#navigation').find('.gnb').removeClass('active').end().find('.search').removeClass('focus').find('input').val('');
            setTimeout(function(){$nav.find('[class^="menu-contain"], [class^="feed-"]').removeClass('show');$('html').removeClass('hover');},100);
            $('#popup_container').addClass('add-fancy').show().css('opacity','1').find('.popup.add-fancy').removeClass('upload').removeClass('select').removeClass('info');
            if ($(this).hasClass('add-web')) {
                $.dialog('add-fancy').$obj.addClass('web');
                $.dialog('add-fancy').open();
            }else{
                $.dialog('add-fancy').$obj.addClass('upload');
                $.dialog('add-fancy').open();
            }
        })
        .on('click', 'a[class^="mn"]', function(e){            
            if ( $(this).hasClass('mn-menu') || $(this).hasClass('mn-lang') || $(this).hasClass('mn-you') || $(this).hasClass('mn-seller') || $(this).hasClass('mn-noti')) {
                if( $nav.hasClass('hover_submenu') && !$(this).hasClass('mn-you') ) return;

                e.preventDefault();
                
                if ( $(this).closest('li.gnb').hasClass('active') ){
                    $('html').removeClass('fixed');
                    $(window).scrollTop($container.attr('position'));
                    $container.removeAttr('style');
                    $(this).closest('#navigation').find('.gnb').removeClass('active');
                    $nav.find('[class^="menu-contain"], [class^="feed-"]').removeClass('show');$('html').removeClass('hover');
				    return false;
                }else{
					if ($('html').hasClass('fixed')){
						$(this).closest('#navigation').find('.gnb').removeClass('active').end().end().closest('li.gnb').addClass('active');
						if ($nav.find('.search').hasClass('focus') ) {
							$nav.find('.search').removeClass('focus').find('input').val('');
							$nav.find('.search').find('.trick').removeAttr('style');
						}
					}else{
        			    var sc = $(window).scrollTop();
						$container.attr('position',sc);
						$('html').addClass('fixed');
						$container.css('top',-sc+'px');
						$(this).closest('#navigation').find('.gnb').removeClass('active').end().end().closest('li.gnb').addClass('active');
					}
					return false;
                }
            }
            if ($(this).hasClass('mn-search') ){
                if ( $nav.find('.search').hasClass('focus') ){
                    $('html').removeClass('fixed');
                    $(window).scrollTop($container.attr('position'));
                    $container.removeAttr('style');
                    $(this).closest('#navigation').find('.gnb').removeClass('active').find('[class^="menu-contain"], [class^="feed-"]').removeClass('show');$('html').removeClass('hover');
                    $nav.find('.search').removeClass('focus').find('input').val('');
					$nav.find('.search').find('.trick').removeAttr('style');
                }else{
					if ($('html').hasClass('fixed')){
					}else{
						$nav.find('.search').find('.trick').css('top',$('#header.v2').height()+44+'px');
						var sc = $(window).scrollTop();
						$container.attr('position',sc);
						
						$('html').addClass('fixed');
						$container.css('top',-sc+'px');
					}
                    $(this).closest('#navigation').find('.gnb').removeClass('active').find('[class^="menu-contain"], [class^="feed-"]').removeClass('show');$('html').removeClass('hover');
                    $(this).closest('li.gnb').addClass('active');
                    $nav.find('.search').addClass('focus');
                    setTimeout(function(){ $nav.find('.search').find('input').focus(); },100);
                }
                return false;
            }
        })
        // for ipad - https://app.asana.com/0/369567867430/7653313519664
        .on('touchstart', 'a[href]', function(){
            var $this=$(this), path = $this.attr('href');
            if (path == '/' || path == '#' || $this.next('div')[0]) return;
            location.href = path;
        })
        .find('li > a').each(function(){
            var $this = $(this), path = $this.attr('href');
            if(path == '/' || path == '#') return;
            if(location.pathname.indexOf(path) == 0 && path.length > cur_len){
                $cur = $this;
                cur_len =  path.length;
            }
        });
        if($cur) $cur.addClass('current');
    
    
    // uploading files to add to Fancy
    var dlg_drop=$.dialog('drop-to-upload'), dlg_add=$.dialog('add-fancy'), $_drag_objs=$();

    if(!dlg_add.$obj.length || !dlg_drop.$obj.length) return;

    // load lists and categories
    $.ajax({
        type : 'get',
        url  : '/categories_lists.json?mbox=true',
        success : function(json){
            if(!json || !json.response) return;

            var i,c,r=json.response,cate,list,html='';

            // categories
            html = '';
            for(i=0,c=r.categories.length; i<c; i++){
                cate  = r.categories[i];
                html += '<li><label data-value="'+cate.key+'">'+cate.name.escape_html()+'</label></li>';
            }
            dlg_add.$obj.find('.lists-popout.category > ul').html(html);//.find('li:first-child').click();

            // lists
            html='';
            for(i=0,c=r.lists.length; i<c; i++){
                list  = r.lists[i];
                html += '<li><label data-value="'+list.id+'">'+list.title.escape_html()+'</label><input type="checkbox"></li>';
            }
            dlg_add.$obj.find('.lists-popout.lists > ul').html(html);//.find('li:first-child').click();

            // mbox
            if(r.mbox) $("li.gnb a.add-email").attr('target','_blank').attr('href','mailto:'+r.mbox);
        }
    });
    
    // add fancy dialog
    dlg_add.$obj
        .append('<iframe name="iframe_img_upload" frameborder="0" />') // we should use script to add iframe to workaround firefox
        .on({
            open : function(){
                $(this).find('img.photo').attr('src','');
            },
            close : function(){                
                var $this = $(this);
                $this.removeClass("web upload select info");
                $this.find('input:text').val('').end()
                    .find('select').each(function(){ this.selectedIndex = 0; }).end()
                    .find('form').trigger('reset').end()
                    .find('button:submit').disable(false).end();
            },
            tab : function(e, tab){
                var $this = $(this);
                $this.removeClass('web upload select info').addClass(tab);
                $this.find(".step.info").find(".error").removeClass("error");
            }
        })
        
        .on('click', 'button.cancel_', function(event){
            event.preventDefault();
            if($(this).hasClass('disabled')) return;
            dlg_add.close();
        })        
        .on('click', 'button.btn-add-note', function(event){
            event.preventDefault();
            $(this).hide().next('input:text').show();
        })        
        // Fetch images from web
        .find('.step.web')
            .find('input.url_').keydown(function(event){ if(event.which==13){event.preventDefault();$(this).closest('.step').find('.btn-blue-embo-fetch').click()} }).end()
            .find('.btn-blue-embo-fetch')
                .click(function(){
                    var $btn=$(this),$step=$btn.closest('.step'),$pg,$ind,url;

                    url = $step.find('input.url_').val().trim().replace(/^https?:\/\//i,'');
                    if(!url.length) return alertify.alert(gettext('Please enter a website address.'));

                    // hide buttons and show progress bar
                    $step.find('.btns-area').hide().end().find('.progress').show().end();
                    $pg  = $step.find('.progress-bar');
                    $ind = $pg.find('em').width(0).animate({'width':'70%'},1500);

                    function check(images, callback){
                        var fn=[], list=[], cur=80, step=30/images.length, timer;

                        function load(src){
                            var def = $.Deferred(), img = new Image();
                            img.onload = function(){
                                clearTimeout(timer);

                                cur += step;
                                if(cur > 100) cur = 100;
                                $ind.stop().animate({'width':cur+'%'},100);

                                if(this.width > 200 || this.height > 200) list.push({src:this.src, dimension: this.width+'x'+this.height});
                                def.resolve(this);
                            };
                            img.onerror = function(){
                                clearTimeout(timer);
                                def.reject(this);
                            };
                            img.src = src;
                            // 3 seconds timeout
                            timer = setTimeout(img.onerror, 3000);
                            return def;
                        };

                        for(var i=0,c=images.length; i < c; i++) fn[i] = load(images[i]);

                        $.when.apply($,fn).always(function(){
                            if(list.length){
                                dlg_add.$obj.trigger('tab','select');
                                dlg_add.center();
                                $step.siblings('.select').trigger('set.images',[list]);
                                $('#fancy_add-link').val('http://'+url);
                            }else{
                                alertify.alert(gettext("Oops! Couldn't find any good images for the page."));
                                dlg_add.$obj.trigger('tab','web');
                            }
                        });
                    };

                    if(/\.(jpe?g|png|gif)$/i.test(url)) return check(['http://'+url]);

                    // fetching images
                    $.ajax({
                        type : 'get',
                        url  : '/extract_image_urls.json?url='+encodeURIComponent(url),
                        dataType : 'json',
                        success  : function(json){
                            if(!json) return;
                            if(json.response){
                                check(json.response);
                            } else if(json.error && json.error.message){
                                alertify.alert(json.error.message);
                            }
                        },
                        complete : function(){
                            $step.find('.btns-area').show().end().find('.progress').hide().end();
                        }
                    });
                })
            .end()
        .end()
        // Upload local images
        .find('>.step.upload')
            .find('form')
                .on({
                    upload_begin : function(event){
                        $(this)
                            .find('>.btns-area').hide().end()
                            .find('>.progress').show().end();
                    },
                    upload_complete : function(event,json){
                        var $this = $(this);

                        $this.trigger('reset');

                        if(!json || typeof(json.status_code) == 'undefined') return;
                        if(json.status_code == 1){
                            $step3 = $this.closest('.popup').find('>.info');
                            if(json.image && json.image.url){
                                $step3.trigger('set.uploaded_image', [json.image]);
                                dlg_add.$obj.trigger('tab','info');
                                dlg_add.center();
                            } else {
                                alertify.alert(gettext('Something went wrong. Please upload again.'));
                            }
                        }else if(json.status_code == 0){
                            if(json.message) alertify.alert(json.message);
                        }
                    },
                    reset : function(){
                        $(this)
                            .find('>.btns-area').show().end()
                            .find('>.progress').hide().find('em').width(0);
                    },
                    submit : function(event,filelist){
                        var $this=$(this),$step=$this.closest('.step'),$indicator,file_form=this.elements['file'],file,progress_id,filename,extension;

                        if(!filelist) filelist = file_form.files || (file_form.value ? [{name:file_form.value}] : []);
                        if(filelist && filelist.length) file = filelist[0];

                        if(!file){
                            alertify.alert(gettext('Please select a file to upload'));
                            return false;
                        }

                        if(!/([^\\\/]+\.(jpe?g|png|gif))$/i.test(file.name||file.filename)){
                            alertify.alert(gettext('The image must be in one of the following formats: .jpeg, .jpg, .gif or .png.'));
                            return false;
                        }

                        filename  = RegExp.$1;
                        extension = RegExp.$2;

                        $indicator = $this.find('.progress-bar em').css('width','0.5%');

                        $this.trigger('upload_begin');

                        function onprogress(cur,len){
                            var prog = Math.max(Math.min(cur/len*100,100),0).toFixed(1);
                            $indicator.stop().animate({'width':prog+'%'},500);
                        };

                        if(!window.FileReader || !window.XMLHttpRequest) {
                            var null_counter = 0, completed = false;

                            progress_id = parseInt(Math.random()*10000);
                            document.cookie = 'X-Progress-ID='+progress_id+'; path=/';
                            window._upload_image_callback = function(json){ completed = true; $this.trigger('upload_complete',json); };

                            function get_progress(){
                                $.ajax({
                                    type : 'get',
                                    url  : '/get_upload_progress.json',
                                    data : {'X-Progress-ID':progress_id},
                                    dataType : 'json',
                                    success  : function(json){
                                        if(!json) return;
                                        if(json.uploaded + 1000 >= json.length) json.uploaded = json.length;
                                        onprogress(json.uploaded, json.length);
                                    },
                                    complete : function(xhr){
                                        if(completed || null_counter > 10) return;
                                        if(xhr.responseText == 'null') null_counter++;
                                        setTimeout(get_progress, 500);
                                    }
                                });
                            };
                            setTimeout(get_progress, 300);
                            return true;
                        }

                        // Here is ajax file upload
                        var reader = new FileReader(), xhr = new XMLHttpRequest();
                        xhr.upload.addEventListener('progress', function(e){ onprogress(e.loaded, e.total)}, false);
                        xhr.onreadystatechange = function(e){
                            if(xhr.readyState !== 4) return;
                            if(xhr.status === 200){
                                // success
                                var data = xhr.responseText, json;
                                try {
                                    if(window.JSON) json = window.JSON.parse(data);
                                } catch(e){
                                    try { json = new Function('return '+data)(); } catch(ee){ json = null };
                                }

                                $this.trigger('upload_complete', json);
                            }
                        };
                        xhr.open('POST', '/upload_image.json?thumbnail_size=916&filename='+filename, true);
                        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                        xhr.setRequestHeader('X-Filename', encodeURIComponent(filename));
                        xhr.send(file);

                        return false;
                    }
                })
                .on('change', 'input[type="file"]', function(){
                    $(this).nextAll('.text').val(this.value.replace(/.*fakepath\\/,''));
                })
            .end()
        .end()
        .find('>.step.select')
            .on({                
                'set.images' : function(event,images){
                    var $this=$(this), title, template;
                    if(!$.isArray(images)) images = [images];

                    url = $this.closest('.popup').find('.step.web input.url_').val().replace('http://','');                    
                    template = $this.find("ul > script").html();

                    $this
                        .find('p.ltit').text("Add from "+url).end()
                        .find("ul > li").remove();

                    $(images).each(function(){
                        var $li = $(template);
                        $li.find("img").css('background-image','url('+this.src+')').end()
                            .find(".size").html(this.dimension).end()
                            .attr('image-url', this.src);
                        $li.appendTo( $this.find("ul") );
                    })
                        
                }
            })
            .delegate('li input:checkbox','click',function(e){
                var $li = $(this).closest('li');
                if( !$li.hasClass('selected') ){
                    $li.parent().find("li.selected").removeClass('selected').find("input:checkbox").removeAttr('checked');
                }
                $li.toggleClass('selected');
            })
            .on('click', '.back_', function(event){
                event.preventDefault();
                if($(this).hasClass('disabled')) return;
                dlg_add.$obj.trigger('tab','web');
                dlg_add.center();
            })
            .find(".btn-blue-embo-add").click(function(e){
                var $step = $(this).closest('.step');
                var image_url = $step.find("li.selected").attr('image-url');
                if(!image_url){
                    alertify.alert("please select an image");
                    return;
                }
                $step.siblings('.info').trigger('set.image',image_url);
                dlg_add.$obj.trigger('tab','info');
                dlg_add.center();

            }).end()
        .end()
        .find('>.step.info')
            .on({
                'set.uploaded_image' : function(event,image_info){
                    var $this=$(this), title;

                    $this
                        .data('from', 'upload')
                        .data('req_url', '/add_new_thing.xml')
                        .data('fields', 'name link category list_ids note')
                        .find('img.photo').attr('src', image_info.url+"?original").end()                        
                },
                'set.image' : function(event,image){
                    var $this=$(this);
                    
                    $this
                        .data('from', 'web')
                        .data('req_url', '/add_new_sys_thing.json')
                        .data('fields', 'name link category list_ids note user_key photo_url')
                        .find('#fancy_add-photo_url').val(image).end()
                        .find('img.photo').attr('src', image).end()
                }
            })
            .find('.btn-blue-embo-add')
                .click(function(){
                    var $btn=$(this), $step=$btn.closest('.step'), fields, req_url, key, datatype, val, params={via:'web'};

                    req_url  = $step.data('req_url');
                    fields   = $step.data('fields').split(' ');
                    datatype = req_url.match(/\.(json|xml)$/)[1];

                    for(var i=0,c=fields.length; i < c; i++){
                        key = fields[i];
                        val = $step.find('#fancy_add-'+key).val();
                        params[key] = val;
                    }

                    var is_valid = true;
                    $step.find(".error").removeClass("error");
                    if(!params['name']) {
                        $step.find("#fancy_add-name").addClass("error");
                        is_valid = false;
                    }
                    if(!params['category']){
                        $step.find("#fancy_add-category").next().addClass("error");
                        is_valid = false;
                    }
                    if(!is_valid) return;
                    if(params['photo_url'] && params['link']) params['tag_url'] = params['link'];

                    $btn.disable().addClass('loading');

                    function json_handler(json){
                        if(!json) return;
                        if(json.status_code == 1){
                            location.href = json.thing_url;
                        } else if (json.status_code == 0 && json.message){
                            alertify.alert(json.message);
                        }
                    };

                    function xml_handler(xml){
                        var $xml = $(xml), $st = $xml.find('status_code');
                        if(!$st.length) return;
                        if($st.text() == '1'){
                            location.href = $xml.find('thing_url').text();
                        } else if ($st.text() == '0' && $xml.find('message').length){
                            alertify.alert($xml.find('message').text());
                        }
                    };

                    $.ajax({
                        type : 'post',
                        url  : req_url,
                        data : params,
                        dataType : datatype,
                        success  : datatype=='xml'?xml_handler:json_handler,
                        complete : function(){
                            $btn.disable(false).removeClass('loading');
                        }
                    });
                })
            .end()           
            .on('click', '.back_', function(event){
                event.preventDefault();
                if($(this).hasClass('disabled')) return;
                if( $(this).closest('.step').data('from') == 'web'){
                    dlg_add.$obj.trigger('tab','select');
                }else{
                    dlg_add.$obj.trigger('tab','upload');
                }
                dlg_add.center();
            }) 
            .on('click', 'a.select-category', function(event){
                event.preventDefault();

                var $this = $(this), $div;

                if($this.hasClass('list_')) {
                    $div = dlg_add.$obj.find('.lists-popout.lists');
                } else {
                    $div = dlg_add.$obj.find('.lists-popout.category');
                }

                $div.show().find('>ul').scrollTop(0).end().find('input:text').val('');
                $this.removeClass("error");
            })
            .on('change keyup', '#fancy_add-name', function(event){            
                $(this).removeClass("error");
            })
            .on('click', '.lists-popout > span.trick', function(){
                $(this).closest('div').hide();
            })
            .on('click', '.lists-popout li', function(){
                var $this=$(this), $div=$this.closest('.lists-popout'), $label=$this.find('>label'), value=$label.attr('data-value'), text=$label.text(), $a;

                if($div.hasClass('category')){
                    dlg_add.$obj
                        .find('a.select-category.category_').text(text).end()
                        .find('#fancy_add-category').val(value);
                    $div.find("ul li").show().end().find(".result").hide();
                    $div.hide();
                } else {
                    $this.find("input:checkbox")[0].checked = !$this.find("input:checkbox")[0].checked;
                    var selectedList = $this.parent().find("li input:checked");
                    var title = selectedList.eq(0).prev().text() || 'Add to list';
                    if(selectedList.length > 1) title += " and "+(selectedList.length-1)+ " more";
                    var ids = Array.prototype.slice.call(selectedList.map(function(){ return $(this).prev().attr('data-value') })).join(",");
                    dlg_add.$obj
                        .find('a.select-category.list_').text(title).end()
                        .find('#fancy_add-list_ids').val(ids);
                }
            })
            .on('change keyup', '.lists-popout .search input:text', function(event){            
                var q = $(this).val();                
                var $div = $(this).closest('.lists-popout');
                if(!q){
                    $div.find("ul li").show().end().find(".result").hide();
                    return;
                }
                
                var regexp = new RegExp(q,"i");
                $div.find("ul li").each(function(){
                    if($(this).find("label").text().match(regexp)){
                        $(this).show();
                    }else{
                        $(this).hide();
                    }
                })
                if( $div.find("ul li:visible").length ){
                    $div.find(".result").hide();
                }else{
                    $div.find(".result").show();
                }
            })
            .on('click', '.create-list > label', function(e){
                $(this).hide();
                $(this).next().val('');
            })
            .on('keydown', '.lists-popout .create-list input:text', function(event){            
                if(event.which != 13) return;
                $(this).next().click();
            })
            .on('click', '.create-list > button.btn-create', function(event){
                var $this=$(this), $div=$this.closest('.lists-popout'), $ul=$div.find('>ul'), text=$.trim( $(this).prev().val());

                if(!text || $this.data('loading')) return;

                $this.data('loading', true);

                $.ajax({
                    type : 'post',
                    url  : '/create_list.xml',
                    data : {list_name:text},
                    dataType : 'xml',
                    success  : function(xml){
                        var $xml = $(xml), $st = $xml.find('status_code'), lid;
                        if(!$st.length || $st.text() != 1) {
                            if($xml.find('message').length) alertify.alert($xml.find('message').text());
                            return;
                        }
                        if($xml.find("created").text()=='False'){
                            alertify.alert("A list with this name already exists");
                            return;
                        }

                        lid = $xml.find('list_id').text();

                        $('<li><label data-value="'+lid+'">'+text.escape_html()+'</label><input type="checkbox"></li>').prependTo($ul).click();

                        //$div.hide();
                        $this.parent().find("label").show();
                    },
                    complete : function(){
                        $this.data('loading', false);
                    }
                });
            })
        .end();

        // when drag files over document, show "drop to upload" message
        var $popup_container = $('#popup_container');
        $(window).on({
            dragenter : function(event){
                var ev, dt;

                event.preventDefault();

                if(($_drag_objs=$_drag_objs.add(event.target)).length > 1 || !(ev=event.originalEvent) || !(dt=ev.dataTransfer)) return;
                if(dt.types.indexOf ? dt.types.indexOf('Files') == -1 : !dt.types.contains('application/x-moz-file')) return;
                if($popup_container.is(':visible') && !dlg_add.showing()) return;

                dlg_drop.open();
            },
            dragleave : function(event){
                var ev, dt;

                event.preventDefault();

                if(($_drag_objs=$_drag_objs.not(event.target)).length || !(ev=event.originalEvent) || !(dt=ev.dataTransfer)){
                    $("html").removeClass("fixed");
                    $(".container").css('top','');
                    return;
                }
                if(!dlg_drop.showing()){
                    $("html").removeClass("fixed");
                    $(".container").css('top','');
                    return;
                }

                dlg_drop.close();
            }
        });

        if($('._send_message #add_file_input').length){
            $popup_container.find("h1 strong").text("Upload Attachment");
            $popup_container.bind({
                dragover : function(event){ event.preventDefault() },
                drop : function(event){

                    $_drag_objs = $();
                    dlg_drop.close();
                }
            });
        }else{
            $popup_container.bind({
                dragover : function(event){ event.preventDefault() },
                drop : function(event){
                    var ev, dt, images=[];

                    event.preventDefault();
                    if(!(ev=event.originalEvent) || !(dt=ev.dataTransfer) || !dt.files || !dt.files.length) return;

                    $_drag_objs = $();

                    for(var i=0,c=dt.files.length; i < c; i++) {
                        if(/\.(jpe?g|gif|png)$/i.test(dt.files[i].name)) images.push(dt.files[i]);
                    }

                    if(!images.length) {
                        alertify.alert("Please try uploading again. Filetype is not supported.");
                        return;
                    }

                    dlg_add.open().$obj.trigger('tab','upload').find('form').trigger('submit',[images]);
                }
            });
        }
});

Fancy.ActivitiesPreview = {
    $sensor: $(".mn-noti").parent(),    
    $pulldown: $(".feed-activity"),
    $tab: $(".feed-activity > h4 > a"),
    $activityloading: $(".feed-activity > .feed.activity .loading"),
    $activitylist: $(".feed-activity > .feed.activity > ul"),
    $activityempty: $(".feed-activity > .feed.activity > div.empty"),
    $activitymore: $(".feed-activity > .feed.activity > .more"),
    $notificationloading: $(".feed-activity > .feed.notifications .loading"),
    $notificationlist: $(".feed-activity > .feed.notifications > ul"),
    $notificationempty: $(".feed-activity > .feed.notifications > div.empty"),
    $notificationmore: $(".feed-activity > .feed.notifications > .more"),
    $messageloading: $(".feed-activity > .feed.messages .loading"),
    $messageempty: $(".feed-activity > .feed.messages > div.empty"),
    $messagelist: $(".feed-activity > .feed.messages > ul"),
    $messagemore: $(".feed-activity > .feed.messages > .more"),
    $template: $(".feed-activity > .feed.notifications script[type='fancy/template']"),
    $messagetemplate: $(".feed-activity > .feed.messages script[type='fancy/template']"),
    pulldownCloseTimer: null,
    loaded: false,
    init: function () {
        var preview = this;
        this.$sensor.mouseenter(function (e) {
            clearTimeout(preview.pulldownCloseTimer);
            preview.openPulldown();
        }).mouseleave(function (e) {
            preview.pulldownCloseTimer = setTimeout(function () { preview.closePulldown(); }, 100);
        });
        this.$tab.click(function(e){
            e.preventDefault();
            preview.$tab.removeClass("current");
            $(this).addClass("current");
            preview.$pulldown.find(".feed").hide();
            if( $(this).attr("tab") == 'activity'){
                preview.$pulldown.find(".feed.activity").show();
            }else if( $(this).attr("tab") == 'messages'){
                preview.$pulldown.find(".feed.messages").show();                
                if( $(this).hasClass('new')){
                    $.post("/header_notification_as_read.json", {messages:true}, function (data) {})
                    $(this).removeClass('new');
                    if( !$('.feed-activity h4 a.new').length ) $(this).closest("li.gnb").find("a.mn-noti").addClass("none");
                }                
            }else{                
                preview.$pulldown.find(".feed.notifications").show();
                if( $(this).hasClass('new')){
                    $.post("/header_notification_as_read.json", {messages:true}, function (data) {})
                    $(this).removeClass('new');
                    if( !$('.feed-activity h4 a.new').length ) $(this).closest("li.gnb").find("a.mn-noti").addClass("none");
                }
            }
        });
        this.$pulldown.hide();
        this.$activityloading.hide();
        this.$notificationloading.hide();
        this.$messageloading.hide();
        this.$messageempty.hide();
    },
    openPulldown: function () {
        var preview = this;
        var maxFetch = 20;
        var maxShow = 4;
        this.$sensor.addClass("open");
        this.$pulldown.show();

        if (!this.loaded) {
            this.loaded = true;
            this.$activityloading.show();
            this.$notificationloading.show();
            this.$messageloading.show();
            this.$messageempty.hide();

            $.getJSON("/notifications.json", {count: maxFetch, lang:window.CURRENT_LANGCODE||"en", thumbnail:82}, function (data) {
                preview.$notificationlist.empty();
                if (data.response.notifications.length > maxShow) {
                    data.response.notifications = data.response.notifications.slice(0, maxShow);
                }
                var now = new Date();
                var today = $.datepicker.formatDate('yy-mm-dd', now);
                var yesterday = $.datepicker.formatDate('yy-mm-dd', new Date(now.setDate( now.getDate()+1)));
                var prev_date = null;
                for (i in data.response.notifications) {
                    var item = data.response.notifications[i];
                    var $li = $('<li>');
                    var text = item.text;
                    var date = $.datepicker.formatDate('yy-mm-dd', new Date(item.date_created));
                    if( !prev_date || prev_date!=date){
                        var str = "";
                        if(date==today) str = "Today";
                        else if (date==yesterday) str = "Yesterday";
                        else str = $.datepicker.formatDate('dd MM', new Date(item.date_created));
                        
                        preview.$notificationlist.append("<li class='date-divider'>"+str+"</li>");
                    }
                    prev_date = date;

                    if (item.entities.user) {
                        var user = item.entities.user;
                        $li.append('<a href="/' + user.username + '"><img src="' + user.image_url.replace(/http[s]?:/i,'') + '" class="photo"></a>');
                        text = text.replace((user.fullname||user.username)+" ","<a href='/"+user.username+"' class='username'>"+(user.fullname||user.username)+"</a> ");
                    } else if(item.type=='featured'){
                        var thing = item.entities.thing;
                        $li.append("<a href='" + thing.url + "'><img src='/_ui/images/common/blank.gif' class='photo featured'></a>");
                        text = text.replace(thing.name,"<a href='"+thing.url+"'>"+thing.name+"</a>");
                    } else if(item.type=='order_shipped'){
                        $li.append("<a href='/purchases/" + item.entities.order.order_id + "'><img src='/_ui/images/common/blank.gif' class='photo ship'></a>");
                        text = text.replace("#"+item.entities.order.order_id, "<a href='/purchases/" + item.entities.order.order_id + "'>#"+item.entities.order.order_id+"</a>");
                    } 

                    if (item.entities.thing) {
                        var thing = item.entities.thing;
                        $li.append('<a href="' + thing.url + '"><img src="' + thing.thumb_image_url.replace(/http[s]?:/i,'') + '" class="thing"></a>');
                        text = text.replace(thing.name,"<a href='"+thing.url+"'>"+thing.name+"</a>");
                    } else if (item.entities.deal) {
                        var deal = item.entities.deal;
                        $li.append('<a href="' + deal.url + '"><img src="' + deal.image_url.replace(/http[s]?:/i,'') + '" class="thing"></a>');
                    } else if (item.entities.store) {
                        var store = item.entities.store;
                        $li.append('<a href="/brands-stores/' + store.name + '"><img src="' + store.image_url.replace(/http[s]?:/i,'') + '" class="thing"></a>');
                    } else if (item.entities.user2) {
                        var user = item.entities.user2;
                        $li.append('<a href="/' + user.username + '"><img src="' + user.image_url.replace(/http[s]?:/i,'') + '" class="thing"></a>');
                        text = text.replace((user.fullname||user.username)+" ","<a href='/"+user.username+"'> class='username'"+(user.fullname||user.username)+"</a> ");
                    } else if (item.image_url_120) {
                        $li.append('<a href="/help/promotions"><img src="' + item.image_url_120.replace(/http[s]?:/i,'') + '" class="thing"></a>');
                    }

                    $li.append('<span class="noti-wrap">'+text+'</span>');
                    preview.$notificationlist.append($li);
                }
                if(!data.response.notifications.length && preview.$notificationempty[0]){
                    preview.$notificationempty.show();
                    preview.$notificationlist.hide();
                }else{
                    preview.$notificationmore.show();
                }

            }).always(function () {
                preview.$notificationloading.hide();
            }).fail(function() {
                preview.loaded = false;
            });


            $.get("/recent_activity_feed.json", {}, function (data) {
                preview.$activitylist.empty();                
                preview.$activitylist.html(data);

                if(!preview.$activitylist.find("li").length && preview.$activityempty[0]){
                    preview.$activityempty.show();
                    preview.$activitylist.hide();
                }else{
                    preview.$activitymore.show();
                }

            }).always(function () {
                preview.$activityloading.hide();
            }).fail(function() {
                preview.loaded = false;
            });


            $.getJSON("/messages/retrieve-threads.json", {archived:false}, function (data) {
                preview.$messagelist.empty();
                
                var threads = data.threads;

                for (i in threads) {
                    var item = threads[i];
                    if(!item.last_message) continue;

                    var $li = $(preview.$messagetemplate.html());
                    var member = item.members[0];
                    var isSellerThread = !!member.seller;

                    $li.attr("thread-id", item.id).attr("following", item.following);
                    $li.find("img").css('background-image',"url('"+(isSellerThread?member.seller.logo_image:member.image_url).replace(/http[s]?:/i,'')+"')").end()
                    .find("b.username").html(item.is_admin_thread?"Fancy":(isSellerThread?member.seller.brand_name:member.fullname)).end()
                    .find("span.message").html( item.last_message.message).end()
                    .find(".status .date").html(item.last_message.sent_since).end()
                    .find("a").attr("href","/messages/"+item.id).end();

                    if( isSellerThread ){
                        $li.addClass("store").find("b.username").addClass("store");
                    }
                    if( item.am_i_store ){
                        $li.find("b.username").addClass("store");
                    }
                    
                    if(item.last_message.attachments.length){
                        if(item.last_message.attachments[0].name.match(/\.(?:png|jpg|jpeg|gif)$/i)){
                            $li.find("span.message").html($li.find("span.message").html()+"(Image)");
                        }else{
                            $li.find("span.message").html($li.find("span.message").html()+"(Attachment)");
                        }
                    }

                    if(item.last_message.things && item.last_message.things.length){
                        $li.find("span.message").html(item.last_message.things[0].name);
                    }

                    if(item.unread_count > 0){
                        $li.find(".new").show().end().addClass('unread');
                        $li.addClass('show');
                    }else if(item.last_message.from.id != member.id){
                        $li.find("span.message").html('You: '+ $li.find("span.message").html());                        
                    }

                    preview.$messagelist.append($li);
                }
                if(!preview.$messagelist.find("li").length){
                    preview.$messageempty.show();
                    preview.$messagelist.hide();
                    preview.$messagemore.hide();
                }else{
                    preview.$messageempty.hide();
                    preview.$messagelist.show();
                    preview.$messagemore.show();
                }

            }).always(function () {
                preview.$messageloading.hide();
            }).fail(function() {
                preview.loaded = false;
            });
        }
    },
    closePulldown: function () {
        this.$pulldown.hide();
        this.$sensor.removeClass("open");
    }
};

$(function(){
    Fancy.ActivitiesPreview.init();
})
