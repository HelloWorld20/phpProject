
Fancy.Cart = {
    addItem : function(args) {
        var $popup = $('#cart_popup'), $ul = $popup.find('ul');
        var $item  = $('#cartitem-'+args['ITEMCODE']), price, quantity;

        quantity = parseInt(args['QUANTITY']) || 0;
        price   = parseFloat(args['PRICE']) || 0;
        fancy_price = parseFloat(args['FANCY_PRICE']) || 0;

        if($item.length) {
            quantity += parseInt($item.data('quantity'));
            price += parseFloat($item.data('price'));
            fancy_price += parseFloat($item.data('fancy_price'));
            $item
                .find('.qty').text("Quantity: "+quantity).end()
                .find('span.price').text('$'+addCommas(price.toFixed(2).replace(/\.?0+$/, '')));
        } else {
            $item = $popup.find('>script[type="fancy/template"]').template(args).appendTo($ul);
            $item
                .find('span.price').text('$'+addCommas(price.toFixed(2).replace(/\.?0+$/, '')));          
        }
        if(args.FANCY_PRICE){           
            $item.find('span.price')
                .addClass("sales")
                .html('$'+addCommas(price.toFixed(2).replace(/\.?0+$/, ''))+' <small>$'+addCommas(fancy_price.toFixed(2).replace(/\.?0+$/, ''))+'</small>');
            $item.data('fancy_price', fancy_price);
        }

        $item.data('options', args['OPTIONS']||'').data('price', price).data('quantity', quantity);

        this.update();

        // Send to MyThings
        window.MyThingsProductID = args['THING_ID'];
        if(typeof MyThings == 'undefined'){
            window._mt_ready = _mt_ready_cart;
            $('<script src="'+mtHost+'/c.aspx?atok='+mtAdvertiserToken+'" async="true"></script>').appendTo('body');
        } else {
            _mt_ready_cart();
        }
    },

    updateItem : function(args) {
        var $popup = $('#cart_popup'), $ul = $popup.find('ul');
        var $item  = $('#cartitem-'+args['ITEMCODE']), price, quantity;

        quantity = parseInt(args['QUANTITY']) || parseInt($item.data('quantity'));
        price   = parseFloat(args['PRICE']) || parseFloat($item.data('price'));
        fancy_price   = parseFloat(args['FANCY_PRICE']) || parseFloat($item.data('fancy_price'));

        if($item.length) {            
            $item.find('.qty').text("Quantity: "+quantity).end().find('span.price').text('$'+addCommas(price.toFixed(2).replace(/\.?0+$/, '')));
            if( args['OPTIONS']){
                $item.find("._option").html(args['OPTIONS']);
            }
        } else {
            $item = $popup.find('>script[type="fancy/template"]').template(args).appendTo($ul);
            $item.find('span.price').text('$'+addCommas(price.toFixed(2).replace(/\.?0+$/, '')));
        }
        if(fancy_price){
            $item.find('span.price')
                .addClass("sales")
                .html('$'+addCommas(price.toFixed(2).replace(/\.?0+$/, ''))+' <small>$'+addCommas(fancy_price.toFixed(2).replace(/\.?0+$/, ''))+'</small>');
            $item.data('fancy_price', fancy_price);
        }

        $item.data('options', args['OPTIONS']||'').data('price', price).data('quantity', quantity);
        this.update( !('SHOW_POPUP' in args) || args['SHOW_POPUP'] );
    },

    removeItem : function(args) {
        var $popup = $('#cart_popup'), $ul = $popup.find('ul');
        var $item  = $('#cartitem-'+args['ITEMCODE']), price, quantity;

        if($item.length) {
            $item.remove();
        }

        this.update();
    },

    update : function() {
        var count = 0, price = 0, $container = $('.container');

        $('#cart_popup ul > li').each(function(){
            var $this = $(this);
            var q = parseInt($this.data('quantity')) || 0;
            var p = parseFloat($this.data('price')) || 0;

            if(q == 0) {
                $item.remove();
                return;
            }

            count += q;
            price += p;
        });
        
        if(count) {
            $('#cart-new a.mn-cart span.count').show().text(count);
            $('#cart_popup > .summary')
                .find('>span').text('Total: $'+addCommas(price.toFixed(2).replace(/\.?0+$/,'')));            
        } else {
            $('#cart-new a.mn-cart span.count').hide();
            $('#cart_popup > .summary')
                .find('>span').text('Total: $0');
            $('#cart-new a.mn-cart').addClass('none');
            this.hidePopup();
        }
    },

    openPopup : function() {
        document.location.href = '/cart';
        /*var $container = $('.container');
		$('#cart-new a.mn-cart span.count').closest('.gnb').addClass('active');
		var sc = $(window).scrollTop();
		$container.attr('position',sc);
		$('html').addClass('fixed');
		$container.css('top',-sc+'px');*/
    },

    hidePopup : function() {
        $("#cart-new span.trick").click();        
    }
};