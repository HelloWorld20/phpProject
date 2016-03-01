
var $social = null;

$(document).ready(function() {

    $('a.social,button.social,button.switch._off').on('click', function(e) {
       e.preventDefault();
	   set_sns_signup_cookie();
	   var backend  = $(this).data('backend');
       if(!backend) return;
       window.popup = window.open(null, '_blank', 'height=400,width=800,left=250,top=100,resizable=yes', true);
	   var auth_url = "/social/auth_dialog/" + backend + '/';
	   popup.location.href = auth_url;
	   $social = $(this);
	   authenticate();
    });

    $('.network .social .switch button').on('click',function(){
        var parent = $(this).parents("div.after");
        var onBtn = parent.find(".btn-switchon");
	    var backend = $(this).data('backend');
        if ( onBtn.is(".current") ) {
            var type = backend;
            var unlink_url  = ['/social/unlink', type].join('_') + '.json';
            if (confirm('Do you really want to remove ' + capitalize(backend) + ' connection?')) {
                $.post(unlink_url, {}, function(json){
                    var code = json.status_code;
                    if (code == 0) {
                        alert(json.message);
                    } else {
                        parent.find(".btn-switchon").removeClass("current").attr('disabled', false);
                        parent.find(".btn-switchoff").addClass("current");
                        parent.find(".after-off").show().end().find(".after-on").hide();
                    }
                }, "json");
            }
            return false;
        };
    });

    $('.unlink_social').on('click',function(){
    	var backend = $.trim($(this).data('backend'));
    	var $parent = $(this).parents("dd.social");
	
        var type = backend;
        var unlink_url  = ['/social/unlink', type].join('_') + '.json';

        $.post(unlink_url, {}, function(json){
            var code = json.status_code;
            if (code == 0) {
                alert(json.message);
            } else {
                var $mobile = $parent;
                if ($mobile.length > 0) {
                    $mobile.empty().html('<em></em><button type="button" class="button btn-gray social '+backend+'" data-backend="'+backend+'" data-type="link">Connect with '+capitalize(backend) +'</button>');
                }
            }
        }, "json");
        return false;
    });


    $('.network-item button.switch.on').on('click',function(){
        var backend = $.trim($(this).data('backend'));
        
        var type = backend;
        if(!type) return;

        var unlink_url  = ['/social/unlink', type].join('_') + '.json';

        $.post(unlink_url, {}, function(json){
            var code = json.status_code;
            if (code == 0) {
                alert(json.message);
            } else {
                location.reload();
            }
        }, "json");
        return false;
    });


    $('.sign .signup form, form.social-signup').submit(function(event) {

	    var $form = $(this);

        function error(msg){
	    $form.find('p.error').show().find('span.msg').text(msg);
            return false;
        };

        function hide_error(){
	    $form.find('p.error').hide();
        };

	    hide_error();
	    var i, c, v, el, url, json=false, type=$form.attr('rel'), params={};
	    event.preventDefault();
        for(i=0,c=this.elements.length; i < c; i++){
            el = this.elements[i];
            v  = $.trim(el.value);
            if(el.name && v && ((el.type != 'checkbox' && el.type != 'radio') || el.checked)) params[el.name] = v;
        }

        if(!params.username) return error('Please enter username.');
        if(params.username.length < 3) return error('username must be greater than 2 characters long.');
        if(/\W/.test(params.username)) return error('The specified username contains illegal characters.');

        if(this.elements.fullname && !params.fullname) params.fullname = '';

        if(this.elements.password){
            if(!params.password) return error('Please enter password.');
            if(params.password.length < 6) return error('Password should be 6 characters or more.');
        }

        url  = '/social/signup_' + type + '.json';

        $form.find('button:submit').prop('disabled', true);

        $.ajax({
            type : 'POST',
            url  : url,
            data : params,
            dataType : 'json',
            success  : function(data){

                var st, url, msg;
                st  = data.status_code;
                msg = data.message;

                if(st){
                    location.href = '/onboarding?channel=' + type;
                } else {
                    if(msg) error(msg);
                }
            },
            complete : function(){
                $form.find('button:submit').prop('disabled', false);
            }
        });
    });
});

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function set_sns_signup_cookie() {
    var expire = new Date();
    expire.setDate(expire.getDate() - 1);
    document.cookie = 'ck_sns_su' + '=; path=/; expires='+expire.toUTCString();
}

function authenticate() {

    var authtype = $social.data('type');
    var backend  = $social.data('backend');
    var nextpath = $social.attr('next') || '/';
    var name     = 'ck_' + backend;

    var url = '/auth_' + backend + '.json'
    url = location.protocol == 'https:' ? '/social' + url : url;                                                                                                                                                                               

    if (!window.popup || !window.popup.closed) {
    	setTimeout(authenticate, 50);
    	return;
    }

    $.post(url, {}, function(json){

        if (!json.code) {
            alert("Sorry, we couldn't sign you in. Please try again.");
            return;
        }

        var signup_forced = ($.cookie.get('signup-forced')=='true');

        var params = {};
        if (authtype == 'signin') {
            url = '/check_login_' + backend + '.json';
            url = location.protocol == 'https:' ? '/social' + url : url;
            if (json.code) params['code'] = json.code;
            if (json.state) params['state'] = json.state;
            if (json.redirect_state) params['redirect_state'] = json.redirect_state;
            if (nextpath) params['next'] = nextpath;
            $.post(url, params, function(json){
                if (!json.status_code) {
                    alert(json.message);
                } else {
                    if (!json.url) {
                        try {mixpanel_log('Complete Login', {'channel':backend, 'forced':signup_forced}); } catch(e) {}
                    }
                    var redirect_to = json.url ? json.url : nextpath;
                    location.href = redirect_to;
                }
            });
        } else if (authtype == 'link') {
            var params   = json;
            if (nextpath) {
        	  params['next'] = nextpath;
            }
            var from_find_friends = (location.pathname == '/find_friends' || location.pathname == '/invite');
            params['origin'] = location.pathname;
            url = '/link_' + backend + '.json'
            url = location.protocol == 'https:' ? '/social' + url : url;

            if (from_find_friends) {
            	$('body').removeClass('wider').addClass('loading');
            	$('.waiting').show();
            	$('#searching-logo').addClass(backend)
            }

            $.post(url, params, function(json){
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
            			var $onoff = $('.network .social.' + backend);
            			if ($onoff.length > 0) {
            			    var html_str = 'Connected to ' + capitalize(backend) + ' as <b>'+name+'</b>';
            			    $onoff.find("div.after-on").html(html_str);
            			    $onoff.find(".switch button.btn-switchoff").removeClass("current");
            			    $onoff.find(".switch button.btn-switchon").addClass("current").attr('disabled', true);
            			    $onoff.find(".after-on").show().end().find(".after-off").hide();
            			}
            			var $parent = $social.parents("dd.social");
            			var $mobile = $parent;
            			if ($mobile.length > 0) {
            			    var html_str = '<em class="on"></em><b>Linked with ' + capitalize(backend) +' as ' + name + '</b>  <a href="#" class="unlink_social" data-backend="'+backend+'">Unlink</a>';
            			    $mobile.empty().html(html_str);
            			}

                        var $parent = $social.parents("p.network-item");                        
                        if ($parent.length > 0) {
                            var html_str = 'Connected to ' + capitalize(backend) +' as ' + name;
                            $parent.find("> small").html(html_str);
                            $parent.find(".switch").toggleClass("on _off");
                        }
        		    }
        		}
            });
        }
    });
}
