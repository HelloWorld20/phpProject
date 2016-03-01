(function(){
    var $nav = $('#navigation');
    var $search_form = $('#navigation').find('form.search'),
        $textbox = $search_form.find('#search-query'),
        $suggest = $search_form.find('.keyword'),
        $users   = $search_form.find('dl.user'),
        $stores   = $search_form.find('dl.store'),
        prev_keyword = '', timer = null,
        searched_query = $textbox.attr('data-query');
        keys = {
            13 : 'ENTER',
            27 : 'ESC',
            38 : 'UP',
            40 : 'DOWN'
        };

    $search_form.on('submit', function(){
        var v = $.trim($textbox.val());
        if(!v) return false;
    });

    $textbox
        // highlight submit button when the textbox is focused.
        .on({
            focus : function(){
                
                if ($(this).val() || searched_query){
                    if( !$(this).val() && searched_query ){
                        $(this).val(searched_query).select();
                    }
                    $(this).trigger('keyup');
                    return;
                }
                
                if(!$suggest.find(".recently").is(":visible")){
                    hide_all();
                    $.ajax({
                        type : 'GET',
                        url  : '/search-gethistory.json',
                        dataType : 'json',
                        success  : function(json){
                            if(json.search_history && json.search_history.length) show_history(json);
                            //$suggest.removeClass('loading');
                        }
                    });
                }
            },
            blur  : function(e){
                if( $(e.relatedTarget).is("div.keyword *") ) return;
                if( $textbox.val().length>0 ) return;
                $suggest.hide();
            }
        })
        // search things and users as user types
        .on({
            keyup : function(event){
                var kw = $.trim($textbox.val());
                $textbox.attr('data-prev-val',kw);

                if(keys[event.which]) return;
                if(!kw.length) {
                    if($('#navigation dl.recently ul li').length){
                        show_only_this_part($('#navigation dl.recently'));
                        $keywords.empty();
                    }else{
                        hide_all();
                    }
                    return ;
                }
                if(kw.length && kw != prev_keyword ) {
                    prev_keyword = kw;
                    show_only_this_part($('#navigation ul.keywords'));                                        

                    clearTimeout(timer);
                    timer = setTimeout(function(){ find(kw); }, 500);
                }
            },
            keydown : function(event){
                var k = keys[event.which];
                if($suggest.is(':hidden') || !k) return;

                var $items = $suggest.find('li:visible'), $selected = $suggest.find('li.hover'), idx;

                if(k == 'ESC') return $suggest.hide();
                if(k == 'ENTER') {
                    if($selected.length) {
                        window.location.href = $suggest.find('a.hover').attr('href');
                    } else {
                        $search_form.submit();
                    }
                    return;
                }

                if(!$selected.length) {
                    $selected = $items.eq(0).mouseover();
                    return;
                }

                idx = $items.index($selected);

                if(k == 'UP' && idx > 0) {
                    return $items.eq(idx-1).mouseover();
                }
                if(k == 'DOWN' && idx < $items.length-1) {
                    return $items.eq(idx+1).mouseover();
                }
            }
        });

    $suggest.delegate('li', 'mouseover', function(){ $suggest.find('li.hover').removeClass('hover'); $(this).addClass('hover'); });
    $suggest.delegate('.recently > li, .result ul > li', 'mouseenter', function(){ 
        $textbox.attr('data-prev-val', $textbox.val());
        var val = $(this).find("a:eq(0)").text();
        if( $(this).find("a:eq(0) b")[0] ){
            val = $(this).find("a:eq(0) b").text();
        }
        $textbox.val( val );        
    });
    $suggest.delegate('.recently > li, .result ul > li', 'mouseleave', function(){ 
        $textbox.val( $textbox.attr('data-prev-val') ).removeAttr('data-prev-val');
    });

    function find(word){
        $.ajax({
            type : 'GET',
            url  : '/search-suggestions.json',
            data : {q:word, home_v3:true},
            dataType : 'json',
            success  : function(json){
                console.log(json);
                try {
                    if(json.fancy_services && json.fancy_services.length) suggestion_fancy_service(json, word);
                    else if(json.gift_services && json.gift_services.length) suggestion_gift_service(json, word);
                    else if(json.keywords && json.keywords.length) suggestion_keyword(json, word);
                    else if(json.sds_area && json.sds_area.length) suggestion_sds_area(json, word);
                    else{
                        hide_all();
                        suggestion_user(json, word);
                    }

                    //$suggest.removeClass('loading');
                } catch(e) {
                    console.log(e);
                }
            }
        });
    }

    function highlight(str, substr){
        var regex = new RegExp('('+encodeURIComponent(substr.replace(/ /g,'____')).replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&').replace(/(____)+/g,'|')+')', 'ig');
        return str.replace(regex, '<strong>$1</strong>');;
    }

    function hide_all() {        
        $('#navigation .keyword, #navigation .default, #navigation .result').hide().find("> dl, > ul").hide();
    }

    function show_only_this_part($part) {
        hide_all();

        $part.show().parent().show();
        $suggest.show();
    }

    var $tpl_search_recently = $('#tpl-search-recently').remove();
    var $tpl_suggestions_string = $('#tpl-search-suggestions-string').remove();
    var $tpl_suggestions_thing = $('#tpl-search-suggestions-thing').remove();
    var $tpl_suggestions_user = $('#tpl-search-suggestions-user').remove();

    var $recently = $search_form.find('dl.recently');
    function show_history(json) {
        show_only_this_part($('#navigation dl.recently'));

        try {
            if(json.search_history && json.search_history.length) $recently.show().find("ul").empty();
            _.each(json.search_history, function(history){
                if(history)
                    $tpl_search_recently.template({TEXT: $("<div>").text(history).html()}).appendTo($recently.find("ul"));
            });
        } catch(e) {
            console.log(e);
        }
    }

    function suggestion_user(json_data, word) {
        if(json_data.users.length){
            $users.show().find("ul").empty();
            _.each(json_data.users.slice(0,3), function(user){
                if(user.username=='hermes') user.html_url += '/nautilus';
                $tpl_suggestions_user.template({URL:user.html_url, IMG_URL:user.image_url, USERNAME:highlight(user.username, word), FULLNAME:$("<div>").text(user.name).html()}).appendTo($users.find("ul"));
            });
            $users.find("dt > a").attr('href','/search?q='+word+'&for=users');
        }else{
            $users.hide();
        }

        if(json_data.stores.length){        
            $stores.show().find("ul").empty();;
            _.each(json_data.stores.slice(0,3), function(user){
                if( !user.image_url ) user.image_url = '/_ui/images/common/placeholder_shop2.png';
                $tpl_suggestions_user.template({
                                        URL:user.html_url, 
                                        IMG_URL:user.image_url, 
                                        USERNAME:highlight(user.username, word), 
                                        FULLNAME:$("<div>").text(user.name).html()
                                    }).appendTo($stores.find("ul"));
            });
            $stores.find("dt > a").attr('href','/search?q='+word+'&for=brands');
        }else{
            $stores.hide();
        }
        if(json_data.users.length || json_data.stores.length){
            $suggest.find(".keyword, .result").show();
        }        
    }

    var $services = $('.fancy-service');
    function suggestion_fancy_service(json_data, word) {
        show_only_this_part($('#navigation .fancy-service'));

        $services.show().find("ul").empty();
        _.each(json_data.fancy_services, function(service) {
            $services.find("ul").append($tpl_suggestions_thing.template({URL: service.url, NAME: highlight(service.name, word)}));
        });

        suggestion_user(json_data, word);
    }

    var $gift_services = $('.gift-service');
    function suggestion_gift_service(json_data, word) {
        show_only_this_part($('#navigation .gift-service'));

        $gift_services.show().find("ul").empty();
        _.each(json_data.gift_services, function(service) {
            $gift_services.find("ul").append($tpl_suggestions_thing.template({URL: service.url, NAME: highlight(service.name, word)}));
        });
    }

    var $sdsarea = $('.sds');
    function suggestion_sds_area(json_data, word) {
        show_only_this_part($('#navigation .sds'));
        
        $sdsarea.show().find("ul").empty();
        _.each(json_data.sds_area, function(area) {
            $sdsarea.find("ul").append($tpl_suggestions_thing.template({URL: area.url, NAME: highlight(area.name, word)}));
        });
    }

    var $keywords = $search_form.find('ul.keywords');
    function suggestion_keyword(json_data, word) {
        show_only_this_part($('#navigation .keywords'));

        $keywords.empty().show();
        _.each(json_data.keywords, function(keyword){
            $tpl_suggestions_string.template({STRING: $("<div>").text(keyword).html(), NAME: highlight($("<div>").text(keyword).html(), word)}).appendTo($keywords);
        });

        suggestion_user(json_data, word);
    }

    $('#navigation ul.recently').on('click', 'li .del', function(e){
        e.preventDefault();
        var $this = $(this);
        var $selected = $this.closest('li');
        $.ajax({
            type : 'POST',
            url : '/search-deletehistory.json',
            data : { search_phrase: $selected.find('a[rel]').text() },
            dataType : 'json',
            success : function(json) {
                if (json.status_code == 1) {
                    $selected.mouseleave().remove();
                    if(!$('#navigation dl.recently ul >li').length){
                        hide_all();
                    }
                } else if (json.status_code == 0) {
                    alert(json.message);
                }
            },
        });
    });

    $('#navigation dl.recently').on('click', '.clear-all', function(e) {
        e.preventDefault();
        $.ajax({
            type : 'POST',
            url : '/search-deleteallhistory.json',
            dataType : 'json',
            success : function(json) {
                if (json.status_code == 1) {
                    $('#navigation dl.recently ul').empty();
                    hide_all();
                } else if (json.status_code == 0) {
                    alert(json.message);
                }
            },
        });
    });


})();