/*
* rightClick - jQuery Plugin
* Shows right click context menu 
*
* Copyright (c) 2011 Urban Soban
*
* Version: 0.1 (07/04/2011)
* Requires: jQuery v1.3+
*
* Dual licensed under GPL and MIT:
* http://www.gnu.org/licenses/gpl.html
* http://www.opensource.org/licenses/mit-license.php
*/
var EvilGlobal = [];

( function(){

    // Context menu
    function ContextMenu(list, options) {
        this.list = list;
        this.options = options;
        
        this.buildMenu();
    }
    
    // Builds menu DOM structure
    ContextMenu.prototype.buildMenu = function(){
        
        // Build menu container and empty list
       var menuContainer = $('<div></div>').addClass('rclick-container'),
       menuList = $('<ul></ul>').addClass('rclick-list');
       
       // Build menu items and attach them to the menu
       $.each(this.list, function(idx, properties) {
           var menuItem = $('<li></li>').addClass('rclick-list-item'),
           menuItemLabel = $('<a>' + properties.label + '</a>')
                            .addClass('rclick-list-item-label')
                            .attr('href', '#')
                            .click(function(e){
                                    e.preventDefault();
                                    
                                    if ( properties.callback &&
                                        (typeof properties.callback) === 'function'
                                    ){
                                        properties.callback();    
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
            $(this).data('rightclick').showMenu(event);
            return false;
        }
    };
    
    // Bind left click to hide the context menu
    ContextMenu.prototype.bindLeftClick = function() {
        var t = this,
        menu = this.menu;
        
        $('body').mousedown(function(e){
            if(e.which === 1 || e.which === 3){
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
    
        var show = function() {
            // Append menu to DOM and display it
            $('body').append(menu);
        
            menu.css('top', event.pageY+10 + 'px')
                .css('left', event.pageX+10 + 'px')
                .css('position', 'absolute')
                .show();
        };
    
        var existingContextMenus = $('.rclick-container');
        
        // If menu already exists, remove it and show the new one
        // @TODO: refactor to use ContextMenu.prototype.hideMenu()
        if ( existingContextMenus.length > 0 ) {
            existingContextMenus.hide('slow',
                function() {
                    $(this).detach();
                    show();
            });
        }
        
        // else just show it
        else {
            show();    
        }
            
        return false;
    };
    
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
	
})( jQuery );