/**
 * @requires jquery
 */
function imageSlider(selector, opts)
{
    // options
    this.selector = selector;
    this.container = opts.container;
    this.itemWidth = opts.itemWidth;
    this.numItems = opts.numItems;
    this.slideshow = (opts.slideshow) ? opts.slideshow : false;
    this.speed = (opts.speed) ? opts.speed: '600';
    this.waittime = (opts.waittime) ? opts.waittime: '5000';
    this.skipLastItems = (opts.skipLastItems) ? opts.skipLastItems : 0;
    this.responsive = (opts.responsive) ? opts.responsive : false;
    this.responsiveWidth = (opts.responsiveWidth) ? opts.responsiveWidth : 0;
    this.slideNavigationClass = (opts.slideNavigationClass) ? opts.slideNavigationClass : 'imageslide-navigation';
    this.slideNavigationPrevClass = (opts.slideNavigationPrevClass) ? opts.slideNavigationPrevClass : 'imageslide-previous-item';
    this.slideNavigationNextClass = (opts.slideNavigationNextClass) ? opts.slideNavigationNextClass : 'imageslide-next-item';
    
    // defaults
    this.timeOut = 0;
    this.maxPosition = 0;
    this.selectorNav;
    this.currentItem;
    this.slideAction = false;
    
    this.init = function()
    {
    	// scoping
        var _this = this;
        
        // set the width for the list so everything fits next to each other
        $(_this.selector + ' ul').css('width', (($(_this.selector + ' ul li').size())) * (_this.itemWidth));

        // act responsive
        if ( _this.responsive == true && _this.responsiveWidth > 0 ) {
        	if( $(window).width() < _this.responsiveWidth ) { 
        	
	        	_this.itemWidth = $(_this.selector).width();
	        	
	        	console.log(_this.selector);
	        	
	        	newUlWidth = _this.numItems * _this.itemWidth;
	        	$(_this.selector + ' ul').css('width', newUlWidth);
	        	$(_this.selector + ' ul li').css('width', _this.itemWidth);
	        	
	        	_this.skipLastItems = 0;
	        	
        	}
        }
        
        // first set the right overflow
        if (_this.container) {
            $(_this.selector + ' ' + _this.container).css('overflow', 'hidden');
        } else {
            $(_this.selector).css('overflow', 'hidden');   
        }
        
        // if items are skipped, remove them from numItems
        _this.numItems = _this.numItems - _this.skipLastItems;
        
        // set variable for maxPosition
        _this.maxPosition = parseInt(-((_this.numItems-1) * _this.itemWidth));
        // chrome fix for unknown 1px width extra which bugs last slide position
        _this.maxPosition = _this.maxPosition - 2;

        // set the nav-selector
        _this.selectorNav = '.' + _this.selector.substring(1, _this.selector.length) + '-nav';
        
        // create imageslide-navigation
        var navigation = '<div class="' + _this.slideNavigationClass + ' ' + _this.selectorNav.substring(1, _this.selectorNav.length) + '"><ul>';
        for (var i = 1; i <= _this.numItems; i++) {
            navigation += '<li><a href="#item-' + i + '"><span>'  + i + '</span></a></li>';
        }
        navigation += '</ul></div>';
        
        // place it after selector
        $(_this.selector).after(navigation);
        
        // bind actions to nav
        $(_this.selectorNav + ' ul li:not(.selected) a').live('click', function() { _this.moveToSelectedPosition(this.href); return false; });
        $(_this.selectorNav + ' ul li(.selected) a').live('click', function() { return false; });
        
        // if it's no slideshow, show previous and next button
        if (_this.slideshow == false) {
    
            var previousItem = '<div class="' + _this.slideNavigationPrevClass + '"><span><</span></div>';
            var nextItem = '<div class="' + _this.slideNavigationNextClass + '"><span>></span></div>';
            $(_this.selector).append(previousItem + nextItem);
            
            // bind actions to nav
            $(_this.selector + ' .' + _this.slideNavigationPrevClass).live('click', function() { _this.moveToPreviousItem(); return false; });
            $(_this.selector + ' .' + _this.slideNavigationNextClass).live('click', function() { _this.moveToNextItem(); return false; });
            
        }
        
        // set current slide
        _this.currentItem = 1;
        
        // show first slide
        _this.moveToPosition(0);
        
        // bind swipe events
       	$(_this.selector).swipeEvents()
           	.bind("swipeLeft", function(){
           		_this.slideAction = true;
           		_this.moveToNextItem(); return false;
           	})
           	.bind("swipeRight", function(){
           		_this.slideAction = true;
           		_this.moveToPreviousItem(); return false;
           	});
        
    }
    
    this.moveToSelectedPosition = function(href)
    {
        // scoping
        var _this = this;
        
        // get the selected item from href
        var selectedItem = href.substring((href.lastIndexOf('-') + 1), href.length);
        
        // calculate new position
        var newPosition = parseInt(-(parseInt(selectedItem)-1) * _this.itemWidth);
        
        // only navigate between animations, not during
        if (_this.animating === false) {
            
            // clear timeout
            clearTimeout(_this.timeOut);
            
            // set selected item for navigation
            _this.currentItem = selectedItem;
            
            // move position
            _this.moveToPosition(newPosition);
            
        }
        
    }
    
    this.moveToPosition = function(position)
    {   
        // scoping
        var _this = this;
        
        // set navigation
        $(_this.selectorNav + ' ul li').removeClass('selected');
        $(_this.selectorNav + ' ul li:nth-child(' + _this.currentItem + ')').addClass('selected');

        // set variable so no navigation can occur during animation
        _this.animating = true;
        
        $(_this.selector + ' ul').animate(
            { 'left' : position + 'px'}, 
            _this.speed,
            function () {

                // animation is done, navigation is active again
                _this.animating = false;
                
                // if it's a slideshow, make sure we go
                if (_this.slideshow == true) {
                    var newPosition = _this.getNewPosition();

                    _this.currentItem = parseInt(_this.currentItem) + 1;
                    if (_this.currentItem > parseInt(_this.numItems)) {
                        _this.currentItem = 1;
                    }
                    
                    _this.timeOut = setTimeout(function() { _this.moveToPosition(newPosition); }, _this.waittime);
                }
                
            }
        );        
        
    }
    
    this.getNewPosition = function()
    {
        // scoping
        var _this = this;
        
        // get current position
        var currentPosition = $(_this.selector + ' ul').position();

        // calculate new position
        var newPosition = currentPosition.left - _this.itemWidth;
        if (newPosition < _this.maxPosition) {
            newPosition = 0;
        }
        
        // return new position
        return newPosition;
    }
    
    this.moveToPreviousItem = function()
    {
        // scoping
        var _this = this;

        // only navigate between animations, not during
        if (_this.animating === false) {
        
        	// clear timeout
            clearTimeout(_this.timeOut);
            
            // current item
            _this.currentItem = parseInt(_this.currentItem) - 1;
            if (_this.currentItem <= 0) {
                _this.currentItem = _this.numItems;
            }
        
            // get current position
            var currentPosition = $(_this.selector + ' ul').position();
            
            // calculate new position
            var newPosition = currentPosition.left + _this.itemWidth;
            if (newPosition > 0) {
                newPosition = _this.maxPosition;
            }
            
            // move to new position
            _this.moveToPosition(newPosition);
        }
    }
    
    this.moveToNextItem = function()
    {
        // scoping
        var _this = this;

        // only navigate between animations, not during
        if (_this.animating === false) {
        
        	// clear timeout
            clearTimeout(_this.timeOut);
            
            // current item
            _this.currentItem = parseInt(_this.currentItem) + 1;
            if (_this.currentItem > _this.numItems) {
                _this.currentItem = 1;
            }
            
            // get current position
            var currentPosition = $(_this.selector + ' ul').position();
            
            // calculate new position
            var newPosition = currentPosition.left - _this.itemWidth;
            if (newPosition < _this.maxPosition) {
                newPosition = 0;
            }
            
            // move to new position
            _this.moveToPosition(newPosition);
        }
    }
    
    // swipe events, based on jquery.swipe-events.js
    $.fn.swipeEvents = function() {
    	return this.each(function() {
    	      
    		var startX, startY, $this = $(this);
    		$this.bind('touchstart', touchstart);
    	      
    		function touchstart(event) {
    			var touches = event.originalEvent.touches;
    			if (touches && touches.length) {
    				startX = touches[0].pageX;
    				startY = touches[0].pageY;
    				$this.bind('touchmove', touchmove);
    			}
    	    }
    	      
    		function touchmove(event) {
    	        var touches = event.originalEvent.touches;
    	        if (touches && touches.length) {
    	          var deltaX = startX - touches[0].pageX;
    	          var deltaY = startY - touches[0].pageY;
    	          
    	          if (deltaX >= 50) {
    	            $this.trigger("swipeLeft");
    	          }
    	          if (deltaX <= -50) {
    	            $this.trigger("swipeRight");
    	          }
    	          if (Math.abs(deltaX) >= 50) {
    	            $this.unbind('touchmove', touchmove);
    	            event.preventDefault();
    	          }
    	        }
    		}
    	      
    	});
    }
    
}
