jQuery(function($) {
    var TEST = false;

    var params = location.search.substr(1).split("&");
    for(var i=0; i<params.length; i++) {
        if(params[i]=="TEST") {
            TEST = true;
        }
    }

    var dlg_signup = $.dialog('popup.sign.signup');
    var dlg_signup_detail = $.dialog('popup.sign.register');
    var dlg_signin = $.dialog('popup.sign.signin');
    var dlg_forgot_pw = $.dialog('popup.sign.forgot_pw');
    var dlg_reset_pw_email_sent = $.dialog('popup.sign.reset_pw_email_sent');
    var form_signup = $('.sign.signup form');
    var form_signup_detail = $('.sign.register form');
    var form_signin = $('.sign.signin form');
    var form_forgot_password = $('.sign.forgot_pw form');
    var form_reset_password = $('.sign.reset_pw form');
    var form_reset_pw_email_sent = $('.sign.reset_pw_email_sent form');

    var check_email_error = function() {
        var field = this;
        var emailRegEx = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*)@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/i;
        if(emailRegEx.test($.trim($(this).val()))) {
            $(field).removeClass('error');
            $(field).parent().removeClass('error');
            return true;
        }
        return false;
    }
    var check_password_error = function() {
        var field = this;
        if($(field).val().length>=6) {
            $(field).removeClass('error');
            $(field).parent().removeClass('error');
            return true;
        }
        return false;
    }
    var check_username_error = function() {
        var field = this;
        var username = $(field).val();
        if(username.length>=3 && username.length<=30 && username.match('^[a-zA-Z0-9_]+$')) {
            $(field).removeClass('error');
            $(field).parent().removeClass('error');
            $(field).parent().parent().find('.username_suggest').removeClass('error');
            return true;
        }
        return false;
    }

    var check_email_signin_error = function() {
        var field = this;
        var emailRegEx = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*)@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/i;
        var usernameRegEx = /^[a-zA-Z0-9_]+$/;
        var value = $(field).val();
        if(emailRegEx.test($.trim(value)) || usernameRegEx.test($.trim(value))) {
            $(field).removeClass('error');
            $(field).parent().removeClass('error');
            return true;
        }
        return false;
    }

    var check_email_signin = function() {
        var field = this;
        var emailRegEx = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*)@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/i;
        var usernameRegEx = /^[a-zA-Z0-9_]+$/;
        var value = $(field).val();
        if(value.length<1) {
            $(field).addClass('error');
            $(field).parent().addClass('error');

            if($(field).parent().hasClass('hidden-email')) {
                alertify.alert(gettext('Please enter email address.'));
            } else {
                var error = $(field).next();
                error.html('<i class="icon"></i>'+gettext('Please enter email address.'));
            }
            return false;
        } else if(!(emailRegEx.test($.trim(value)) || usernameRegEx.test($.trim(value)))) {
            $(field).addClass('error');
            $(field).parent().addClass('error');
            var error = $(field).next();
            error.html('<i class="icon"></i>'+gettext('Please enter email address.'));
            return false;
        }
        return true;
    }

    var check_email = function(e) {
        var field = this;
        var emailRegEx = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*)@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/i;
        if($(field).val().length<1) {
            $(field).addClass('error');
            $(field).parent().addClass('error');

            if($(field).parent().hasClass('hidden-email')) {
                alertify.alert(gettext('Please enter email address.'));
            } else {
                var error = $(field).next();
                error.html('<i class="icon"></i>'+gettext('Please enter email address.'));
            }
            return false;
        } else if(!emailRegEx.test($.trim($(this).val()))) {
            $(field).addClass('error');
            $(field).parent().addClass('error');
            if($(field).parent().hasClass('hidden-email')) {
                alertify.alert(gettext('A valid email address is required.'));
            } else {
                var error = $(field).next();
                error.html('<i class="icon"></i>'+gettext('A valid email address is required.'));
            }
            return false;
        }
        return true;
    }

    var check_password = function(e, check_all) {
        var field = this;
        if($(this).val().length<6) {
            $(field).addClass('error');
            $(field).parent().addClass('error');
            var error = $(field).next();
            error.html('<i class="icon"></i>'+gettext('Password should be 6 characters or more.'));
            return false;
        }
        return true;
    }

    var check_username_request = null;
    var check_username = function(e, check_all) {
        if(e && e.type=="keyup" && e.which==13) {
            return false;
        }

        if(check_username_request) {
            check_username_request.abort();
            check_username_request = null;
        }
        $(this).parent().find('.url b').text($(this).val());

        var field = this;

        if($(this).val().length>0 && !$(this).val().match('^[a-zA-Z0-9_]+$')) {
            $(field).addClass('error');
            $(field).parent().addClass('error');
            $(field).parent().parent().find('.username_suggest').removeClass('error');
            var error = $(field).next();
            error.html('<i class="icon"></i>'+gettext('Please use alphanumeric characters for your username.'));
            return false;
        }

        if(check_all && $(this).val().length<3) {
            $(field).addClass('error');
            $(field).parent().addClass('error');
            $(field).parent().parent().find('.username_suggest').removeClass('error');
            var error = $(field).next();
            if($(this).val().length<1) {
                error.html('<i class="icon"></i>'+gettext('Username is required.'));
            } else {
                error.html('<i class="icon"></i>'+gettext('Username is too short.'));
            }
            return false;
        }
        if($(this).val().length>30) {
            $(field).addClass('error');
            $(field).parent().addClass('error');
            $(field).parent().parent().find('.username_suggest').removeClass('error');
            var error = $(field).next();
            error.html('<i class="icon"></i>'+gettext('Username is too long.'));
            return false;
        }

/*
        check_username_request = $.get('/check-field/username', { username : $(this).val() }, function(data) {
            if(data.status_code==1) {
                console.log(''+data.value + ' ' + data.exists);
            }

            if(data.error) {
                $(field).addClass('error');
                $(field).parent().addClass('error');
                $(field).parent().parent().find('.username_suggest').addClass('error');
                var error = $(field).next();
                //error.find('.error-level').text(gettext('Sorry')+',');
                //$(field).parent().find('.error-msg').text(gettext('This username is already in user'));
                error.html('<i class="icon"></i>'+data.message);
            } else {
                $(field).removeClass('error');
                $(field).parent().removeClass('error');
                $(field).parent().parent().find('.username_suggest').removeClass('error');
            }
        }).always(function() {
            check_username = null;
        });
*/

        return true;
    }


    $('#navigation .mn-signup').click(function(event) {
        event.preventDefault();
        dlg_signup.open({'signup-clicked':true});
    });

    $('#navigation .mn-signin').click(function(event) {
        event.preventDefault();
        dlg_signin.open({'signup-clicked':true});
    });


    // signup first phase dialog/form
    dlg_signup.$obj
    .on('open', function(event, params) {
        if(params && params['signup-clicked']) {
            $.cookie.set('signup-forced', 'false');
        } else {
            $.cookie.set('signup-forced', 'true');
        }

        dlg_signup.$obj.find('input[name="email"]').val('').focus();

        dlg_signup.$obj.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        });
        try {mixpanel_log('Signup Popup', {'channel': 'fancy', 'forced':$.cookie.get('signup-forced')=='true'}); } catch(e) {}
    })
    .on('click', 'a.signin', function(event) {
        event.preventDefault();
        if($.cookie.get('signup-forced')=='false') {
            dlg_signin.open({'signup-clicked':true});
        } else {
            dlg_signin.open();
        }
    })


    form_signup
    .on('keyup', 'input[name="email"]', function(event) {
        if(event.which == 13){
            event.preventDefault();
            form_signup.find('.btn-signup').click();
        }
    })
    .on('keyup', 'input.error[name="email"]', check_email_error)
    .on('click', '.btn-signup', function(event) {
        event.preventDefault();
        if( $(this).attr('disabled') ) return;
        
        form_signup.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        });

        var $email = $(this).parent().find('input[name="email"]');
        var $referrer = $(this).parent().find('input[name="referrer"]');
        var $invitation_key = $(this).parent().find('input[name="invitation_key"]');
        var $user_id = $(this).parent().find('input[name="user_id"]');
        var email = $.trim($email.val())||'';
        var referrer = $.trim($referrer.val())||null;
        var invitation_key = $.trim($invitation_key.val())||null;
        var user_id = $.trim($user_id.val())||null;

        if(!TEST) {
            if(!check_email.call($email, true)) {
                return;
            }
        }

        var that = this;
        if(!TEST) {
            $(that).disable(true);
        }

        if(dlg_signup.$obj.length>0) {
            // popup dialog based signup
            if(TEST) {
                dlg_signup_detail.email = email;
                dlg_signup_detail.open();
                return;
            }
            var params = {'email':email};
            //if(referrer) params['referrer'] = referrer;
            //if(invitation_key) params['invitation_key'] = invitation_key;
            $.get('/check-field/email', params, function(response) {
                if (response.status_code != undefined && response.status_code == 1) {
                    dlg_signup_detail.username = response.username;
                    dlg_signup_detail.email = response.email;
                    //dlg_signup_detail.fullname = response.fullname;
                    dlg_signup_detail.open();
                    // prevent detail stage cancelled.
                    dlg_signup_detail.close = function() {};
                    try { mixpanel_log('Begin Signup', { 'channel': 'fancy', 'forced':$.cookie.get('signup-forced')=='true' }); } catch (e) {}
                } else if (response.status_code != undefined && response.status_code == 0) {
                    var msg = response.message;
                    var error = response.error;
                    $email.addClass('error');
                    $email.parent().addClass('error');
                    var error = $email.next();
                    error.html('<i class="icon"></i>'+msg);
                    return;
                }
            }, 'json')
            .fail(function(xhr) {
                alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            })
            .always(function() {
                $(that).disable(false);
            });
        } else {
            // full page based signup
            if(TEST) {
                form_signup_detail.find('input[name="email"]').val(email);
                $('#container-wrapper .content.signup').hide();
                $('#container-wrapper .content.register').css('display','table-cell');
                return;
            }
            var params = {'email':email};
            //if(referrer) params['referrer'] = referrer;
            //if(invitation_key) params['invitation_key'] = invitation_key;
            //if(user_id) params['user_id'] = user_id;
            $.get('/check-field/email', params, function(response) {
                if (response.status_code != undefined && response.status_code == 1) {
                    form_signup_detail.find('input[name="username"]').val(response.username).change();
                    form_signup_detail.find('input[name="username"]').parent().find('.url b').text(response.username);
                    form_signup_detail.find('input[name="email"]').val(response.email);
                    form_signup_detail.find('input[name="fullname"]').val(response.fullname).focus();

                    $('#container-wrapper .content.signup').hide();
                    $('#container-wrapper .content.register').css('display','table-cell');

                    try { mixpanel_log('Begin Signup', { 'channel': 'fancy', 'forced':($.cookie.get('signup-forced')=='true') }); } catch (e) {}
                } else if (response.status_code != undefined && response.status_code == 0) {
                    var msg = response.message;
                    var error = response.error;
                    $email.addClass('error');
                    $email.parent().addClass('error');
                    var error = $email.next();
                    error.html('<i class="icon"></i>'+msg);
                    return;
                }
            }, 'json')
            .fail(function(xhr) {
                alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            })
            .always(function() {
                $(that).disable(false);
            });
        }
    })


    // signup second phase (detail) dialog/form
    dlg_signup_detail.$obj
    .on('open', function(){
        dlg_signup_detail.$obj.find('input[name="username"]').val(dlg_signup_detail.username).change();
        dlg_signup_detail.$obj.find('input[name="username"]').parent().find('.url b').text(dlg_signup_detail.username);
        dlg_signup_detail.$obj.find('input[name="email"]').val(dlg_signup_detail.email);
        dlg_signup_detail.$obj.find('input[name="fullname"]').val(dlg_signup_detail.fullname).focus();

        dlg_signup_detail.$obj.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        });
    })
    .on('close', function(){
        if(!TEST) {
            location.href = '/onboarding?channel=fancy';
        }
    });

    form_signup_detail
    .on('keyup', 'input.error[name="email"]', check_email_error)
    .on('keyup', 'input.error[name="user_password"]', check_password_error)
    .on('keyup', 'input.error[name="username"]', check_username_error)
    .on('keyup', 'input[name="username"]', check_username)
    .on('click', '.btn-signup', function(event) {
        event.preventDefault();

        $this = $(this);
        if( $this.attr('disabled') ) return;

        $form = form_signup_detail;

        form_signup_detail.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        });

        var $username = $form.find('input[name="username"]');
        var $email = $form.find('input[name="email"]');
        var $user_password = $form.find('input[name="user_password"]');

        var username = $.trim($username.val())||'';
        var email = $.trim($email.val())||'';
        var password = $.trim($user_password.val())||'';
        var fullname = $.trim($form.find('input[name="fullname"]').val())||'';
        var referrer = $.trim($form.find('input[name="referrer"]').val())||'';
        var invitation_key = $.trim($form.find('input[name="invitation_key"]').val())||'';
        var user_id = $.trim($form.find('input[name="user_id"]').val())||'';
        var is_brand_store = $('#brandSt').is(':checked');

        var sns_type = $form.attr('sns-service');
        if(!sns_type) sns_type = 'email';

        if(!check_username.call($username, null, true)) {
            return;
        }
        if($email.length>0) {
            if(!(sns_type=='facebook' && email.length==0)) {
                if(!check_email.call($email, true)) {
                    $form.find('.hidden-email').show();  
                    return;
                }
            }
        }
        if($user_password.length>0) {
            // do not enter password for social signup
            if(!check_password.call($user_password, null, true)) {
                return;
            }
        }

        var param = {
            'username'  : username,
            'fullname'  : fullname
        };
        if(invitation_key.length>0) param['invitation_key'] = invitation_key;
        if(referrer.length>0) param['referrer'] = referrer;
        if(user_id.length>0) param['user_id'] = user_id;
        if(email.length>0) param['email'] = email;

        if($user_password.length>0) param['password'] = password;

        $this.disable(true).css({'cursor': 'default'});

        // proceed registration
        if(sns_type==='facebook') {
            // facebook signup
            //var post_to_facebook = $('#fb-wall').is(':checked');
            var post_to_facebook = $('#fb-wall').hasClass('on');
            var fb_request_id = $this.attr('fbrid');

            param['post_to_facebook']=post_to_facebook;
            if(fb_request_id != undefined) { param['fb_request_id']=fb_request_id; }
            if (location.args['next']) param['next'] = location.args['next'];

            var close_w = false;
            if($form.find('#close_w').length){
                close_w = true;
            }

            $this.attr('disabled', true).css({'cursor': 'default'});
            $.post("/facebook_signup.xml",param, function(xml) {
                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                    // success
                    if(close_w){
                        window.close();
                    } else {
                        if (document.URL.indexOf('/seller-signup') > -1) {
                            location.href="/seller-signup";
                        } else if($(xml).find("url").length>0) {
                            location.href=$(xml).find("url").text();
                        } else {
                            location.href="/onboarding?channel=facebook";
                        }
                    }
                } else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                    // failed create account with facebook id
                    var error_type = $(xml).find("error").text();
                    if(error_type.indexOf('email')>=0) {
                        if(error_type == "email_duplicate"){
                            var email = $(xml).find("email").text();
                            $email.val(email);
                        }
                        var msg = $(xml).find("message").text();
                        $email.val(email);
                        $form.find('.hidden-email').show();  

                        /*
                        $email.parent().addClass('error');
                        var $error = $email.next();
                        $error.html('<i class="icon"></i>'+msg);
                        */
                        alertify.alert(msg);
                    } else if(error_type.indexOf('username')>=0) {
                        var msg = $(xml).find("message").text();
                        $username = $form.find('input[name="username"]');
                        $username.parent().addClass('error');
                        var $error = $username.next();
                        $error.html('<i class="icon"></i>'+msg);
                    } else {
                        var msg = $(xml).find("message").text();
                        alertify.alert(msg);
                    }
                }
            }, "xml")
            .fail(function(xhr) {
                alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            })
            .always(function() {
                $this.disable(false).css('cursor','');
            });
        } else if(sns_type=='twitter') {
            // twitter signup
            //var follow_fancy = $('#follow-thefancy').is(':checked');
            //var post_to_twitter = $('#twitter').is(':checked');
            var follow_fancy = $('#follow-thefancy').hasClass('on');
            var post_to_twitter = $('#twitter').hasClass('on');
            param['follow_fancy']=follow_fancy;
            param['post_to_twitter']=post_to_twitter;
            if (location.args['next']) param['next'] = location.args['next'];

            var close_w = false;
            if($form.find('#close_w').length){
                close_w = true;
            }

            $this.disable(true).css({'cursor':'default'});
            $.post("/twitter_signup.xml",param, function(xml){
                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                    // success
                    if(close_w){
                        window.close();			
                    } else{
                        if (document.URL.indexOf('/seller-signup') > -1) {
                            location.href = '/seller-signup';
                        } else if($(xml).find("url").length>0) {
                            location.href=$(xml).find("url").text();			
                        } else {
                            location.href="/onboarding?channel=twitter";
                        }
                    }
                } else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                    var msg = $(xml).find("message").text();
                    var err = $(xml).find("error").text();
                    if (err != undefined && err.indexOf('email')>=0){
                        $email.addClass('error');
                        $email.parent().addClass('error');
                        var $error = $email.next();
                        $error.html('<i class="icon"></i>'+msg);
                    } else if (err != undefined && err.indexOf('username')>=0) {
                        $username.addClass('error');
                        $username.parent().addClass('error');
                        var $error = $username.next();
                        $error.html('<i class="icon"></i>'+msg);
                    } else {
                        alertify.alert(msg);
                    }
                }
            }, "xml")
            .fail(function(xhr) {
                alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            })
            .always(function() {
                $this.disable(false).css('cursor','');
            });
        } else if(sns_type=='email') {
            // email signup
            var http_post = "/invitation_signup";
            var https_post = "/invitation_signup.json";
            var from_popup = $this.attr('from_popup');
            var force_xhr = false;

            if (typeof(from_popup) != undefined && from_popup === 'true') {
                https_post="/email_signup.json";
                force_xhr = true;
                //https_post="/settings_account_signup_detail.json";
            }

            // use xhr when current page is on https, else use iframe proxy
            if(force_xhr==true || document.location.protocol=="https:") {
                $.post(https_post, param, function(response) {
                    if (response.status_code != undefined && response.status_code == 1) {
                        if (is_brand_store) {
                            location.href = '/create-brand';
                        } else {
                            var param = $.jStorage.get('fancy_add_to_cart', null);
                            if (param && param['thing_id']) {
                                location.href = '/things/' + param['thing_id']; 
                            } else if (document.URL.indexOf('seller-signup') > 0) {
                                location.href = '/seller-signup';
                            } else {
                                location.href = '/onboarding?channel=fancy';
                            }
                        }
                    } else if (response.status_code != undefined && response.status_code == 0) {
                        var msg = response.message;
                        var error = response.error;
                        if (response.error != undefined && response.error.indexOf('email')>=0){
                            $form.find('.hidden-email').show();  

                            $email.addClass('error');
                            $email.parent().addClass('error');
                            if($email.parent().hasClass('hidden-email')) {
                                alertify.alert(msg);
                            } else {
                                var $error = $email.next();
                                $error.html('<i class="icon"></i>'+msg);
                            }
                        } else if (response.error != undefined && response.error.indexOf('username')>=0) {
                            $username.addClass('error');
                            $username.parent().addClass('error');
                            var $error = $username.next();
                            $error.html('<i class="icon"></i>'+msg);
                        } else {
                            alertify.alert(msg);
                        }
                    }
                }, 'json')
                .fail(function(xhr) {
                    if(xhr.status==403) {
                        alertify.alert("It seems to be your browser is blocking cookies. please turn on your cookie settings.");
                    } else if(xhr.status>=400) {
                        alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
                    }
                })
                .always(function() {
                    $this.disable(false).css({'cursor': ''});
                });
            } else {
                window.is_brand_store = is_brand_store;
                window.displayError = function(selector,msg) {
                    if(selector.search('email')>=0) {
                        $email.addClass('error');
                        $email.parent().addClass('error');
                        if($email.parent().hasClass('hidden-email')) {
                            alertify.alert(msg);
                        } else {
                            var $error = $email.next();
                            $error.html('<i class="icon"></i>'+msg);
                        }
                    } else if(selector.search('username')>=0) {
                        $username.addClass('error');
                        $username.parent().addClass('error');
                        var $error = $username.next();
                        $error.html('<i class="icon"></i>'+msg);
                    } else {
                        alertify.alert(msg);
                    }
                }
                $("#signup_iframe").detach();
                $("#signup_form").detach();
                $("<iframe name='signup_iframe' id='signup_iframe' style='height:0;width:0'></iframe>").appendTo(document.body);
                $("<form id='signup_form' action='http://"+document.location.hostname+http_post+"' method='post' target='signup_iframe'></form>").appendTo(document.body);
                for(var k in param){
                    $('#signup_form').append("<input type='hidden' name='"+k+"' value='"+param[k]+"'>");
                }
                $('#signup_form').append("<input type='hidden' name='csrfmiddlewaretoken' value='"+$("input[name=csrfmiddlewaretoken]").val()+"'>");
                $('#signup_form').submit();
            }
        } else {
            // other sns signup
            var url = "/social/signup_"+sns_type+".json";

            $.post(url, param, function(response) {
                if (response.status_code != undefined && response.status_code == 1) {
                    if (is_brand_store) {
                        location.href = '/create-brand';
                    } else {
                        var param = $.jStorage.get('fancy_add_to_cart', null);
                        if (param && param['thing_id']) {
                            location.href = '/things/' + param['thing_id']; 
                        } else if (document.URL.indexOf('seller-signup') > 0) {
                            location.href = '/seller-signup';
                        } else {
                            location.href = '/onboarding?channel=fancy';
                        }
                    }
                } else if (response.status_code != undefined && response.status_code == 0) {
                    var msg = response.message;
                    var error = response.error;
                    if (response.error != undefined && response.error.indexOf('email')>=0){
                        $form.find('.hidden-email').show();  

                        $email.addClass('error');
                        $email.parent().addClass('error');
                        if($email.parent().hasClass('hidden-email')) {
                            alertify.alert(msg);
                        } else {
                            var $error = $email.next();
                            $error.html('<i class="icon"></i>'+msg);
                        }
                    } else if (response.error != undefined && response.error.indexOf('username')>=0) {
                        $username.addClass('error');
                        $username.parent().addClass('error');
                        var $error = $username.next();
                        $error.html('<i class="icon"></i>'+msg);
                    } else {
                        alertify.alert(msg);
                    }
                }
            }, 'json')
            .fail(function(xhr) {
                alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
            })
            .always(function() {
                $this.disable(false).css({'cursor': ''});
            });
        }
    })
    ;


    // Sign In
    dlg_signin.$obj
    .on('open', function(event, params) {
        if(params && params['signup-clicked']) {
            $.cookie.set('signup-forced','false');
        } else {
            $.cookie.set('signup-forced','true');
        }

        dlg_signin.$obj.find('input[name="username"]').val('').focus();
        dlg_signin.$obj.find('input[name="user_password"]').val('');

        dlg_signin.$obj.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        });
    })
    .on('click', 'a.signup', function(event) {
        event.preventDefault();
        if($.cookie.get('signup-forced')=='false') {
            dlg_signup.open({'signup-clicked':true});
        } else {
            dlg_signup.open();
        }
    });

    form_signin
    .on('keyup', 'input.error[name="username"]', check_email_signin_error)
    .on('keyup', 'input.error[name="user_password"]', check_password_error)
    .on('click', '.btn-signin', function(event) {
        event.preventDefault();
        var $this = $(this);
        var $username = form_signin.find('input[name="username"]');
        var $user_password = form_signin.find('input[name="user_password"]');
        var username = $.trim($username.val())||'';
        var password = $.trim($user_password.val())||'';

        form_signin.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        });

        if(!check_email_signin.call($username)) {
            return;
        }
        if(!check_password.call($user_password, null, true)) {
            return;
        }

        $this.disable(true).css({'cursor': 'default'});

        // proceed signin
        if(dlg_signin.$obj.length>0) {
            // popup dialog based signin
            $.post('/login.json', {'username':username, 'password':password, 'callback':''}, function(response){
                if (response.status_code != undefined && response.status_code == 1) {
                    try {mixpanel_log('Complete Login', {'channel':'fancy',forced:$.cookie.get('signup-forced')=='true'});} catch(e){}
                    document.location.reload();
                } else if (response.status_code != undefined && response.status_code == 0) {
                    if (response.wrong!=undefined && response.wrong.indexOf('username')>=0){
                        $username.addClass('error');
                        $username.parent().addClass('error');
                        var $error = $username.next();
                        $error.html('<i class="icon"></i>'+gettext('This username or email does not exist.'));
                    } else if (response.wrong != undefined && response.wrong.indexOf('password')>=0) {
                        $user_password.addClass('error');
                        $user_password.parent().addClass('error');
                        var $error = $user_password.next();
                        $error.html('<i class="icon"></i>'+gettext('The password for this account is incorrect.'));
                    } else {
                        alertify.alert(response.message);
                    }
                }
            }, 'json')
            .fail(function(xhr) {
                if(xhr.status==403) {
                    alertify.alert("It seems to be your browser is blocking cookies. please turn on your cookie settings.");
                } else if(xhr.status>=400) {
                    alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
                }
            })
            .always(function() {
                $this.disable(false).css({'cursor': ''});
            })
        } else {
            // full page based signin
            $.post('/login.json', {'username':username, 'password':password, 'callback':''}, function(response){
                if (response.status_code != undefined && response.status_code == 1) {
                    try {mixpanel_log('Complete Login', {'channel':'fancy',forced:$.cookie.get('signup-forced')=='true'});} catch(e){}
                    var next = form_signin.find('.next_url').val()||'/';
                    if(next) {
                        document.location = next;
                    } else {
                        document.location = '/';
                    }
                } else if (response.status_code != undefined && response.status_code == 0) {
                    if (response.wrong!=undefined && response.wrong.indexOf('username')>=0){
                        $username.addClass('error');
                        $username.parent().addClass('error');
                        var $error = $username.next();
                        $error.html('<i class="icon"></i>'+gettext('This username or email does not exist.'));
                    } else if (response.wrong != undefined && response.wrong.indexOf('password')>=0) {
                        $user_password.addClass('error');
                        $user_password.parent().addClass('error');
                        var $error = $user_password.next();
                        $error.html('<i class="icon"></i>'+gettext('The password for this account is incorrect.'));
                    } else {
                        alertify.alert(response.message);
                    }
                }
            }, 'json')
            .fail(function(xhr) {
                if(xhr.status==403) {
                    alertify.alert("It seems to be your browser is blocking cookies. please turn on your cookie settings.");
                } else {
                    alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
                }
            })
            .always(function() {
                $this.disable(false).css({'cursor': ''});
            })
           
        }
    })
    .on('click', 'a.forgot_pw', function(event) {
        if(dlg_signin.$obj.length>0) {
            // popup dialog based signin
            event.preventDefault();
            dlg_forgot_pw.open();
        } else {
            // full page based signin
        }
    })
    ;

    dlg_forgot_pw.$obj
    .on('open', function(event, params) {
        dlg_forgot_pw.$obj.find('input[name="email"]').val('').focus();
    });

    form_forgot_password
    .on('keyup', 'input.error[name="email"]', check_email_error)
    .on('click', '.btn-reset', function(event) {
        event.preventDefault();

        $this = $(this);
        $form = form_forgot_password;

        var $email = $form.find('input[name="email"]');

        var email = $.trim($email.val())||'';
        var reset_method = $this.data('method');

        form_forgot_password.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        });

        if(!check_email.call($email, true)) {
            return;
        }

        var param = {
            'email'  : email,
            'skip_captcha' : true,
            'reset_method' : reset_method
        };

        $this.disable(true).css({'cursor': 'default'});

        // post forgot_password
        $.post("/reset_password.xml",param, function(xml){
            if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                $email.val('');
                var message  = 'Reminder sent. Check your email momentarily.';
                if (reset_method == "2step") {
                    message = "We've sent an email to your account.\nClick the link in the email to reset your password.\nIf you don't see the email, check other places it might be, like your junk, spam, social, or other folders."
                }
                if(dlg_signin.$obj.length>0) {
                    // overlay popup version
                    dlg_reset_pw_email_sent.open();
                } else {
                    // whole page version
                    $('#container-wrapper .content.forgot_pw').css({'display':'none'});
                    $('#container-wrapper .content.reset_pw_email_sent').css({'display':'table-cell'});
                }
            } else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                var msg = $(xml).find("message").text();
                $email.addClass('error');
                $email.parent().addClass('error');
                var error = $email.next();
                error.html('<i class="icon"></i>'+msg);
            }  
        }, "xml")
        .fail(function(xhr) {
            alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
        })
        .always(function() {
            $this.disable(false).css({'cursor': ''});
        });
    })
    ;

    form_reset_password
    .on('keyup', '.new input.error[type="password"]', check_password_error)
    .on('focus', '.confirm input.error[type="password"]', function(event) {
        $(this).removeClass('error');
        $(this).next().removeClass('error');
        $(this).parent().removeClass('error');
    })
    .on('keyup', '.confirm input.error[type="password"]', function(event) {
        if(event.which!=13) {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        }
    })
    .on('click', '.btn-reset', function(event) {
        event.preventDefault();

        $this = $(this);
        $form = form_reset_password;

        form_reset_password.find('input.error').each(function() {
            $(this).removeClass('error');
            $(this).next().removeClass('error');
            $(this).parent().removeClass('error');
        });

        var $newpassword = $form.find('.new input[type="password"]');
        var $confirmpassword = $form.find('.confirm input[type="password"]');
        var $code = $form.find('input[name="code"]');

        var newpassword = $newpassword.val()||'';
        var confirmpassword = $confirmpassword.val()||'';
        var code = $code.val()||'';

        if(!check_password.call($newpassword, null, true)) {
            return;
        }
        if(newpassword != confirmpassword) {
            $confirmpassword.addClass('error');
            $confirmpassword.parent().addClass('error');
            var error = $confirmpassword.next();
            //error.html('<i class="icon"></i>'+gettext('Please confirm your password.'));
            return;
        }

        var param = {
            'password': newpassword,
            'code': code,
            'callback' : ''
        };

        $this.disable(true).css({'cursor': 'default'});

        // post forgot_password
        $.post("/reset_password/reset_request.json",param, function(response){
            if (response.status_code != undefined && response.status_code == 1) {
                alertify.alert('Your password has been changed.', function(closeEvent) {
                    location.href = '/login';
                });
            } else if (response.status_code != undefined && response.status_code == 0) {
                alertify.alert(response.message);
            }
        }, "json")
        .fail(function(xhr) {
            alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
        })
        .always(function() {
            $this.disable(false).css({'cursor': ''});
        });
    })
    ;

    form_reset_pw_email_sent
    .on('click', '.btn-ok', function(event) {
        event.preventDefault();
        if(dlg_signin.$obj.length>0) {
            // overlay popup version
            dlg_signin.open();
        } else {
            // whole page version
            location.href="/login"
        }
    });
});

