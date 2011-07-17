/*
* rightClick - jQuery Plugin
* Shows right click context menu 
*
* Copyright (c) 2011 Urban Soban
*
* Version: 0.1 (07/04/2011)
* Requires: jQuery v1.3+
*
* To do: 
*   - Icons
*   - Disable default context menu on the context menu itself
*
* Dual licensed under GPL and MIT:
* http://www.gnu.org/licenses/gpl.html
* http://www.opensource.org/licenses/mit-license.php
*/

( function(){

    // Context menu
    function ContextMenu(list, options) {
        
        this.list = list;
        this.options = $.extend({}, $.fn.rightClick.defaults, options);
        
        this.buildMenu();
    }
    
    // Builds menu DOM structure
    ContextMenu.prototype.buildMenu = function(){
        
        var t = this;
        
        // Build menu container and empty list
       var menuContainer = $('<div></div>').addClass(t.options.container).addClass('rclick'),
       menuList = $('<ul></ul>').addClass(t.options.list);
       
       // Build menu items and attach them to the menu
       $.each(this.list, function(idx, properties) {
           var menuItem = $('<li></li>').addClass(t.options.item),
           menuItemLabel = $('<a>' + properties.label + '</a>')
                            .addClass(t.options.label)
                            .attr('href', '#')
                            .click(function(e){
                                    e.preventDefault();
                                    
                                    if ( properties.callback &&
                                        (typeof properties.callback) === 'function'
                                    ){
                                        properties.callback(); 
                                        t.hideMenu();
                                    }
                                });
         
           menuList.append(menuItem.append(menuItemLabel));
        });
        
        // Append menu list to the container
        menuContainer.append(menuList).hide();     
        this.menu = menuContainer;
        
        return false;
    };
    
    // Bind right click
    ContextMenu.prototype.bindRightClick = function(element){
        
        // Disable default context menu
        element.bind('contextmenu', function(){
            return false;
        });
                        
        // Bind right click to the selected dom element(s)
        element.mousedown(this.rightClickHandler);
    };
    
    // Mousedown handler (calls ContextMenu.prototype.showMenu)
    ContextMenu.prototype.rightClickHandler = function(event){
        
        if ( event.which === 3 ) {
            var contextMenu = $(this).data('rightclick');        
            
            // Detach all other active context menus (except if the same one)
            $('.rclick').each(function(){
                    if ( contextMenu.menu.css('left') !== $(this).css('left') ||
                         contextMenu.menu.css('top') !== $(this).css('top')
                        ){
                            $(this).hide(function(){
                                    $(this).detach();
                                });
                        }
                });
            
            // Show context menu
            contextMenu.showMenu(event);
            return false;
        }
    };
    
    // Bind left click to hide the context menu
    ContextMenu.prototype.bindLeftClick = function() {
        
        var t = this,
        menu = this.menu;
        
        $('body').mousedown(function(e){
            if(e.which === 1){
                var menuOffsetX = menu.offset().left,
				menuOffsetY = menu.offset().top,
				menuWidth = menu.width(),
				menuHeight = menu.height();
						
				if( e.pageX < menuOffsetX ||
                    e.pageX > (menuOffsetX + menuWidth) ||
                    e.pageY < menuOffsetY ||	e.pageY > (menuOffsetY + menuHeight)
				){
                    t.hideMenu(e);
				}
		    }
        });
        
        return false;
    };
        
     /* Displays menu */
    ContextMenu.prototype.showMenu = function(event) {
        
        var menu = this.menu;
        
        // Bind the left click to hide menu
        this.bindLeftClick();

        // Append menu to DOM and display it
        $('body').append(menu);
        menu.css('top', event.pageY+10 + 'px')
            .css('left', event.pageX+10 + 'px')
            .css('position', 'absolute')
            .show();
        
        return false;
    };
    
    /* Hides menu and executes callback, if provided */
    ContextMenu.prototype.hideMenu = function(event, callback) {
        
        this.menu.hide('slow', function(){
            $(this).detach();
            
            if ( (typeof callback) === 'function' ) {
                callback();    
            }
        });
        
        $('body').unbind(event);    // unbind left click
    };
    
    /* Plugin methods */
    var methods = {
        init    :   function(list, options){

                return this.each(function(){
                    
                    // Retreive element and attached dom data
                    var element = $(this),
                    contextMenu = element.data('rightclick');
                    
                    if ( ! contextMenu ) {
                        
                        // Create context menu and append it to the dom
                        contextMenu = new ContextMenu(list, options);
                        contextMenu.bindRightClick(element);
                        element.data('rightclick', contextMenu);
                    }      
                });
            },

        destroy :   function() {
            return this.each(function(){
                var el = $(this),
                contextMenu = el.data('rightclick');
                
                // Remove context menu, renew default context menu and delete dom data
                el.unbind('mousedown', ContextMenu.prototype.rightClickHandler);
                el.unbind('contextmenu');
                el.data('rightclick', null);
            });
        }
    };

	$.fn.rightClick = function(method){
		
		if(methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if(typeof method === 'object' || !method) {
			return methods[method].apply(this, arguments);
		}
		else {
			$.error('Method ' + method + ' does not exist on jQuery.rightClick');
		}
	};
        
    // Default options
    $.fn.rightClick.defaults = {
            container   :   'rclick-container',
            list        :   'rclick-list',
            item        :   'rclick-list-item',
            label       :   'rclick-list-item-label',
            icon        :   'rclick-list-item-icon'
        };
	
})( jQuery );