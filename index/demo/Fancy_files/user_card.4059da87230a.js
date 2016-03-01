$(function(){
	var $layer = $("#show_usercard");
	if(!$layer.length) return;
	var template = $layer.html();

	var timer = null;
	var source = null;	

	function determineBottom(top){
		var wtop = $(window).scrollTop();
        return top < wtop + 80
	}

	$(document).on('mouseenter', '[show-user-card]', function(e){
		clearTimeout(timer);		
		source = this;		
		var $this = $(this);
		var $target = $(e.target);
		var uid = $this.attr('show-user-card');

		function showLayer(){	
			var adjust = parseInt($("#container-wrapper").css('padding-top'));
			var top = $this.offset().top-$('#show_usercard').height()-20-adjust;
			var toTop = top + 10;

            $layer.removeClass("bot");
			if( determineBottom(top) ){
				top = $this.offset().top + $this.height() + 20 - adjust;
				toTop = top - 10;				 
            	$layer.addClass("bot");
			}
			$layer.css('top',top+'px').css('left',($this.offset().left-$('.container').offset().left)+'px');			
			$layer.fadeIn(120);
			$layer.animate({top:toTop+'px'},120);
		}

		if( !uid || ($layer.attr('uid') == uid && $layer.is(":visible")) ){
			return;
		}

		var timeToShow = false;
		var time = new Date().getTime();
		timer = setTimeout(function(){
			timeToShow = true;
		},300)

		$layer.attr('uid',uid);
		$.get('/get-user-card.json?uid='+uid, function(res){
			if(res.status_code == 1){
				if( source != $this[0] || !$layer.attr('uid') ) return;

				if(timeToShow){
					$layer.html(res.html).show();	
					showLayer()
				}else{
					elapsed = new Date().getTime() - time;
					timer = setTimeout(function(){
						$layer.html(res.html).show();
						showLayer()
					}, 300-(elapsed/1000))
				}				
			}
		})
	})
	$(document).on('mouseleave', '[show-user-card], #show_usercard', function(e){
		clearTimeout(timer);
		timer = setTimeout(function(){
			$layer.removeAttr('uid');
			$layer.fadeOut(100);	
		},100)
		
	})
	$(document).on('mouseenter', '#show_usercard', function(e){
		clearTimeout(timer);
	});
	

})
