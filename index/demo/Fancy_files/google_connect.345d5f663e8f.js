var gplus_clicked = false;

var visible_actions = "http://schemas.google.com/AddActivity"
visible_actions += " http://schemas.google.com/BuyActivity"
visible_actions += " http://schemas.google.com/CommentActivity"
visible_actions += " http://schemas.google.com/CreateActivity"

var clientid_ = "870365319043-ljas5u3l1p8uv7a343i6ludrpmkv5mpj.apps.googleusercontent.com";
var scope_ = "https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/payments.make_payments";

var cookiepolicy_url = document.location.protocol+"//"+document.location.host;
var sign_options = {
    clientid : clientid_,
    accesstype : "offline",
    apppackagename : "com.thefancy.app",
    callback : "onSignInCallback",
    scope : scope_,
    cookiepolicy : cookiepolicy_url,
    requestvisibleactions : visible_actions
};

var link_options = {
    clientid : clientid_,
    accesstype : "offline",
    apppackagename : "com.thefancy.app",
    callback : "onLinkCallback",
    scope : scope_,
    //cookiepolicy : cookiepolicy_url,
    cookiepolicy : "single_host_origin",
    requestvisibleactions : visible_actions
};

function normalize_pathname(pathname) {
    var thingpath = '/things'
    if (pathname.substring(0, thingpath.length) === thingpath) {
	var words = pathname.split('/');
	pathname = words.slice(0, 3).join('/');
    }
    return pathname;
}

function onSignInCallback(authResult) {
    if (authResult.error == 'access_denied' || authResult.error == 'user_signed_out') return false;
    if (window.___gcfg.isSignedOut) {
        if (gapi.auth && gapi.auth.getToken() != null) {
            gapi.auth.signOut();
        }
        return;
    }

    if (typeof authResult == "undefined" || 
        typeof authResult.code == "undefined" && typeof authResult.access_token == "undefined") {
        if (gplus_clicked) {
            alert(gettext("Sorry, we couldn't sign you in. Please try again."));
            location.reload();
        }
        return;
    }

    var signup_forced = ($.cookie.get('signup-forced')=='true');

    var result = authResult;
    var ajaxEndpoint = '/social/check_login_google.json';
    ajaxEndpoint = location.protocol == 'http:' ? "https://" + window.location.host + ajaxEndpoint : ajaxEndpoint;
    var nextpath = $('#fancy-g-signin').attr('next') || '/';
    var origin = location.pathname;
    var params = {}
    if (result.code) params['code'] = result.code;
    if (result.state) params['state'] = result.state;
    if (result.refresh_token) params['refresh_token'] = result.refresh_token;
    if (result.redirect_state) params['redirect_state'] = result.redirect_state;
    if (nextpath) params['next'] = nextpath;
    if (origin) params['origin'] = origin;
    params['autosignin'] = gplus_clicked ? "false" : "true";

    var ajax_options = {};
    ajax_options.type = 'POST';
    ajax_options.url = ajaxEndpoint;
    ajax_options.dataType = 'json';
    ajax_options.data = params;
    ajax_options.success = function(json) {
        if (!json.status_code) {
            if (gplus_clicked) alert(json.message);
        } else {
            if (!json.url) {
                try {mixpanel_log('Complete Login', {'channel':'google', 'forced':signup_forced}); } catch(e) {}
            }
            var redirect_to = json.url ? json.url : nextpath;
            location.href = redirect_to;
        }
    }
    if (location.protocol == 'http:') {
	ajax_options.xhrFields = {withCredentials: true};
	ajax_options.crossDomain = true;
    }
    $.ajax(ajax_options);
};

function onLinkCallback(authResult) {
    
    if (!gplus_clicked || authResult.error == 'access_denied') return false;

    var ajaxEndpoint = '/social/link_google.json';
    ajaxEndpoint = location.protocol == 'http:' ? "https://" + window.location.host + ajaxEndpoint : ajaxEndpoint;

    var from_find_friends = (location.pathname == '/find_friends' || location.pathname == '/invite');

    if (from_find_friends) {
    	$('body').removeClass('wider').addClass('loading');  
    	$('.waiting').show();
    	$('#searching-logo').addClass('gplus')
    }
    var result = authResult;
    var params = {};

    if (result.code) params['code'] = result.code;
    if (result.state) params['state'] = result.state;
    if (result.refresh_token) params['refresh_token'] = result.refresh_token;
    if (result.redirect_state) params['redirect_state'] = result.redirect_state;
    if (result.auth_cookie) params['auth_cookie']= result.auth_cookie;

    params['origin'] = location.pathname;


    // timer for ios mobile safari and refresh
    var refreshTimer = setTimeout(function(){location.reload();}, 2000);
    
    var ajax_options = {};
    ajax_options.type = 'POST';
    ajax_options.url = ajaxEndpoint;
    ajax_options.dataType = 'json';
    ajax_options.data = params;
    if (location.protocol == 'http:') {
	ajax_options.xhrFields = {withCredentials: true};
	ajax_options.crossDomain = true;
    }

    ajax_options.success = function(json) {
        if(refreshTimer) clearTimeout(refreshTimer); // clear timer when callback excuted

    	var code = json.status_code;
    	if (code == 0) {
    	    if (from_find_friends) { 
                $('body').addClass('wider').removeClass('loading');
                $('.waiting').hide();
    		    $('#searching-logo').removeClass('gplus')
    	    }
            alert(json.message);
    	} else {
    	    if (json.url)  {
    		  location.href = json.url;
    	    } else {
        		var name = json.name;
        		
        		// gplus exclusive
        		var $glink = $('#fancy-g-link');
        		var $subscribe = $('#fancybox-subscribe');
        		if ($glink.length > 0 && $subscribe.length > 0){
        		    $glink.hide();
        		    $subscribe.show();
        		}
        		var $icon = $('.ic-connect-gg');
        		if ($icon.length > 0) {
        		    $('.ic-connect-gg').next().remove();
        		    var html = '<spank>' + gettext('Linked to Google as') + '<b>' + name + '</b> <a href="#" class="unlink_google">' + gettext('Unlink') + '</a></span>' ;
        		    $('.ic-connect-gg').after(html);
        		}
        		var $onoff = $('.network .google');
        		if ($onoff.length > 0) {
						var html_str = 'Connected to Google as <a href="https://plus.google.com/" target="_blank">'+name+'</a>';
						$onoff.find("div.after-on").html(html_str);
						$onoff.find(".switch button.btn-switchoff").removeClass("current");
						$onoff.find(".switch button.btn-switchon").addClass("current").attr('disabled', true);
						$onoff.find(".after-on").show().end().find(".after-off").hide();
        		}
        		var $mobile = $('.sns-g');
        		if ($mobile.length > 0) {
        		    var html_str = '<em class="on"></em><b>' + gettext('Linked with Google as') + name + '</b> <a href="#" class="unlink_google">' + gettext('Unlink') + '</a>';
        		    $mobile.empty().html(html_str);
        		}
                $mobile = $(".network-item._google");
                if ($mobile.length > 0) {
                    var html_str = 'Connected to Google as <b>'+name+'</b>.';
                    $mobile.find("small").html(html_str);
                    $mobile.find(".switch").addClass("on").removeAttr("id");
                }
    	    }
    	}
    };

    $.ajax(ajax_options);    
};

function render_gpia_post_button(action, el) {
    var recipient = el.attr('recipient'), url = el.attr('url'), options = {};
    var prefill = el.attr('prefill');

    if (recipient) {
    	options['recipients'] = recipient;
    }
    if (prefill) {
    	options['prefilltext'] = prefill;
    }
    options['clientid'] = clientid_;
    options['calltoactionlabel'] = action.toUpperCase();
    options['contenturl'] = url;
    options['calltoactionurl'] = el.attr('actionurl')
    options['contentdeeplinkid'] = el.attr('contentdeeplink');
    options['targetdeeplinkid'] = el.attr('contentdeeplink');
    options['calltoactiondeeplinkid'] = el.attr('actiondeeplink');
    options['cookiepolicy'] = cookiepolicy_url;
    options['scope'] = scope_;
    options['requestvisibleactions'] = visible_actions;
    gapi.interactivepost.render(el.attr('id'), options);
};

function initialize_google() {
    if (typeof gapi == "undefined") {
        setTimeout(initialize_google, 50);
        return;
    }

    $("#fancy-g-signin, #fancy-g-link, #fancy-g-signup").on('click', function() {
	   gplus_clicked = true;
       window.___gcfg.isSignedOut = false;
    });


    if ($('#fancy-g-signin').length > 0) {
	   gapi.signin.render('fancy-g-signin', sign_options);
    }
    if ($('#fancy-g-signup').length > 0) {
	   gapi.signin.render('fancy-g-signup', sign_options);
    }

    if ($('#fancy-g-link').length > 0) {
	   gapi.signin.render('fancy-g-link', link_options);
    }

    if ($('.g-plusone').length > 0) {
        gapi.plusone.go();
    }

    $('a.gplus-post, button.gplus-post, div.gplus-post').each(function(){
        var action = $(this).attr('action');
        if (render_gpia_post_button) {
	    render_gpia_post_button(action, $(this));
        }
    });

    $('.network .google .switch button').on('click',function(){
    	var parent = $(this).parents("div.after").first();
    	var onBtn = parent.find(".btn-switchon");
    	if ( onBtn.is(".current") ) {
                var type = 'google';
                var unlink_url  = ['/social/unlink', type].join('_') + '.json';
    	    if (confirm('Do you really want to remove Google connection?')) {
        		$.post(unlink_url, {}, function(json){
        		    var code = json.status_code;
        		    if (code == 0) {
        			     alert(json.message);
        		    } else {
            			var parent = $(".network .google");
            			parent.find(".switch button.btn-switchon").removeClass("current").attr('disabled', false);
            			parent.find(".switch button.btn-switchoff").addClass("current");
            			parent.find(".after-off").show().end().find(".after-on").hide();
            	    }
        		}, "json");
    	    }
            return false;
    	}; 
    });

    $('.unlink_google').on('click',function(){
        var type = 'google';
        var unlink_url  = ['/social/unlink', type].join('_') + '.json';

        $.post(unlink_url, {}, function(json){
            var code = json.status_code;
            if (code == 0) {
                alert(json.message);
            } else {
		var $icon = $('.ic-connect-gg');
		if ($icon.length > 0) {
                    $('.ic-connect-gg').next().remove();
                    $('.ic-connect-gg').after('<button class="btn-white-embo-set" id="fancy-g-link">Connect with Google</button>');
		    gapi.signin.render('fancy-g-link', link_options);
		}
		var $mobile = $('.sns-g');
		if ($mobile.length > 0) {
		    $mobile.empty().html('<em></em><button type="button" id="fancy-g-link" class="btn-gray">Connect with Google</button>');
		    gapi.signin.render('fancy-g-link', link_options);
		}
            }
        }, "json");
        return false;
    });

    $('.network-item._google .switch.on').on('click',function(e){
        e.preventDefault();
        var type = 'google';
        var unlink_url  = ['/social/unlink', type].join('_') + '.json';
        if (confirm('Do you really want to remove Google connection?')) {
            $.post(unlink_url, {}, function(json){
                var code = json.status_code;
                if (code == 0) {
                    alert(json.message);
                } else {
                    location.reload();
                }
            }, "json");
        }
        return false;
    });

    $('#fancy-g-link').on('click', function() {
        return false;
    });
}

jQuery(function($) {
    if(!$.dialog) return;
    var $fancy_share = $('#fancy-share'), dlg_share = $.dialog('new-share');
    if ($fancy_share.length < 1) return;

    $fancy_share
		.on('get_short_url', function(event, $btn, short_url){
			var $this = $(this), g = $this.find('#gplus-share'), uname=$this.attr('uname'), tid=$btn.attr('tid'), action=$btn.attr('action'), deeplink, actionDeeplink, options;

			if (!action) action = 'open';

			deeplink = 'things/'+ tid + (uname?'?ref='+uname:'');
			actionDeeplink = 'things/'+ tid + '?action=' + action + (uname?'&ref='+uname:'');

			options = { 
				'scope' : scope_,
				'requestvisibleactions' : visible_actions,
				'clientid'   : clientid_,
				'contenturl' : short_url,
				'contentdeeplinkid' : deeplink,
				'targetdeeplinkid'  : deeplink,
				'calltoactionlabel' : action.toUpperCase(),
				'calltoactionurl'   : short_url + "?action=" + action,
				'calltoactiondeeplinkid' : actionDeeplink,
				'cookiepolicy' : cookiepolicy_url
			};

			$this.find("#gplus-share")
				.attr("href", "#").attr("target", "")
				.on("click", function() { dlg_share.close(); });

			gapi.interactivepost.render("gplus-share", options);
		})
		.on('open_gift', function(event, btn){
			var $this = $(this).trigger('reset').addClass('gift-share'), $btn=$(btn), url;

            var g = $this.find("#gplus-share");
			var url = $btn.attr('href');
			var id = $btn.attr('cid');
			var gift_name = $btn.attr('gift_name');
			$this.attr({
				otype  : "gc",
				gcid   : id,
				gcurl  : url,
				gcname : gift_name
			});

            var deeplink = "gifts/" + id;
            var actiondeeplink = deeplink + "?action=contribute";
            var options = { 
                'scope' : scope_, 'requestvisibleactions' : visible_actions,
                'clientid': clientid_, 'contenturl': url,
                'contentdeeplinkid': deeplink, 'targetdeeplinkid': deeplink,
                'calltoactionlabel': "CONTRIBUTE",
                'calltoactionurl': url + "?action=contribute",
                'calltoactiondeeplinkid': actiondeeplink,
                'cookiepolicy': cookiepolicy_url
            };
            $this.find("#gplus-share")
                .attr("href", "#").attr("target", "")
                .on("click", function() { dlg_share.close(); });
            gapi.interactivepost.render("gplus-share", options);
		})
		.on('open_user', function(event, btn){
			var $this = $(this).trigger('reset').addClass('comment-share user-share'), $btn=$(btn), url;

            var g = $this.find("#gplus-share");
			var url = $btn.attr('href');
			var username = $btn.attr('username');
			var txt = $btn.attr('txt');
            var deeplink = "users/" + username;
            var actiondeeplink = deeplink + "?action=follow";
            var options = { 
                'scope' : scope_, 'requestvisibleactions' : visible_actions,
                'clientid': clientid_, 'contenturl': url,
                'contentdeeplinkid': deeplink, 'targetdeeplinkid': deeplink,
                'calltoactionlabel': "FOLLOW",
                'calltoactionurl': url + "?action=follow",
                'calltoactiondeeplinkid': actiondeeplink,
                'cookiepolicy': cookiepolicy_url,
                'prefilltext': txt
            };
            $this.find("#gplus-share")
                .attr("href", "#").attr("target", "")
                .on("click", function() { dlg_share.close(); });
            gapi.interactivepost.render("gplus-share", options);
		});
});
