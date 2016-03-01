(function($) {
  "use strict";
  var require_login = function(next) {
    if( $(".popup.sign.signup")[0] ){
      $('#fancy-g-signin').attr('next', next);
      $social = $('.social');
      if ($social.length > 0) {
         $social.attr('next', next);
      }
      $(".popup.sign.signup")
        .find('input.next_url').val(next).end()
        .find('a.signup').attr('href','/register?next='+next).end()
        .find('a.signin').attr('href','/login?next='+next);
      $.dialog('popup.sign.signup').open();
    } else {
      var path = location.pathname.toString();
      if(typeof(next) != 'string' || /^#/.test(next)) next = '';
      if(!next && path !='/' && !/^\/login/.test(path)) next = location.pathname+location.search;

      location.href = '/signup'+(next?'?next='+encodeURIComponent(next):'');
    }
    return false;
  }
  $(function() {
    $('#content,#sidebar,#slideshow-box, .profile')
      .delegate('.fancyd, .fancy, .add', 'click', function(event) {
        event.preventDefault();
        var $this = $(this),
          login_require = $this.attr('require_login');
        if (login_require && login_require=='true') return require_login();
      });
  });
})($);
