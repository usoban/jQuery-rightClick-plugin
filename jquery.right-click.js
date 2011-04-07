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

( function(){
	
	var methods = {
			
			init : function(menu_list, options){
				methods.setOptions(options);
				
				var rClickFrame = methods._domBuildMenu();
				rClickFrame.append(methods.setMenu(menu_list));
				$('body').append(rClickFrame);
				
				methods._disableDefaultContextMenu();
				methods._bindLeftClick();
				methods._bindRightClick();
			},
			
			_domBuildMenuList : function(menu_list){
				var rClickList = $('<ul id="rightclick-list"></ul>').addClass(options['list-class']);
				
				$.each(menu_list, function(index, menuObj){
					rClickList.append(methods._domBuildMenuListItem(menuObj));
				});
				
				return rClickList;				
			},
			
			_domBuildMenu : function(){
				var rClickFrame = $('<div id="rightclick"></div>').hide()
									.addClass(options['frame-class']);
				
				return rClickFrame;
			},
			
			_domBuildMenuListItem : function (menuItem){
				return $('<li></li>').addClass( options['list-item-class'] )
								  	.append(function() {
									  			return $('<a></a>').html(menuItem.text).attr('href', '#')
										  			  .addClass(options['list-item-label-class'])
										  			  .click(function(event){
										  				  	event.preventDefault();
										  				  	$('#rightclick').slideUp('fast', function(){
										  				  		menuItem.callback();
										  				  	});
										  			  })
										  			  .prepend(function(){
										  				  if(menuItem.icon_class){
										  					  return methods._domBuildMenuListItemIcon(menuItem.icon_class);
										  			  	  }
										  			  });
									  });
			},
			
			_domBuildMenuListItemIcon : function (class_name){
				return $('<span></span>').addClass( options['list-item-label-icon-class'] )
										 .addClass(class_name).html('&nbsp;');
			},
			
			_disableDefaultContextMenu : function(){
				$(document)[0].oncontextmenu = function() {
					return false;
				}; 
			},
			
			_bindLeftClick : function(){
				/* Bind right click to close the rightClick menu */
				$('body').mousedown(function(event){
					if(event.which == 1){
						var el = $('#rightclick');
						var menuOffsetX = el.offset().left;
						var menuOffsetY = el.offset().top;
						var menuWidth = el.width();
						var menuHeight = el.height();
						
						if(
								event.pageX < menuOffsetX ||
								event.pageX > (menuOffsetX + menuWidth) ||
								event.pageY < menuOffsetY ||
								event.pageY > (menuOffsetY + menuHeight)
						 ){
							$('#rightclick').hide('slow');
						}
					}
				});
			},
			
			_bindRightClick : function(){
				$('body').mousedown(function(event){
					
					if(event.which == 3){
						event.preventDefault();
						$('#rightclick').css('top', event.pageY-10 + 'px').css('left', event.pageX-10);
						$('#rightclick').show();
						$('#rightclick').css('position', 'absolute');
					}
					
				});
			},
			
			setMenu : function(menu_list){
				var domObj = methods._domBuildMenuList(menu_list);
				
				return domObj;
			},
			
			setOptions : function(optionsArray){
				if(optionsArray === undefined){
					return this;
				}
				
				for(var property in optionsArray){
					if(optionsArray.hasOwnProperty(property)){
						options[property] = optionsArray[property];
					}
				}
			}
	};
	
	var options = {
			'frame-class' : 'rightclick-frame',
			'list-class' : 'rightclick-list',
			'list-item-class' : 'rightclick-list-item',
			'list-item-label-class' : 'rightclick-list-item-label',
			'list-item-label-icon-class' : 'rightclick-list-item-label-icon'
	};
	
	var menu = [
			{ text : 'Test' },
			{ text : 'Test 2' }
	];
	
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